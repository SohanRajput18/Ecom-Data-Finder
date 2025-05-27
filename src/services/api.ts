import axios from 'axios';
import { User, Card, UserPreferences } from '../types';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Add a request interceptor
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('API Error:', {
      status: error.response?.status,
      data: error.response?.data,
      config: error.config
    });

    if (error.response?.status === 404) {
      throw new Error('The requested resource was not found');
    }

    if (!error.response) {
      throw new Error('Network error: Please check your connection and try again');
    }

    // Get error message from the server response if available
    const serverError = error.response.data?.message || error.response.data?.error;
    if (serverError) {
      throw new Error(serverError);
    }

    throw new Error('An unexpected error occurred. Please try again later.');
  }
);

export const authAPI = {
  register: (data: { name: string; email: string; password: string }) =>
    api.post<{ token: string; user: User }>('/auth/register', data),
  login: (data: { email: string; password: string }) =>
    api.post<{ token: string; user: User }>('/auth/login', data),
  getCurrentUser: () => api.get<User>('/auth/me')
};

export const cardsAPI = {
  getAll: () => api.get<Card[]>('/cards'),
  getById: (id: string) => api.get<Card>(`/cards/${id}`),
  saveCard: (id: string) => api.post(`/cards/${id}/save`),
  getRecommendations: (preferences: UserPreferences) =>
    api.post<Card[]>('/cards/recommendations', preferences)
};

export const adminAPI = {
  createCard: (data: Omit<Card, 'id'>) => api.post<Card>('/admin/cards', data),
  updateCard: (id: string, data: Partial<Card>) =>
    api.put<Card>(`/admin/cards/${id}`, data),
  deleteCard: (id: string) => api.delete(`/admin/cards/${id}`)
};

export default api; 