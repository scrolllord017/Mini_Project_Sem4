import { create } from 'zustand';
import api from '../services/api';

const useAuthStore = create((set) => ({
  teacher: JSON.parse(localStorage.getItem('teacher')) || null,
  token: localStorage.getItem('token') || null,
  isAuthenticated: !!localStorage.getItem('token'),

  login: async (email, password) => {
    const res = await api.post('/auth/login', { email, password });
    const { teacher, token } = res.data;
    localStorage.setItem('token', token);
    localStorage.setItem('teacher', JSON.stringify(teacher));
    set({ teacher, token, isAuthenticated: true });
    return res.data;
  },

  register: async (name, email, password) => {
    const res = await api.post('/auth/register', { name, email, password });
    return res.data;
  },

  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('teacher');
    set({ teacher: null, token: null, isAuthenticated: false });
  }
}));

export default useAuthStore;
