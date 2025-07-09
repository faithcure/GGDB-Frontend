import React, { useState, useEffect } from 'react';
import { 
  UserPlus, 
  Users, 
  Check, 
  X, 
  Clock, 
  MessageCircle,
  Search,
  Filter,
  UserMinus
} from 'lucide-react';
import axios from 'axios';
import { useUser } from '../context/UserContext';
import FollowButton from '../components/social/FollowButton';
import { toast } from 'react-toastify';

const ConnectionsPage = () => {
  const { user } = useUser();
  const [activeTab, setActiveTab] = useState('received');
  const [pendingRequests, setPendingRequests] = useState([]);
  const [sentRequests, setSentRequests] = useState([]);
  const [connections, setConnections] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  const tabs = [
    { id: 'received', label: 'Received', icon: UserPlus, color: 'text-green-500' },
    { id: 'sent', label: 'Sent', icon: Clock, color: 'text-yellow-500' },
    { id: 'following', label: 'Following', icon: Users, color: 'text-blue-500' },
    { id: 'followers', label: 'Followers', icon: Users, color: 'text-purple-500' }
  ];

  useEffect(() => {
    if (user) {
      fetchConnectionData();
    }
  }, [user, activeTab]);

  const fetchConnectionData = async () => {
    try {
      setLoading(true);
      
      switch (activeTab) {
        case 'received':
          const receivedRes = await axios.get('/api/connections/pending?type=received');
          setPendingRequests(receivedRes.data.requests || []);
          break;
          
        case 'sent':
          const sentRes = await axios.get('/api/connections/pending?type=sent');
          setSentRequests(sentRes.data.requests || []);
          break;
          
        case 'following':
          const followingRes = await axios.get(`/api/connections/user/${user._id || user.id}?type=follow&status=accepted`);
          const following = followingRes.data.connections.filter(conn => 
            conn.requester._id === (user._id || user.id)
          );
          setConnections(following);
          break;
          
        case 'followers':
          const followersRes = await axios.get(`/api/connections/user/${user._id || user.id}?type=follow&status=accepted`);
          const followers = followersRes.data.connections.filter(conn => 
            conn.recipient._id === (user._id || user.id)
          );
          setConnections(followers);
          break;
      }
    } catch (error) {
      console.error('Error fetching connection data:', error);
      toast.error('Failed to load connections');
    } finally {
      setLoading(false);
    }
  };

  const handleAcceptRequest = async (requestId) => {
    try {
      await axios.put(`/api/connections/${requestId}/accept`);
      toast.success('Connection request accepted!');
      fetchConnectionData();
    } catch (error) {
      console.error('Error accepting request:', error);
      toast.error('Failed to accept request');
    }
  };

  const handleRejectRequest = async (requestId) => {
    try {
      await axios.put(`/api/connections/${requestId}/reject`);
      toast.success('Connection request rejected');
      fetchConnectionData();
    } catch (error) {
      console.error('Error rejecting request:', error);
      toast.error('Failed to reject request');
    }
  };

  const handleRemoveConnection = async (connectionId) => {
    if (!window.confirm('Are you sure you want to remove this connection?')) {
      return;
    }

    try {
      await axios.delete(`/api/connections/${connectionId}`);
      toast.success('Connection removed');
      fetchConnectionData();
    } catch (error) {
      console.error('Error removing connection:', error);
      toast.error('Failed to remove connection');
    }
  };

  const filteredData = () => {
    const query = searchQuery.toLowerCase();
    
    switch (activeTab) {
      case 'received':
        return pendingRequests.filter(req => 
          req.requester?.username?.toLowerCase().includes(query)
        );
      case 'sent':
        return sentRequests.filter(req => 
          req.recipient?.username?.toLowerCase().includes(query)
        );
      case 'following':
      case 'followers':
        return connections.filter(conn => 
          conn.connectedUser?.username?.toLowerCase().includes(query)
        );
      default:
        return [];
    }
  };

  const getTabCount = (tabId) => {
    switch (tabId) {
      case 'received': return pendingRequests.length;
      case 'sent': return sentRequests.length;
      case 'following': return connections.filter(c => c.requester._id === (user?._id || user?.id)).length;
      case 'followers': return connections.filter(c => c.recipient._id === (user?._id || user?.id)).length;
      default: return 0;
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-950 text-white pt-20">
        <div className="max-w-4xl mx-auto px-4 py-12 text-center">
          <Users className="w-16 h-16 text-gray-600 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-gray-400 mb-2">Please Login</h1>
          <p className="text-gray-500">You need to login to manage your connections.</p>
        </div>
      </div>
    );
  }

  const PendingRequestCard = ({ request, type }) => {
    const otherUser = type === 'received' ? request.requester : request.recipient;
    
    return (
      <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-4 hover:border-yellow-500/50 transition-all duration-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <img
              src={otherUser?.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(otherUser?.username || 'User')}&background=random&color=fff&size=48`}
              alt={otherUser?.username}
              className="w-12 h-12 rounded-full object-cover"
            />
            <div>
              <h3 className="font-semibold text-white">{otherUser?.username}</h3>
              <p className="text-sm text-gray-400">
                {type === 'received' ? 'Wants to follow you' : 'Pending request'}
              </p>
              <p className="text-xs text-gray-500">
                {new Date(request.createdAt).toLocaleDateString()}
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            {type === 'received' ? (
              <>
                <button
                  onClick={() => handleAcceptRequest(request._id)}
                  className="p-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors"
                  title="Accept"
                >
                  <Check className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleRejectRequest(request._id)}
                  className="p-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
                  title="Reject"
                >
                  <X className="w-4 h-4" />
                </button>
              </>
            ) : (
              <span className="px-3 py-1 bg-yellow-600/20 text-yellow-400 rounded-lg text-sm flex items-center space-x-1">
                <Clock className="w-3 h-3" />
                <span>Pending</span>
              </span>
            )}
          </div>
        </div>
      </div>
    );
  };

  const ConnectionCard = ({ connection }) => {
    const otherUser = connection.connectedUser;
    
    return (
      <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-4 hover:border-yellow-500/50 transition-all duration-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <img
              src={otherUser?.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(otherUser?.username || 'User')}&background=random&color=fff&size=48`}
              alt={otherUser?.username}
              className="w-12 h-12 rounded-full object-cover"
            />
            <div>
              <h3 className="font-semibold text-white">{otherUser?.username}</h3>
              <p className="text-sm text-gray-400">
                {connection.isMutual ? 'Mutual connection' : 'Following'}
              </p>
              <p className="text-xs text-gray-500">
                Connected {new Date(connection.createdAt).toLocaleDateString()}
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={() => window.location.href = `/messages?user=${otherUser._id}`}
              className="p-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
              title="Message"
            >
              <MessageCircle className="w-4 h-4" />
            </button>
            <button
              onClick={() => handleRemoveConnection(connection._id)}
              className="p-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
              title="Remove Connection"
            >
              <UserMinus className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-950 text-white pt-20">
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Page Header */}
        <div className="mb-8">
          <div className="flex items-center space-x-3 mb-4">
            <Users className="w-8 h-8 text-yellow-500" />
            <h1 className="text-3xl font-bold text-white">My Connections</h1>
          </div>
          <p className="text-gray-400 text-lg">
            Manage your gaming network and connection requests
          </p>
        </div>

        {/* Tabs */}
        <div className="mb-8">
          <div className="flex flex-wrap gap-2 bg-gray-900/50 backdrop-blur-sm border border-gray-800 rounded-2xl p-2">
            {tabs.map(tab => {
              const Icon = tab.icon;
              const count = getTabCount(tab.id);
              
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center space-x-2 px-4 py-3 rounded-xl font-medium transition-all duration-200 ${
                    activeTab === tab.id
                      ? 'bg-yellow-500 text-black'
                      : 'text-gray-300 hover:text-white hover:bg-gray-800'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{tab.label}</span>
                  {count > 0 && (
                    <span className={`text-xs font-bold px-2 py-1 rounded-full ${
                      activeTab === tab.id 
                        ? 'bg-black/20 text-black' 
                        : 'bg-gray-700 text-white'
                    }`}>
                      {count}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Search */}
        <div className="mb-6">
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search connections..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:border-yellow-500 focus:ring-1 focus:ring-yellow-500 transition-colors"
            />
          </div>
        </div>

        {/* Content */}
        <div className="bg-gray-900/50 backdrop-blur-sm border border-gray-800 rounded-2xl p-6">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-yellow-500"></div>
            </div>
          ) : (
            <div className="space-y-4">
              {activeTab === 'received' && filteredData().map(request => (
                <PendingRequestCard key={request._id} request={request} type="received" />
              ))}

              {activeTab === 'sent' && filteredData().map(request => (
                <PendingRequestCard key={request._id} request={request} type="sent" />
              ))}

              {(activeTab === 'following' || activeTab === 'followers') && filteredData().map(connection => (
                <ConnectionCard key={connection._id} connection={connection} />
              ))}

              {filteredData().length === 0 && (
                <div className="text-center py-12">
                  <Users className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-gray-400 mb-2">
                    {searchQuery ? 'No results found' : `No ${activeTab} connections`}
                  </h3>
                  <p className="text-gray-500">
                    {searchQuery 
                      ? 'Try a different search term'
                      : `You don't have any ${activeTab} connections yet.`
                    }
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ConnectionsPage;