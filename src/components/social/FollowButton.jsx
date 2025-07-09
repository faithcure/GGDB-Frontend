import React, { useState, useEffect } from 'react';
import { 
  UserPlus, 
  UserCheck, 
  UserX, 
  Clock, 
  MessageCircle, 
  Users,
  Heart
} from 'lucide-react';
import axios from 'axios';
import { useUser } from '../../context/UserContext';
import { toast } from 'react-toastify';

const FollowButton = ({ 
  targetUserId, 
  targetUsername,
  size = "default",
  showMessageButton = true,
  connectionType = "follow" // "follow" or "friend"
}) => {
  const { user } = useUser();
  const [connectionStatus, setConnectionStatus] = useState(null);
  const [loading, setLoading] = useState(false);
  const [isMutual, setIsMutual] = useState(false);

  // Size variants
  const sizeClasses = {
    small: "px-3 py-1.5 text-sm",
    default: "px-4 py-2 text-sm", 
    large: "px-6 py-3 text-base"
  };

  useEffect(() => {
    if (user && targetUserId && user.id !== targetUserId) {
      checkConnectionStatus();
    }
  }, [user, targetUserId]);

  const checkConnectionStatus = async () => {
    try {
      const response = await axios.get(`/api/connections/user/${targetUserId}`, {
        params: { 
          type: connectionType,
          status: 'all' 
        }
      });

      const connections = response.data.connections || [];
      const currentConnection = connections.find(conn => 
        (conn.requester._id === (user._id || user.id) && conn.recipient._id === targetUserId) ||
        (conn.recipient._id === (user._id || user.id) && conn.requester._id === targetUserId)
      );

      if (currentConnection) {
        setConnectionStatus(currentConnection.status);
        setIsMutual(currentConnection.isMutual);
      } else {
        setConnectionStatus(null);
      }
    } catch (error) {
      console.error('Error checking connection status:', error);
    }
  };

  const handleConnectionAction = async (action) => {
    if (!user) {
      toast.error('Please login to connect with users');
      return;
    }

    setLoading(true);
    try {
      switch (action) {
        case 'follow':
        case 'friend':
          await axios.post('/api/connections/request', {
            recipientId: targetUserId,
            connectionType: action,
            source: 'profile'
          });
          
          setConnectionStatus(action === 'follow' ? 'accepted' : 'pending');
          toast.success(`${action === 'follow' ? 'Following' : 'Friend request sent to'} ${targetUsername}!`);
          break;

        case 'unfollow':
          const response = await axios.get(`/api/connections/user/${user._id || user.id}`);
          const connection = response.data.connections.find(conn => 
            (conn.requester._id === (user._id || user.id) && conn.recipient._id === targetUserId) ||
            (conn.recipient._id === (user._id || user.id) && conn.requester._id === targetUserId)
          );
          
          if (connection) {
            await axios.delete(`/api/connections/${connection._id}`);
            setConnectionStatus(null);
            setIsMutual(false);
            toast.success(`Unfollowed ${targetUsername}`);
          }
          break;

        case 'accept':
          // For accepting friend requests - need connection ID
          toast.info('Accept functionality needs connection ID');
          break;

        case 'message':
          // Open message modal or navigate to messages
          window.location.href = `/messages?user=${targetUserId}`;
          break;
      }
    } catch (error) {
      console.error('Connection action error:', error);
      toast.error(error.response?.data?.error || 'Failed to perform action');
    } finally {
      setLoading(false);
    }
  };

  // Don't show button for own profile
  if (!user || (user._id || user.id) === targetUserId) {
    return null;
  }

  const renderButton = () => {
    if (loading) {
      return (
        <button 
          disabled
          className={`${sizeClasses[size]} bg-gray-600 text-gray-300 rounded-lg font-medium cursor-not-allowed flex items-center space-x-2`}
        >
          <div className="w-4 h-4 border-2 border-gray-300 border-t-transparent rounded-full animate-spin"></div>
          <span>Loading...</span>
        </button>
      );
    }

    // Connection status display
    switch (connectionStatus) {
      case 'accepted':
        if (connectionType === 'follow') {
          return (
            <div className="flex items-center space-x-2">
              <button
                onClick={() => handleConnectionAction('unfollow')}
                className={`${sizeClasses[size]} bg-green-600 hover:bg-red-600 text-white rounded-lg font-medium transition-all duration-200 flex items-center space-x-2 group`}
              >
                <UserCheck className="w-4 h-4 group-hover:hidden" />
                <UserX className="w-4 h-4 hidden group-hover:block" />
                <span className="group-hover:hidden">
                  {isMutual ? 'Friends' : 'Following'}
                </span>
                <span className="hidden group-hover:block">Unfollow</span>
                {isMutual && <Heart className="w-3 h-3 text-red-400" />}
              </button>
              
              {showMessageButton && (
                <button
                  onClick={() => handleConnectionAction('message')}
                  className={`${sizeClasses[size]} bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors flex items-center space-x-2`}
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>Message</span>
                </button>
              )}
            </div>
          );
        } else {
          return (
            <div className="flex items-center space-x-2">
              <button
                className={`${sizeClasses[size]} bg-green-600 text-white rounded-lg font-medium flex items-center space-x-2`}
                disabled
              >
                <Users className="w-4 h-4" />
                <span>Friends</span>
              </button>
              
              {showMessageButton && (
                <button
                  onClick={() => handleConnectionAction('message')}
                  className={`${sizeClasses[size]} bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors flex items-center space-x-2`}
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>Message</span>
                </button>
              )}
            </div>
          );
        }

      case 'pending':
        return (
          <button
            className={`${sizeClasses[size]} bg-yellow-600 text-black rounded-lg font-medium flex items-center space-x-2 cursor-default`}
            disabled
          >
            <Clock className="w-4 h-4" />
            <span>
              {connectionType === 'follow' ? 'Following' : 'Request Sent'}
            </span>
          </button>
        );

      case 'rejected':
        return (
          <button
            className={`${sizeClasses[size]} bg-gray-600 text-gray-300 rounded-lg font-medium cursor-default`}
            disabled
          >
            Request Declined
          </button>
        );

      default:
        return (
          <button
            onClick={() => handleConnectionAction(connectionType)}
            className={`${sizeClasses[size]} bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-400 hover:to-orange-400 text-black font-medium rounded-lg transition-all duration-200 flex items-center space-x-2`}
          >
            <UserPlus className="w-4 h-4" />
            <span>
              {connectionType === 'follow' ? 'Follow' : 'Add Friend'}
            </span>
          </button>
        );
    }
  };

  return (
    <div className="flex items-center">
      {renderButton()}
    </div>
  );
};

export default FollowButton;