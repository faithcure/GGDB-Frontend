import React, { useState, useEffect, useRef } from 'react';
import { 
  MessageCircle, 
  Send, 
  Search, 
  X, 
  MoreVertical,
  Image,
  Gamepad2,
  Heart,
  Smile,
  Phone,
  Video,
  Archive,
  Trash2
} from 'lucide-react';
import axios from 'axios';
import { useUser } from '../../context/UserContext';
import { toast } from 'react-toastify';

const MessageCenter = ({ isOpen, onClose, initialUserId = null }) => {
  const { user } = useUser();
  const [conversations, setConversations] = useState([]);
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const messagesEndRef = useRef(null);

  useEffect(() => {
    if (isOpen && user) {
      fetchConversations();
    }
  }, [isOpen, user]);

  useEffect(() => {
    if (selectedConversation) {
      fetchMessages(selectedConversation.conversationId);
    }
  }, [selectedConversation]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const fetchConversations = async () => {
    try {
      const response = await axios.get('/api/messages/conversations');
      setConversations(response.data.conversations || []);
    } catch (error) {
      console.error('Error fetching conversations:', error);
    }
  };

  const fetchMessages = async (conversationId) => {
    try {
      setLoading(true);
      const response = await axios.get(`/api/messages/conversation/${conversationId}`);
      setMessages(response.data.messages || []);
      
      // Mark conversation as read
      await axios.put(`/api/messages/conversation/${conversationId}/read`);
    } catch (error) {
      console.error('Error fetching messages:', error);
    } finally {
      setLoading(false);
    }
  };

  const sendMessage = async () => {
    if (!newMessage.trim() || !selectedConversation) return;

    try {
      const otherParticipant = selectedConversation.otherParticipants[0];
      
      const response = await axios.post('/api/messages/send', {
        recipientId: otherParticipant._id,
        content: {
          text: newMessage,
          type: 'text'
        }
      });

      setMessages(prev => [...prev, response.data.data]);
      setNewMessage('');
      
      // Update conversation list
      fetchConversations();
    } catch (error) {
      console.error('Error sending message:', error);
      toast.error('Failed to send message');
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const formatTime = (timestamp) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diff = now - date;
    
    if (diff < 60000) return 'now';
    if (diff < 3600000) return `${Math.floor(diff / 60000)}m`;
    if (diff < 86400000) return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    return date.toLocaleDateString();
  };

  const ConversationItem = ({ conversation }) => {
    const otherUser = conversation.otherParticipants?.[0];
    const lastMessage = conversation.lastMessage;
    
    return (
      <div 
        onClick={() => setSelectedConversation(conversation)}
        className={`p-4 border-b border-gray-800 hover:bg-gray-800/50 cursor-pointer transition-colors ${
          selectedConversation?._id === conversation._id ? 'bg-gray-800/70' : ''
        }`}
      >
        <div className="flex items-center space-x-3">
          <div className="relative">
            <img
              src={otherUser?.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(otherUser?.username || 'User')}&background=random&color=fff&size=40`}
              alt={otherUser?.username}
              className="w-10 h-10 rounded-full object-cover"
            />
            {conversation.unreadCount > 0 && (
              <div className="absolute -top-1 -right-1 bg-yellow-500 text-black text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold">
                {conversation.unreadCount}
              </div>
            )}
          </div>
          
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between">
              <h4 className="font-semibold text-white truncate">
                {otherUser?.username || 'Unknown User'}
              </h4>
              <span className="text-xs text-gray-400">
                {formatTime(lastMessage?.createdAt)}
              </span>
            </div>
            
            <p className="text-sm text-gray-400 truncate">
              {lastMessage?.preview || 'No messages yet'}
            </p>
          </div>
        </div>
      </div>
    );
  };

  const MessageBubble = ({ message }) => {
    const isOwn = message.sender._id === (user._id || user.id);
    
    return (
      <div className={`flex mb-4 ${isOwn ? 'justify-end' : 'justify-start'}`}>
        {!isOwn && (
          <img
            src={message.sender.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(message.sender.username)}&background=random&color=fff&size=32`}
            alt={message.sender.username}
            className="w-8 h-8 rounded-full object-cover mr-2"
          />
        )}
        
        <div className={`max-w-xs lg:max-w-md px-4 py-2 rounded-2xl ${
          isOwn 
            ? 'bg-gradient-to-r from-yellow-500 to-orange-500 text-black' 
            : 'bg-gray-800 text-white'
        }`}>
          {message.content.type === 'game_share' ? (
            <div className="space-y-2">
              <div className="flex items-center space-x-2 p-2 bg-black/20 rounded-lg">
                <Gamepad2 className="w-4 h-4" />
                <img
                  src={message.content.gameReference?.gameImage}
                  alt={message.content.gameReference?.gameTitle}
                  className="w-8 h-8 rounded object-cover"
                />
                <span className="text-xs font-medium">
                  {message.content.gameReference?.gameTitle}
                </span>
              </div>
              <p className="text-sm">{message.content.text}</p>
            </div>
          ) : (
            <p className="text-sm whitespace-pre-wrap">{message.content.text}</p>
          )}
          
          <div className="flex items-center justify-between mt-1">
            <span className={`text-xs ${isOwn ? 'text-black/70' : 'text-gray-400'}`}>
              {formatTime(message.createdAt)}
            </span>
            
            {message.metadata?.edited && (
              <span className={`text-xs ${isOwn ? 'text-black/70' : 'text-gray-400'}`}>
                edited
              </span>
            )}
          </div>
          
          {/* Reactions */}
          {message.metadata?.reactions?.length > 0 && (
            <div className="flex space-x-1 mt-2">
              {message.metadata.reactions.map((reaction, index) => (
                <span key={index} className="text-sm">
                  {reaction.emoji}
                </span>
              ))}
            </div>
          )}
        </div>
        
        {isOwn && (
          <img
            src={user.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.username)}&background=random&color=fff&size=32`}
            alt={user.username}
            className="w-8 h-8 rounded-full object-cover ml-2"
          />
        )}
      </div>
    );
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-gray-900 border border-gray-800 rounded-2xl w-full max-w-6xl h-[80vh] flex overflow-hidden">
        {/* Conversations Sidebar */}
        <div className="w-1/3 border-r border-gray-800 flex flex-col">
          {/* Header */}
          <div className="p-4 border-b border-gray-800 flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <MessageCircle className="w-6 h-6 text-yellow-500" />
              <h2 className="text-xl font-bold text-white">Messages</h2>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-800 rounded-lg transition-colors"
            >
              <X className="w-5 h-5 text-gray-400" />
            </button>
          </div>
          
          {/* Search */}
          <div className="p-4 border-b border-gray-800">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search conversations..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:border-yellow-500 focus:ring-1 focus:ring-yellow-500 transition-colors"
              />
            </div>
          </div>
          
          {/* Conversations List */}
          <div className="flex-1 overflow-y-auto">
            {conversations.length === 0 ? (
              <div className="p-8 text-center text-gray-400">
                <MessageCircle className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p>No conversations yet</p>
                <p className="text-sm">Start a conversation with someone!</p>
              </div>
            ) : (
              conversations
                .filter(conv => 
                  !searchQuery || 
                  conv.otherParticipants?.[0]?.username?.toLowerCase().includes(searchQuery.toLowerCase())
                )
                .map(conversation => (
                  <ConversationItem 
                    key={conversation._id} 
                    conversation={conversation} 
                  />
                ))
            )}
          </div>
        </div>

        {/* Chat Area */}
        <div className="flex-1 flex flex-col">
          {selectedConversation ? (
            <>
              {/* Chat Header */}
              <div className="p-4 border-b border-gray-800 flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <img
                    src={selectedConversation.otherParticipants?.[0]?.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(selectedConversation.otherParticipants?.[0]?.username || 'User')}&background=random&color=fff&size=40`}
                    alt={selectedConversation.otherParticipants?.[0]?.username}
                    className="w-10 h-10 rounded-full object-cover"
                  />
                  <div>
                    <h3 className="font-semibold text-white">
                      {selectedConversation.otherParticipants?.[0]?.username}
                    </h3>
                    <p className="text-sm text-gray-400">Active now</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-2">
                  <button className="p-2 hover:bg-gray-800 rounded-lg transition-colors">
                    <Phone className="w-5 h-5 text-gray-400" />
                  </button>
                  <button className="p-2 hover:bg-gray-800 rounded-lg transition-colors">
                    <Video className="w-5 h-5 text-gray-400" />
                  </button>
                  <button className="p-2 hover:bg-gray-800 rounded-lg transition-colors">
                    <MoreVertical className="w-5 h-5 text-gray-400" />
                  </button>
                </div>
              </div>

              {/* Messages Area */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {loading ? (
                  <div className="flex items-center justify-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-yellow-500"></div>
                  </div>
                ) : (
                  messages.map(message => (
                    <MessageBubble key={message._id} message={message} />
                  ))
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Message Input */}
              <div className="p-4 border-t border-gray-800">
                <div className="flex items-center space-x-3">
                  <button className="p-2 hover:bg-gray-800 rounded-lg transition-colors">
                    <Image className="w-5 h-5 text-gray-400" />
                  </button>
                  <button className="p-2 hover:bg-gray-800 rounded-lg transition-colors">
                    <Gamepad2 className="w-5 h-5 text-gray-400" />
                  </button>
                  
                  <div className="flex-1 relative">
                    <textarea
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      onKeyPress={handleKeyPress}
                      placeholder="Type a message..."
                      rows={1}
                      className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:border-yellow-500 focus:ring-1 focus:ring-yellow-500 transition-colors resize-none"
                    />
                  </div>
                  
                  <button className="p-2 hover:bg-gray-800 rounded-lg transition-colors">
                    <Smile className="w-5 h-5 text-gray-400" />
                  </button>
                  
                  <button
                    onClick={sendMessage}
                    disabled={!newMessage.trim()}
                    className="p-2 bg-gradient-to-r from-yellow-500 to-orange-500 text-black rounded-lg hover:from-yellow-400 hover:to-orange-400 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Send className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center text-gray-400">
              <div className="text-center">
                <MessageCircle className="w-16 h-16 mx-auto mb-4 opacity-50" />
                <h3 className="text-xl font-semibold mb-2">Select a conversation</h3>
                <p>Choose a conversation from the left to start messaging</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MessageCenter;