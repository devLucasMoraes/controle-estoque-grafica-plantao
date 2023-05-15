import { AxiosError } from 'axios';

export const errorInterceptor = (error: AxiosError<any>) => {
    if (error.response?.status === 500) {
        console.error(error);
        throw new Error(error.response?.data.message);
    }

    return Promise.reject(error);
};