import { Environment } from '../../../environment';
import { Api } from '../axios-config';

export interface IDetalhamentoTransacoesSaida {
    id: number;
    valor_total: number;
    data_retirada: string;
    op: string;
    obs: string;
    requisitantes_id: number;
    destinos_id: number;
}

export interface ITransacoesSaidaFormData {
    id: number;
    valor_total: number;
    data_retirada: string;
    op: string;
    obs: string;
    requisitantes_id: number;
    destinos_id: number;
}

type TTransacoesSaidaComTotalCount = {
    data: IDetalhamentoTransacoesSaida[];
    totalCount: number;
}

const getAll = async (page = 1, filter = ''): Promise<TTransacoesSaidaComTotalCount | Error> => {
    try {
        const urlRelativa = `/transacoes_saida?_page=${page}&_limit=${Environment.LIMITE_DE_LINHAS}&op_like=${filter}`;
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

const getById = async (id: number): Promise<IDetalhamentoTransacoesSaida | Error> => {
    try {
        const { data } = await Api.get(`/transacoes_saida/${id}`);

        if (data) {
            return data;
        }

        return new Error('Erro ao consutar o registro.');
    } catch (error) {
        console.error(error);
        return new Error((error as { message: string }).message || 'Erro ao consutar o registro.');
    }
};

const create = async (dados: Omit<ITransacoesSaidaFormData, 'id'>): Promise<number | Error> => {
    try {
        const { data } = await Api.post<ITransacoesSaidaFormData>('/transacoes_saida', dados);

        if (data) {
            return data.id;
        }

        return new Error('Erro ao criar o registro.');
    } catch (error) {
        console.error(error);
        return new Error((error as { message: string }).message || 'Erro ao criar o registro.');
    }
};

const updateById = async (id: number, dados: ITransacoesSaidaFormData): Promise<void | Error> => {
    try {
        await Api.put(`/transacoes_saida/${id}`, dados);
    } catch (error) {
        console.error(error);
        return new Error((error as { message: string }).message || 'Erro ao atualizar o registro.');
    }
};

const deleteById = async (id: number): Promise<void | Error> => {
    try {
        await Api.delete(`/transacoes_saida/${id}`);
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