import axios from 'axios';

// Create Axios instance
const api = axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response interceptor to handle errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const message = error.response?.data?.message || 'Something went wrong';
    return Promise.reject(new Error(message));
  }
);

// ===== Auth API =====

export const registerUser = async (userData) => {
  const { data } = await api.post('/auth/register', userData);
  if (data.token) {
    localStorage.setItem('token', data.token);
    localStorage.setItem(
      'user',
      JSON.stringify({ _id: data._id, name: data.name, email: data.email })
    );
  }
  return data;
};

export const loginUser = async (userData) => {
  const { data } = await api.post('/auth/login', userData);
  if (data.token) {
    localStorage.setItem('token', data.token);
    localStorage.setItem(
      'user',
      JSON.stringify({ _id: data._id, name: data.name, email: data.email })
    );
  }
  return data;
};

export const getProfile = async () => {
  const { data } = await api.get('/auth/profile');
  return data;
};

export const logoutUser = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
};

// ===== Tasks API =====

export const getTasks = async (params = {}) => {
  const { data } = await api.get('/tasks', { params });
  return data;
};

export const getTask = async (id) => {
  const { data } = await api.get(`/tasks/${id}`);
  return data;
};

export const createTask = async (taskData) => {
  const { data } = await api.post('/tasks', taskData);
  return data;
};

export const updateTask = async (id, taskData) => {
  const { data } = await api.put(`/tasks/${id}`, taskData);
  return data;
};

export const toggleTaskStatus = async (id) => {
  const { data } = await api.patch(`/tasks/${id}/status`);
  return data;
};

export const deleteTask = async (id) => {
  const { data } = await api.delete(`/tasks/${id}`);
  return data;
};

export const getTaskStats = async () => {
  const { data } = await api.get('/tasks/stats');
  return data;
};
