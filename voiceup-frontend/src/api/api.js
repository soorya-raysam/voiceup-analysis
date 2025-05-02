import axios from 'axios';

const API = axios.create({
  baseURL: 'http://127.0.0.1:5000/api',
});

// Fetch conversations
export const getConversations = () => API.get('/conversations');

// Analyze a conversation
export const analyzeConversation = (conversationId) => API.post(`/analyze/${conversationId}`);
