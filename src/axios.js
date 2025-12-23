import axios from 'axios';

const instance = axios.create({
    baseURL: import.meta.env.VITE_API_URL,
});

// Add request interceptor
instance.interceptors.request.use(
    (config) => {
        // Try to get token from localStorage first (direct storage)
        let token = localStorage.getItem('token');

        // If not found, try to get from auth-storage (Zustand persist)
        if (!token) {
            try {
                const authStorage = localStorage.getItem('auth-storage');
                if (authStorage) {
                    const parsed = JSON.parse(authStorage);
                    token = parsed?.state?.token;
                }
            } catch (e) {
                console.error('Error parsing auth-storage:', e);
            }
        }

        // Ensure token is a valid string and not an object
        if (token && typeof token === 'string' && token.trim() !== '') {
            config.headers.Authorization = `Bearer ${token}`;
        }

        return config;
    },
    (error) => Promise.reject(error)
);

// Add response interceptor
instance.interceptors.response.use(
    (response) => response?.data,
    (error) => Promise.reject(error.response?.data)
);

export default instance;
