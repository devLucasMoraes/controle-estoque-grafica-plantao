import { Environment } from '../../../environment';
import { Api } from '../axios-config';

export interface IListagemTransacoesEntrada {
    id: number;
    qtd: number;
    data_de_recebimento: string;
    valor: number;
    valor_frete: number;
    nfe: string;
    obs: string;
    transportadora_id: number;
    fornecedora_id: number;
    material_id: number;
    user_id: number;
    createdAt: string;
    updatedAt: string;
}

export interface IDetalheTransacoesEntrada {
    id: number;
    qtd: number;
    data_de_recebimento: string;
    valor: number;
    valor_frete: number;
    nfe: string;
    obs: string;
    transportadora_id: number;
    fornecedora_id: number;
    material_id: number;
    user_id: number;
}

type TTransacoesEntradaComTotalCount = {
    data: IListagemTransacoesEntrada[];
    totalCount: number;
}

const getAll = async (page = 1, filter = ''): Promise<TTransacoesEntradaComTotalCount | Error> => {
    try {
        const urlRelativa = `/transacoesEntrada?_page=${page}&_limit=${Environment.LIMITE_DE_LINHAS}&nfe_like=${filter}`;
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

const getById = async (id: number): Promise<IListagemTransacoesEntrada | Error> => {
    try {
        const { data } = await Api.get(`/transacoesEntrada/${id}`);

        if (data) {
            return data;
        }

        return new Error('Erro ao consutar o registro.');
    } catch (error) {
        console.error(error);
        return new Error((error as { message: string }).message || 'Erro ao consutar o registro.');
    }
};

const create = async (dados: Omit<IDetalheTransacoesEntrada, 'id'>): Promise<number | Error> => {
    try {
        const { data } = await Api.post<IDetalheTransacoesEntrada>('/transacoesEntrada', dados);

        if (data) {
            return data.id;
        }

        return new Error('Erro ao criar o registro.');
    } catch (error) {
        console.error(error);
        return new Error((error as { message: string }).message || 'Erro ao criar o registro.');
    }
};

const updateById = async (id: number, dados: IDetalheTransacoesEntrada): Promise<void | Error> => {
    try {
        await Api.put(`/transacoesEntrada/${id}`, dados);
    } catch (error) {
        console.error(error);
        return new Error((error as { message: string }).message || 'Erro ao atualizar o registro.');
    }
};

const deleteById = async (id: number): Promise<void | Error> => {
    try {
        await Api.delete(`/transacoesEntrada/${id}`);
    } catch (error) {
        console.error(error);
        return new Error((error as { message: string }).message || 'Erro ao deletar o registro.');
    }
};

export const TransacoesEntradaService = {
    getAll,
    getById,
    create,
    updateById,
    deleteById
};