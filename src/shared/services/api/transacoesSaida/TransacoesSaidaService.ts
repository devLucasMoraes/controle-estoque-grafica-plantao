import { Environment } from '../../../environment';
import { Api } from '../axios-config';

export interface IListagemTransacoesSaida {
    id: number;
    data_de_retirada: string;
    qtd: number;
    valor: number;
    op: string;
    obs: string;
    user_id: number;
    requisitante_id: number;
    destino_id: number;
    material_id: number;
    createdAt: string;
    updatedAt: string;
}

export interface IDetalheTransacoesSaida {
    id: number;
    data_de_retirada: string;
    qtd: number;
    valor: number;
    op: string;
    obs: string;
    user_id: number;
    requisitante_id: number;
    destino_id: number;
    material_id: number;
}

type TTransacoesSaidaComTotalCount = {
    data: IListagemTransacoesSaida[];
    totalCount: number;
}

const getAll = async (page = 1, filter = ''): Promise<TTransacoesSaidaComTotalCount | Error> => {
    try {
        const urlRelativa = `/transacoesSaida?_page=${page}&_limit=${Environment.LIMITE_DE_LINHAS}&op_like=${filter}`;
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

const getById = async (id: number): Promise<IListagemTransacoesSaida | Error> => {
    try {
        const { data } = await Api.get(`/transacoesSaida/${id}`);

        if (data) {
            return data;
        }

        return new Error('Erro ao consutar o registro.');
    } catch (error) {
        console.error(error);
        return new Error((error as { message: string }).message || 'Erro ao consutar o registro.');
    }
};

const create = async (dados: Omit<IDetalheTransacoesSaida, 'id'>): Promise<number | Error> => {
    try {
        const { data } = await Api.post<IDetalheTransacoesSaida>('/transacoesSaida', dados);

        if (data) {
            return data.id;
        }

        return new Error('Erro ao criar o registro.');
    } catch (error) {
        console.error(error);
        return new Error((error as { message: string }).message || 'Erro ao criar o registro.');
    }
};

const updateById = async (id: number, dados: IDetalheTransacoesSaida): Promise<void | Error> => {
    try {
        await Api.put(`/transacoesSaida/${id}`, dados);
    } catch (error) {
        console.error(error);
        return new Error((error as { message: string }).message || 'Erro ao atualizar o registro.');
    }
};

const deleteById = async (id: number): Promise<void | Error> => {
    try {
        await Api.delete(`/transacoesSaida/${id}`);
    } catch (error) {
        console.error(error);
        return new Error((error as { message: string }).message || 'Erro ao deletar o registro.');
    }
};

export const TransacoesSaidaService = {
    getAll,
    getById,
    create,
    updateById,
    deleteById
};