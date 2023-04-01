import { Environment } from '../../../environment';
import { Api } from '../axios-config';

export interface IListagemTransportadora {
    id: number;
    name: string;
    razao_social: string;
    cnpj: string;
    fone1: string;
    fone2: string;
    user_id: number;
    createdAt: string;
    updatedAt: string;
}

export interface IDetalheTransportadora {
    id: number;
    name: string;
    razao_social: string;
    cnpj: string;
    fone1: string;
    fone2: string;
    user_id: number;
}

type TTransportadorasComTotalCount = {
    data: IListagemTransportadora[];
    totalCount: number;
}

const getAll = async (page = 1, filter = ''): Promise<TTransportadorasComTotalCount | Error> => {
    try {
        const urlRelativa = `/transportadoras?_page=${page}&_limit=${Environment.LIMITE_DE_LINHAS}&name_like=${filter}`;
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

const getById = async (id: number): Promise<IListagemTransportadora | Error> => {
    try {
        const { data } = await Api.get(`/transportadoras/${id}`);

        if (data) {
            return data;
        }

        return new Error('Erro ao consutar o registro.');
    } catch (error) {
        console.error(error);
        return new Error((error as { message: string }).message || 'Erro ao consutar o registro.');
    }
};

const create = async (dados: Omit<IDetalheTransportadora, 'id'>): Promise<number | Error> => {
    try {
        const { data } = await Api.post<IDetalheTransportadora>('/transportadoras', dados);

        if (data) {
            return data.id;
        }

        return new Error('Erro ao criar o registro.');
    } catch (error) {
        console.error(error);
        return new Error((error as { message: string }).message || 'Erro ao criar o registro.');
    }
};

const updateById = async (id: number, dados: IDetalheTransportadora): Promise<void | Error> => {
    try {
        await Api.put(`/transportadoras/${id}`, dados);
    } catch (error) {
        console.error(error);
        return new Error((error as { message: string }).message || 'Erro ao atualizar o registro.');
    }
};

const deleteById = async (id: number): Promise<void | Error> => {
    try {
        await Api.delete(`/transportadoras/${id}`);
    } catch (error) {
        console.error(error);
        return new Error((error as { message: string }).message || 'Erro ao deletar o registro.');
    }
};

export const TransportadorasService = {
    getAll,
    getById,
    create,
    updateById,
    deleteById
};