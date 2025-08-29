import { useAuth } from '@/contexts/useAuth';
import { notification } from 'antd';
import axios from 'axios';

export const api = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3001',
});

api.interceptors.request.use((config) => {
    const token = useAuth.getState().token;

    if (token) {
        config.headers = config.headers ?? {};
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

api.interceptors.response.use(
    (res) => res,
    async (error) => {
        const { response, config } = error ?? {};
        if (response?.status === 401) {
            useAuth.getState().logout();
        }
        return Promise.reject(error);
    }
);

api.interceptors.response.use(
    function (config) {
        return config;
    },
    function (error) {
        const status = error?.response?.status;
        if (window && status === 401 && error?.config?.url !== "/auth/login") {
            localStorage.removeItem("MESSENTECH_AUTH");
            notification.error({
                message: "Por favor, faça o login para continuar",
                duration: 5000,
            });
            window.location.href = `/?redirect=${encodeURIComponent(
                window.location.pathname
            )}`;
        }
        return Promise.reject(error);
    }
);
