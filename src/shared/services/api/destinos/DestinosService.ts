import { Environment } from '../../../environment';
import { Api } from '../axios-config';

export interface IDetalhamentoDestino {
    id: number;
    nome: string;
    fone: string;
}

export interface IDestinoFormData {
    id: number;
    nome: string;
    fone: string;
}

type TDestinosComTotalCount = {
    data: IDetalhamentoDestino[];
    totalCount: number;
}

const getAll = async (page = 1, filter = ''): Promise<TDestinosComTotalCount | Error> => {
    try {
        const urlRelativa = `/destinos?_page=${page}&_limit=${Environment.LIMITE_DE_LINHAS}&nome_like=${filter}`;
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

const getById = async (id: number): Promise<IDetalhamentoDestino | Error> => {
    try {
        const { data } = await Api.get(`/destinos/${id}`);

        if (data) {
            return data;
        }

        return new Error('Erro ao consutar o registro.');
    } catch (error) {
        console.error(error);
        return new Error((error as { message: string }).message || 'Erro ao consutar o registro.');
    }
};

const create = async (dados: Omit<IDestinoFormData, 'id'>): Promise<number | Error> => {
    try {
        const { data } = await Api.post<IDestinoFormData>('/destinos', dados);

        if (data) {
            return data.id;
        }

        return new Error('Erro ao criar o registro.');
    } catch (error) {
        console.error(error);
        return new Error((error as { message: string }).message || 'Erro ao criar o registro.');
    }
};

const updateById = async (id: number, dados: IDestinoFormData): Promise<void | Error> => {
    try {
        await Api.put(`/destinos/${id}`, dados);
    } catch (error) {
        console.error(error);
        return new Error((error as { message: string }).message || 'Erro ao atualizar o registro.');
    }
};

const deleteById = async (id: number): Promise<void | Error> => {
    try {
        await Api.delete(`/destinos/${id}`);
    } catch (error) {
        console.error(error);
        return new Error((error as { message: string }).message || 'Erro ao deletar o registro.');
    }
};

export const DestinosService = {
    getAll,
    getById,
    create,
    updateById,
    deleteById
};