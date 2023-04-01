import { Environment } from '../../../environment';
import { Api } from '../axios-config';

export interface IListagemMaterial {
    id: number;
    name: string;
    categorias_id: number;
    user_id: number;
    createdAt: string;
    updatedAt: string;
}

export interface IDetalheMaterial {
    id: number;
    name: string;
    categorias_id: number;
    user_id: number;
}

type TMateriaisComTotalCount = {
    data: IListagemMaterial[];
    totalCount: number;
}

const getAll = async (page = 1, filter = ''): Promise<TMateriaisComTotalCount | Error> => {
    try {
        const urlRelativa = `/materiais?_page=${page}&_limit=${Environment.LIMITE_DE_LINHAS}&name_like=${filter}`;
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

const getById = async (id: number): Promise<IListagemMaterial | Error> => {
    try {
        const { data } = await Api.get(`/materiais/${id}`);

        if (data) {
            return data;
        }

        return new Error('Erro ao consutar o registro.');
    } catch (error) {
        console.error(error);
        return new Error((error as { message: string }).message || 'Erro ao consutar o registro.');
    }
};

const create = async (dados: Omit<IDetalheMaterial, 'id'>): Promise<number | Error> => {
    try {
        const { data } = await Api.post<IDetalheMaterial>('/materiais', dados);

        if (data) {
            return data.id;
        }

        return new Error('Erro ao criar o registro.');
    } catch (error) {
        console.error(error);
        return new Error((error as { message: string }).message || 'Erro ao criar o registro.');
    }
};

const updateById = async (id: number, dados: IDetalheMaterial): Promise<void | Error> => {
    try {
        await Api.put(`/materiais/${id}`, dados);
    } catch (error) {
        console.error(error);
        return new Error((error as { message: string }).message || 'Erro ao atualizar o registro.');
    }
};

const deleteById = async (id: number): Promise<void | Error> => {
    try {
        await Api.delete(`/materiais/${id}`);
    } catch (error) {
        console.error(error);
        return new Error((error as { message: string }).message || 'Erro ao deletar o registro.');
    }
};

export const MateriaisService = {
    getAll,
    getById,
    create,
    updateById,
    deleteById
};