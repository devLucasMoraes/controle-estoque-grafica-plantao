import { AxiosError } from 'axios';

export const errorInterceptor = (error: AxiosError) => {
    if (error.message === 'Network Error') {
        return Promise.reject(new Error('Erro de conexão'));
    }

    if (error.response?.status === 400) {
        // Do something
    }

    return Promise.reject(error);
};