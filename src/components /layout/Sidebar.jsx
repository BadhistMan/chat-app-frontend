import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useChat } from '../../context/ChatContext';
import { useAuth } from '../../context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FiSearch,
  FiMessageSquare,
  FiUsers,
  FiSettings,
  FiLogOut,
  FiUser,
  FiChevronRight,
  FiMoreVertical,
  FiCheck,
  FiX
} from 'react-icons/fi';
import { formatDistanceToNow } from 'date-fns';
import toast from 'react-hot-toast';

const Sidebar = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [showSearchResults, setShowSearchResults] = useState(false);
  const [searchResults, setSearchResults] = useState([]);
  const [showNewChat, setShowNewChat] = useState(false);
  const [showChatRequests, setShowChatRequests] = useState(false);
  const [chatRequests, setChatRequests] = useState([]);
  
  const { chats, activeChat, setActiveChat, loadChats, onlineUsers } = useChat();
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    loadChats();
    // Load chat requests
    // This would be replaced with actual API call
  }, []);

  const handleSearch = async (e) => {
    const term = e.target.value;
    setSearchTerm(term);
    
    if (term.length > 1) {
      // Simulate search - replace with actual API call
      const results = [
        { id: 1, username: 'john_doe', is_online: true },
        { id: 2, username: 'jane_smith', is_online: false },
      ].filter(u => 
        u.username.toLowerCase().includes(term.toLowerCase())
      );
      setSearchResults(results);
      setShowSearchResults(true);
    } else {
      setShowSearchResults(false);
    }
  };

  const handleStartChat = async (userId) => {
    try {
      // API call to send chat request
      toast.success('Chat request sent!');
      setShowNewChat(false);
      setSearchTerm('');
      setShowSearchResults(false);
    } catch (error) {
      toast.error('Failed to send chat request');
    }
  };

  const handleChatRequest = async (requestId, accept) => {
    try {
      // API call to respond to chat request
      if (accept) {
        toast.success('Chat request accepted!');
      } else {
        toast.success('Chat request declined');
      }
      
      setChatRequests(prev => prev.filter(req => req.id !== requestId));
    } catch (error) {
      toast.error('Failed to process request');
    }
  };

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const getLastSeen = (lastSeen) => {
    if (!lastSeen) return 'Never seen';
    return formatDistanceToNow(new Date(lastSeen), { addSuffix: true });
  };

  return (
    <div className="flex flex-col h-full bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700">
      {/* Header */}
      <div className="p-4 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div className="relative">
              <img
                src={user?.profile_picture || `https://ui-avatars.com/api/?name=${user?.username}&background=random`}
                alt={user?.username}
                className="w-10 h-10 rounded-full"
              />
              {user?.is_online && (
                <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white dark:border-gray-800"></div>
              )}
            </div>
            <div>
              <h2 className="font-semibold text-gray-900 dark:text-white">
                {user?.username}
              </h2>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {user?.is_online ? 'Online' : getLastSeen(user?.last_seen)}
              </p>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setShowNewChat(true)}
              className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700"
              title="New chat"
            >
              <FiMessageSquare className="w-5 h-5" />
            </button>
            <button
              onClick={() => setShowChatRequests(true)}
              className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 relative"
              title="Chat requests"
            >
              <FiUsers className="w-5 h-5" />
              {chatRequests.length > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                  {chatRequests.length}
                </span>
              )}
            </button>
          </div>
        </div>

        {/* Search Bar */}
        <div className="relative">
          <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={handleSearch}
            placeholder="Search messages or users..."
            className="w-full pl-10 pr-4 py-2 bg-gray-100 dark:bg-gray-700 rounded-lg border-none text-gray-900 dark:text-white placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:bg-white dark:focus:bg-gray-600 outline-none transition"
          />
        </div>

        {/* Search Results */}
        <AnimatePresence>
          {showSearchResults && searchResults.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="absolute z-10 mt-2 w-[calc(100%-2rem)] bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 max-h-64 overflow-y-auto"
            >
              {searchResults.map((result) => (
                <div
                  key={result.id}
                  className="p-3 hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer flex items-center justify-between"
                  onClick={() => handleStartChat(result.id)}
                >
                  <div className="flex items-center space-x-3">
                    <div className="relative">
                      <img
                        src={`https://ui-avatars.com/api/?name=${result.username}&background=random`}
                        alt={result.username}
                        className="w-8 h-8 rounded-full"
                      />
                      {result.is_online && (
                        <div className="absolute bottom-0 right-0 w-2 h-2 bg-green-500 rounded-full border border-white dark:border-gray-800"></div>
                      )}
                    </div>
                    <span className="font-medium text-gray-900 dark:text-white">
                      {result.username}
                    </span>
                  </div>
                  <FiChevronRight className="text-gray-400" />
                </div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Chat List */}
      <div className="flex-1 overflow-y-auto">
        {chats.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full p-8 text-center">
            <div className="w-24 h-24 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mb-4">
              <FiMessageSquare className="w-12 h-12 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
              No chats yet
            </h3>
            <p className="text-gray-500 dark:text-gray-400 mb-4">
              Start a new conversation by searching for users
            </p>
            <button
              onClick={() => setShowNewChat(true)}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
            >
              Start New Chat
            </button>
          </div>
        ) : (
          <div className="divide-y divide-gray-100 dark:divide-gray-700">
            {chats.map((chat) => (
              <div
                key={chat.id}
                className={`p-4 hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer transition ${
                  activeChat?.id === chat.id ? 'bg-blue-50 dark:bg-gray-700' : ''
                }`}
                onClick={() => setActiveChat(chat)}
              >
                <div className="flex items-center space-x-3">
                  <div className="relative">
                    <img
                      src={chat.other_user_profile_picture || `https://ui-avatars.com/api/?name=${chat.other_user_username}&background=random`}
                      alt={chat.other_user_username}
                      className="w-12 h-12 rounded-full"
                    />
                    {onlineUsers.has(chat.other_user_id) && (
                      <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white dark:border-gray-800"></div>
                    )}
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <h3 className="font-semibold text-gray-900 dark:text-white truncate">
                        {chat.other_user_username}
                      </h3>
                      <span className="text-xs text-gray-500 dark:text-gray-400">
                        {chat.last_message_time && 
                          formatDistanceToNow(new Date(chat.last_message_time), { addSuffix: true })
                        }
                      </span>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <p className="text-sm text-gray-600 dark:text-gray-300 truncate">
                        {chat.last_message_content || 'No messages yet'}
                      </p>
                      {chat.unread_count > 0 && (
                        <span className="bg-blue-600 text-white text-xs px-2 py-1 rounded-full">
                          {chat.unread_count}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Bottom Navigation */}
      <div className="p-4 border-t border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-around">
          <Link
            to="/chats"
            className="flex flex-col items-center text-blue-600 dark:text-blue-400"
          >
            <FiMessageSquare className="w-5 h-5" />
            <span className="text-xs mt-1">Chats</span>
          </Link>
          
          <Link
            to="/profile"
            className="flex flex-col items-center text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
          >
            <FiUser className="w-5 h-5" />
            <span className="text-xs mt-1">Profile</span>
          </Link>
          
          <Link
            to="/settings"
            className="flex flex-col items-center text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
          >
            <FiSettings className="w-5 h-5" />
            <span className="text-xs mt-1">Settings</span>
          </Link>
          
          <button
            onClick={handleLogout}
            className="flex flex-col items-center text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
          >
            <FiLogOut className="w-5 h-5" />
            <span className="text-xs mt-1">Logout</span>
          </button>
        </div>
      </div>

      {/* New Chat Modal */}
      <AnimatePresence>
        {showNewChat && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="bg-white dark:bg-gray-800 rounded-xl shadow-xl w-full max-w-md"
            >
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                    New Chat
                  </h3>
                  <button
                    onClick={() => setShowNewChat(false)}
                    className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                  >
                    <FiX className="w-5 h-5" />
                  </button>
                </div>
                
                <div className="relative mb-6">
                  <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search users by username or email..."
                    className="w-full pl-10 pr-4 py-3 bg-gray-100 dark:bg-gray-700 rounded-lg border-none text-gray-900 dark:text-white placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:bg-white dark:focus:bg-gray-600 outline-none transition"
                  />
                </div>
                
                <div className="space-y-3">
                  {/* User search results would go here */}
                  <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                    <p>Search for users to start a chat</p>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Chat Requests Modal */}
      <AnimatePresence>
        {showChatRequests && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="bg-white dark:bg-gray-800 rounded-xl shadow-xl w-full max-w-md"
            >
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                    Chat Requests
                  </h3>
                  <button
                    onClick={() => setShowChatRequests(false)}
                    className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                  >
                    <FiX className="w-5 h-5" />
                  </button>
                </div>
                
                <div className="space-y-3 max-h-96 overflow-y-auto">
                  {chatRequests.length === 0 ? (
                    <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                      <p>No pending chat requests</p>
                    </div>
                  ) : (
                    chatRequests.map((request) => (
                      <div
                        key={request.id}
                        className="flex items-center justify-between p-3 rounded-lg bg-gray-50 dark:bg-gray-700"
                      >
                        <div className="flex items-center space-x-3">
                          <img
                            src={request.sender_profile_picture || `https://ui-avatars.com/api/?name=${request.sender_username}&background=random`}
                            alt={request.sender_username}
                            className="w-10 h-10 rounded-full"
                          />
                          <div>
                            <h4 className="font-medium text-gray-900 dark:text-white">
                              {request.sender_username}
                            </h4>
                            <p className="text-sm text-gray-500 dark:text-gray-400 truncate">
                              {request.message || 'Wants to chat with you'}
                            </p>
                          </div>
                        </div>
                        
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() => handleChatRequest(request.id, true)}
                            className="p-2 text-green-600 hover:text-green-700 hover:bg-green-50 dark:hover:bg-green-900/20 rounded-full"
                            title="Accept"
                          >
                            <FiCheck className="w-5 h-5" />
                          </button>
                          <button
                            onClick={() => handleChatRequest(request.id, false)}
                            className="p-2 text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-full"
                            title="Decline"
                          >
                            <FiX className="w-5 h-5" />
                          </button>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Sidebar;
