import { Environment } from '../../../environment';
import { Api } from '../axios-config';

export interface IListagemRequisitantes {
    id: number;
    name: string;
    fone: string;
    user_id: number;
    createdAt: string;
    updatedAt: string;
}

export interface IDetalheRequisitantes {
    id: number;
    name: string;
    fone: string;
    user_id: number;
}

type TRequisitantesComTotalCount = {
    data: IListagemRequisitantes[];
    totalCount: number;
}

const getAll = async (page = 1, filter = ''): Promise<TRequisitantesComTotalCount | Error> => {
    try {
        const urlRelativa = `/requisitantes?_page=${page}&_limit=${Environment.LIMITE_DE_LINHAS}&name_like=${filter}`;
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

const getById = async (id: number): Promise<IListagemRequisitantes | Error> => {
    try {
        const { data } = await Api.get(`/requisitantes/${id}`);

        if (data) {
            return data;
        }

        return new Error('Erro ao consutar o registro.');
    } catch (error) {
        console.error(error);
        return new Error((error as { message: string }).message || 'Erro ao consutar o registro.');
    }
};

const create = async (dados: Omit<IDetalheRequisitantes, 'id'>): Promise<number | Error> => {
    try {
        const { data } = await Api.post<IDetalheRequisitantes>('/requisitantes', dados);

        if (data) {
            return data.id;
        }

        return new Error('Erro ao criar o registro.');
    } catch (error) {
        console.error(error);
        return new Error((error as { message: string }).message || 'Erro ao criar o registro.');
    }
};

const updateById = async (id: number, dados: IDetalheRequisitantes): Promise<void | Error> => {
    try {
        await Api.put(`/requisitantes/${id}`, dados);
    } catch (error) {
        console.error(error);
        return new Error((error as { message: string }).message || 'Erro ao atualizar o registro.');
    }
};

const deleteById = async (id: number): Promise<void | Error> => {
    try {
        await Api.delete(`/requisitantes/${id}`);
    } catch (error) {
        console.error(error);
        return new Error((error as { message: string }).message || 'Erro ao deletar o registro.');
    }
};

export const RequisitantesService = {
    getAll,
    getById,
    create,
    updateById,
    deleteById
};