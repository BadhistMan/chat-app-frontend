import api from './api';

export const getChats = async () => {
  const response = await api.get('/chats');
  return response.chats;
};

export const getMessages = async (chatId, params = {}) => {
  const response = await api.get(`/chats/${chatId}/messages`, { params });
  return response.messages;
};

export const sendMessage = async (chatId, messageData) => {
  const response = await api.post(`/chats/${chatId}/messages`, messageData);
  return response.message;
};

export const deleteMessage = async (messageId, deleteForEveryone = false) => {
  const response = await api.delete(`/chats/messages/${messageId}`, {
    data: { deleteForEveryone }
  });
  return response;
};

export const editMessage = async (messageId, content) => {
  const response = await api.patch(`/chats/messages/${messageId}`, { content });
  return response;
};

export const sendChatRequest = async (receiverId, message = '') => {
  const response = await api.post('/chats/requests', { receiverId, message });
  return response;
};

export const getChatRequests = async () => {
  const response = await api.get('/chats/requests');
  return response.requests;
};

export const respondToChatRequest = async (requestId, status) => {
  const response = await api.post(`/chats/requests/${requestId}/respond`, { status });
  return response;
};

export const searchUsers = async (query) => {
  const response = await api.get('/users/search', { params: { query } });
  return response.users;
};

export const togglePinChat = async (chatId, pin) => {
  const response = await api.patch(`/chats/${chatId}/pin`, { pin });
  return response;
};
