import { Environment } from '../../../environment';
import { Api } from '../axios-config';

export interface IListagemUsers {
    id: number;
    name: string;
    email: string;
    role: string;
    status: string;
    password_hash: string;
    createdAt: string;
    updatedAt: string;
}

export interface IDetalheUsers {
    id: number;
    name: string;
    email: string;
    role: string;
    status: string;
}

type TUsersComTotalCount = {
    data: IListagemUsers[];
    totalCount: number;
}

const getAll = async (page = 1, filter = ''): Promise<TUsersComTotalCount | Error> => {
    try {
        const urlRelativa = `/users?_page=${page}&_limit=${Environment.LIMITE_DE_LINHAS}&name_like=${filter}`;
        const { data, headers } = await Api.get(urlRelativa);
        
        if (data) {
            return {
                data,
                totalCount: Number(headers['x-total-count'] || Environment.LIMITE_DE_LINHAS)
            };
        }

        return new Error('Erro ao listar os registros.');
    } catch (error) {
        console.error(error);
        return new Error((error as { message: string }).message || 'Erro ao listar os registros.');
    }
};

const getById = async (id: number): Promise<IListagemUsers | Error> => {
    try {
        const { data } = await Api.get(`/users/${id}`);

        if (data) {
            return data;
        }

        return new Error('Erro ao consutar o registro.');
    } catch (error) {
        console.error(error);
        return new Error((error as { message: string }).message || 'Erro ao consutar o registro.');
    }
};

const create = async (dados: Omit<IDetalheUsers, 'id'>): Promise<number | Error> => {
    try {
        const { data } = await Api.post<IDetalheUsers>('/users', dados);

        if (data) {
            return data.id;
        }

        return new Error('Erro ao criar o registro.');
    } catch (error) {
        console.error(error);
        return new Error((error as { message: string }).message || 'Erro ao criar o registro.');
    }
};

const updateById = async (id: number, dados: IDetalheUsers): Promise<void | Error> => {
    try {
        await Api.put(`/users/${id}`, dados);
    } catch (error) {
        console.error(error);
        return new Error((error as { message: string }).message || 'Erro ao atualizar o registro.');
    }
};

const deleteById = async (id: number): Promise<void | Error> => {
    try {
        await Api.delete(`/users/${id}`);
    } catch (error) {
        console.error(error);
        return new Error((error as { message: string }).message || 'Erro ao deletar o registro.');
    }
};

export const UsersService = {
    getAll,
    getById,
    create,
    updateById,
    deleteById
};