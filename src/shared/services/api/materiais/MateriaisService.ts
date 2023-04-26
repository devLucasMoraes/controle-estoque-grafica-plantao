import { Environment } from '../../../environment';
import { Api } from '../axios-config';

export interface IDetalhamentoMaterial {
    id: number;
    cod_prod: string;
    descricao: string;
    valor_unt: number;
    categorias_id: number;
}

export interface IMaterialFormData {
    id: number;
    descricao: string;
    valor_unt: number;
    categorias_id: number;
}

type TMateriaisComTotalCount = {
    data: IDetalhamentoMaterial[];
    totalCount: number;
}

const getAll = async (page = 1, filter = ''): Promise<TMateriaisComTotalCount | Error> => {
    try {
        const urlRelativa = `/materiais?_page=${page}&_limit=${Environment.LIMITE_DE_LINHAS}&descricao_like=${filter}`;
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

const getById = async (id: number): Promise<IDetalhamentoMaterial | Error> => {
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

const create = async (dados: Omit<IMaterialFormData, 'id'>): Promise<number | Error> => {
    try {
        const { data } = await Api.post<IMaterialFormData>('/materiais', dados);

        if (data) {
            return data.id;
        }

        return new Error('Erro ao criar o registro.');
    } catch (error) {
        console.error(error);
        return new Error((error as { message: string }).message || 'Erro ao criar o registro.');
    }
};

const updateById = async (id: number, dados: IMaterialFormData): Promise<void | Error> => {
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