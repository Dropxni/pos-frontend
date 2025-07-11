// src/app/core/services/axios-instance.ts
import axios from 'axios';
import { environment } from '../../../environments/environment';

const instance = axios.create({
  baseURL: environment.apiUrl,
});

instance.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default instance;
