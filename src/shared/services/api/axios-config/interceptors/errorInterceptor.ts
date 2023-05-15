import { AxiosError } from 'axios';

export const errorInterceptor = (error: AxiosError<any>) => {
    if (error.message === 'Network Error') {
        return Promise.reject(new Error('Erro de conexão'));
    }

    if (error.response?.status === 500) {
        console.error(error);
        return new Error(error.response?.data.message || 'Erro ao consutar o registro.');
    }

    return Promise.reject(error);
};