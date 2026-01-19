import React, { useState, useRef, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useChat } from '../context/ChatContext';
import { useAuth } from '../context/AuthContext';
import Sidebar from '../components/layout/Sidebar';
import Message from '../components/chat/Message';
import MessageInput from '../components/layout/MessageInput';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FiChevronLeft,
  FiMoreVertical,
  FiSearch,
  FiPhone,
  FiVideo,
  FiInfo,
  FiImage,
  FiPaperclip
} from 'react-icons/fi';
import { format } from 'date-fns';

const Chat = () => {
  const { chatId } = useParams();
  const [showChatInfo, setShowChatInfo] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);
  
  const { 
    activeChat, 
    messages, 
    typingUsers, 
    onlineUsers,
    sendMessage,
    startTyping,
    stopTyping,
    loadMessages,
    markAsRead
  } = useChat();
  
  const { user } = useAuth();

  useEffect(() => {
    if (chatId) {
      loadMessages(chatId);
    }
  }, [chatId]);

  useEffect(() => {
    // Scroll to bottom when new messages arrive
    scrollToBottom();
    
    // Mark messages as read
    if (activeChat && messages[activeChat.id]) {
      messages[activeChat.id].forEach(msg => {
        if (msg.sender_id !== user.id && !msg.read_at) {
          markAsRead(msg.id, activeChat.id);
        }
      });
    }
  }, [messages, activeChat]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSendMessage = (content, type = 'text') => {
    if (activeChat && content.trim()) {
      sendMessage(activeChat.id, content, type);
    }
  };

  const handleTyping = () => {
    if (activeChat && !isTyping) {
      setIsTyping(true);
      startTyping(activeChat.id);
      
      setTimeout(() => {
        setIsTyping(false);
        stopTyping(activeChat.id);
      }, 3000);
    }
  };

  const renderEmptyState = () => (
    <div className="flex-1 flex flex-col items-center justify-center bg-gray-50 dark:bg-gray-900 p-8">
      <div className="w-32 h-32 bg-gray-200 dark:bg-gray-700 rounded-full flex items-center justify-center mb-6">
        <div className="text-gray-400 dark:text-gray-500">
          <svg className="w-16 h-16" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-6-3a2 2 0 11-4 0 2 2 0 014 0zm-2 4a5 5 0 00-4.546 2.916A5.986 5.986 0 005 10a6 6 0 0112 0c0 .459-.031.907-.086 1.333A5 5 0 0010 11z" clipRule="evenodd" />
          </svg>
        </div>
      </div>
      <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
        Welcome to ChatApp
      </h3>
      <p className="text-gray-600 dark:text-gray-400 text-center mb-6 max-w-md">
        Select a chat from the sidebar or start a new conversation to begin messaging.
      </p>
      <div className="flex flex-col space-y-3">
        <div className="flex items-center space-x-2 text-gray-500 dark:text-gray-400">
          <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
          <span>Real-time messaging</span>
        </div>
        <div className="flex items-center space-x-2 text-gray-500 dark:text-gray-400">
          <div className="w-2 h-2 bg-green-500 rounded-full"></div>
          <span>Share images and files</span>
        </div>
        <div className="flex items-center space-x-2 text-gray-500 dark:text-gray-400">
          <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
          <span>End-to-end encryption</span>
        </div>
      </div>
    </div>
  );

  const renderChatWindow = () => {
    const chatMessages = activeChat ? messages[activeChat.id] || [] : [];
    const isOtherUserTyping = typingUsers[activeChat?.id];

    return (
      <div className="flex-1 flex flex-col h-full">
        {/* Chat Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
          <div className="flex items-center space-x-3">
            <button className="lg:hidden p-2">
              <FiChevronLeft className="w-5 h-5" />
            </button>
            
            <div className="flex items-center space-x-3">
              <div className="relative">
                <img
                  src={activeChat.other_user_profile_picture || `https://ui-avatars.com/api/?name=${activeChat.other_user_username}&background=random`}
                  alt={activeChat.other_user_username}
                  className="w-10 h-10 rounded-full"
                />
                {onlineUsers.has(activeChat.other_user_id) && (
                  <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white dark:border-gray-800"></div>
                )}
              </div>
              <div>
                <h2 className="font-semibold text-gray-900 dark:text-white">
                  {activeChat.other_user_username}
                </h2>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {isOtherUserTyping ? 'typing...' : 
                   onlineUsers.has(activeChat.other_user_id) ? 'Online' : 'Offline'}
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <button className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700">
              <FiSearch className="w-5 h-5" />
            </button>
            <button className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700">
              <FiPhone className="w-5 h-5" />
            </button>
            <button className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700">
              <FiVideo className="w-5 h-5" />
            </button>
            <button
              onClick={() => setShowChatInfo(!showChatInfo)}
              className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              <FiMoreVertical className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Messages Container */}
        <div className="flex-1 overflow-y-auto p-4 bg-gray-50 dark:bg-gray-900">
          <div className="space-y-4">
            {chatMessages.map((message) => (
              <Message
                key={message.id}
                message={message}
                isOwnMessage={message.sender_id === user.id}
              />
            ))}
            
            {isOtherUserTyping && (
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8">
                  <img
                    src={activeChat.other_user_profile_picture || `https://ui-avatars.com/api/?name=${activeChat.other_user_username}&background=random`}
                    alt={activeChat.other_user_username}
                    className="w-full h-full rounded-full"
                  />
                </div>
                <div className="bg-white dark:bg-gray-800 rounded-2xl rounded-tl-none px-4 py-3 shadow">
                  <div className="typing-indicator">
                    <span></span>
                    <span></span>
                    <span></span>
                  </div>
                </div>
              </div>
            )}
            
            <div ref={messagesEndRef} />
          </div>
        </div>

        {/* Message Input */}
        <MessageInput onSendMessage={handleSendMessage} onTyping={handleTyping} />
      </div>
    );
  };

  return (
    <div className="flex h-screen">
      {/* Sidebar for desktop, hidden on mobile when chat is open */}
      <div className={`${activeChat ? 'hidden lg:block' : 'block'} w-full lg:w-1/3 xl:w-1/4`}>
        <Sidebar />
      </div>
      
      {/* Main Chat Area */}
      <div className={`${activeChat ? 'block' : 'hidden lg:block'} flex-1`}>
        {activeChat ? renderChatWindow() : renderEmptyState()}
      </div>

      {/* Chat Info Sidebar */}
      <AnimatePresence>
        {showChatInfo && activeChat && (
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'tween' }}
            className="fixed inset-y-0 right-0 w-full md:w-96 bg-white dark:bg-gray-800 shadow-xl z-40"
          >
            <div className="h-full flex flex-col">
              <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                    Chat Info
                  </h3>
                  <button
                    onClick={() => setShowChatInfo(false)}
                    className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                  >
                    <FiChevronLeft className="w-5 h-5" />
                  </button>
                </div>
                
                <div className="flex flex-col items-center">
                  <img
                    src={activeChat.other_user_profile_picture || `https://ui-avatars.com/api/?name=${activeChat.other_user_username}&background=random`}
                    alt={activeChat.other_user_username}
                    className="w-24 h-24 rounded-full mb-4"
                  />
                  <h4 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                    {activeChat.other_user_username}
                  </h4>
                  <p className="text-gray-500 dark:text-gray-400">
                    {onlineUsers.has(activeChat.other_user_id) ? 'Online' : 'Last seen recently'}
                  </p>
                </div>
              </div>
              
              <div className="flex-1 overflow-y-auto p-6">
                <div className="space-y-6">
                  <div>
                    <h4 className="font-medium text-gray-900 dark:text-white mb-3">
                      Media, Links & Docs
                    </h4>
                    <div className="grid grid-cols-3 gap-2">
                      {[1, 2, 3, 4, 5, 6].map((i) => (
                        <div key={i} className="aspect-square bg-gray-200 dark:bg-gray-700 rounded-lg overflow-hidden">
                          <div className="w-full h-full flex items-center justify-center">
                            <FiImage className="w-8 h-8 text-gray-400" />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="font-medium text-gray-900 dark:text-white mb-3">
                      Privacy & Support
                    </h4>
                    <div className="space-y-2">
                      <button className="w-full text-left p-3 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300">
                        Block User
                      </button>
                      <button className="w-full text-left p-3 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 text-red-600 dark:text-red-400">
                        Report User
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Chat;
