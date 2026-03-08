import axios, { type AxiosError } from 'axios';
import { AUTH_REFRESH_TOKEN_KEY, clearAuthSession, getAccessToken } from './authStorage';

const BASE_URL = import.meta.env.VITE_API_BASE_URL?.trim() || 'http://localhost:5000/api';

const api = axios.create({
    baseURL: BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

api.interceptors.request.use((config) => {
    const token = getAccessToken();
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

api.interceptors.response.use(
    (response) => response,
    (error: AxiosError<{ message?: string }>) => {
        if (error.response?.status === 401) {
            clearAuthSession();
            localStorage.removeItem(AUTH_REFRESH_TOKEN_KEY);
        }

        const fallbackMessage = error.message || 'Unexpected API error';
        const serverMessage = error.response?.data?.message;
        const errorToThrow = new Error(serverMessage || fallbackMessage);

        return Promise.reject(errorToThrow);
    }
);

export default api;
