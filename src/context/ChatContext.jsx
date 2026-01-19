import React, { createContext, useState, useContext, useEffect } from 'react';
import { useSocket } from '../hooks/useSocket';
import { getChats, getMessages } from '../services/chat';
import { useAuth } from './AuthContext';

const ChatContext = createContext();

export const useChat = () => useContext(ChatContext);

export const ChatProvider = ({ children }) => {
  const [chats, setChats] = useState([]);
  const [activeChat, setActiveChat] = useState(null);
  const [messages, setMessages] = useState({});
  const [typingUsers, setTypingUsers] = useState({});
  const [onlineUsers, setOnlineUsers] = useState(new Set());
  const [chatRequests, setChatRequests] = useState([]);
  
  const socket = useSocket();
  const { user } = useAuth();

  useEffect(() => {
    if (socket && user) {
      // Listen for real-time messages
      socket.on('receive_message', (message) => {
        setMessages(prev => ({
          ...prev,
          [message.chat_id]: [...(prev[message.chat_id] || []), message]
        }));
        
        // Update chat list order
        setChats(prev => {
          const chatIndex = prev.findIndex(chat => chat.id === message.chat_id);
          if (chatIndex > -1) {
            const updatedChats = [...prev];
            const chat = updatedChats.splice(chatIndex, 1)[0];
            chat.last_message_content = message.content;
            chat.last_message_time = message.created_at;
            updatedChats.unshift(chat);
            return updatedChats;
          }
          return prev;
        });
      });

      // Listen for typing indicators
      socket.on('user_typing', ({ chatId, userId, isTyping }) => {
        setTypingUsers(prev => ({
          ...prev,
          [chatId]: isTyping ? userId : null
        }));
      });

      // Listen for user status changes
      socket.on('user_status_change', ({ userId, isOnline }) => {
        setOnlineUsers(prev => {
          const newSet = new Set(prev);
          if (isOnline) {
            newSet.add(userId);
          } else {
            newSet.delete(userId);
          }
          return newSet;
        });
      });

      // Join user's existing chats
      chats.forEach(chat => {
        socket.emit('join_chat', chat.id);
      });

      return () => {
        socket.off('receive_message');
        socket.off('user_typing');
        socket.off('user_status_change');
      };
    }
  }, [socket, user, chats]);

  const loadChats = async () => {
    try {
      const data = await getChats();
      setChats(data);
      return data;
    } catch (error) {
      console.error('Failed to load chats:', error);
      return [];
    }
  };

  const loadMessages = async (chatId) => {
    try {
      const data = await getMessages(chatId);
      setMessages(prev => ({
        ...prev,
        [chatId]: data
      }));
      return data;
    } catch (error) {
      console.error('Failed to load messages:', error);
      return [];
    }
  };

  const sendMessage = (chatId, content, messageType = 'text') => {
    if (socket && content.trim()) {
      const messageData = {
        chatId,
        content: content.trim(),
        message_type: messageType,
        senderId: user.id
      };
      
      socket.emit('send_message', messageData);
      
      // Optimistically add message
      const optimisticMessage = {
        id: Date.now().toString(),
        chat_id: chatId,
        sender_id: user.id,
        content: content.trim(),
        message_type: messageType,
        created_at: new Date().toISOString(),
        sender_username: user.username,
        sender_profile_picture: user.profile_picture,
        status: 'sending'
      };
      
      setMessages(prev => ({
        ...prev,
        [chatId]: [...(prev[chatId] || []), optimisticMessage]
      }));
      
      return optimisticMessage;
    }
  };

  const startTyping = (chatId) => {
    if (socket) {
      socket.emit('typing', { chatId, userId: user.id });
    }
  };

  const stopTyping = (chatId) => {
    if (socket) {
      socket.emit('stop_typing', { chatId, userId: user.id });
    }
  };

  const markAsRead = (messageId, chatId) => {
    if (socket) {
      socket.emit('mark_as_read', { messageId, chatId, userId: user.id });
    }
  };

  const value = {
    chats,
    activeChat,
    messages,
    typingUsers,
    onlineUsers,
    chatRequests,
    setActiveChat,
    setChats,
    setMessages,
    loadChats,
    loadMessages,
    sendMessage,
    startTyping,
    stopTyping,
    markAsRead
  };

  return (
    <ChatContext.Provider value={value}>
      {children}
    </ChatContext.Provider>
  );
};
