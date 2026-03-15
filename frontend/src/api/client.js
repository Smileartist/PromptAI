import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || '/api'; // Use /api for Vercel deployment

const client = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

client.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

export const promptApi = {
    generatePrompt: async (idea) => {
        try {
            const response = await client.post('/generate/', { idea });
            const data = response.data;

            // If we are operating offline/guest, manually save to localStorage
            if (!localStorage.getItem('token') && data.status === 'success') {
                const existing = JSON.parse(localStorage.getItem('offline_prompts') || '[]');
                localStorage.setItem('offline_prompts', JSON.stringify([data.data, ...existing]));
            }
            return data;
        } catch (error) {
            const message = error.response?.data?.message || error.message || 'Failed to generate prompt';
            throw new Error(message);
        }
    },

    getPrompts: async (query = '') => {
        // If guest, fetch solely from local storage
        if (!localStorage.getItem('token')) {
            const offline = JSON.parse(localStorage.getItem('offline_prompts') || '[]');
            if (query) {
                const q = query.toLowerCase();
                const filtered = offline.filter(p =>
                    p.user_input.toLowerCase().includes(q) ||
                    p.generated_prompt.toLowerCase().includes(q) ||
                    p.category.toLowerCase().includes(q)
                );
                return { status: 'success', data: filtered };
            }
            return { status: 'success', data: offline };
        }

        try {
            const params = query ? { query } : {};
            const response = await client.get('/prompts/', { params });
            return response.data;
        } catch (error) {
            throw error.response?.data || { message: 'Failed to fetch prompts' };
        }
    },

    deletePrompt: async (id) => {
        if (!localStorage.getItem('token')) {
            const offline = JSON.parse(localStorage.getItem('offline_prompts') || '[]');
            const filtered = offline.filter(p => p.id !== id);
            localStorage.setItem('offline_prompts', JSON.stringify(filtered));
            return { status: 'success' };
        }

        try {
            const response = await client.delete(`/prompts/${id}`);
            return response.data;
        } catch (error) {
            throw error.response?.data || { message: 'Failed to delete prompt' };
        }
    }
};
