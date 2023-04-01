import { Environment } from '../../../environment';
import { Api } from '../axios-config';

export interface IListagemFornecedor {
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

export interface IDetalheFornecedor {
    id: number;
    name: string;
    razao_social: string;
    cnpj: string;
    fone1: string;
    fone2: string;
    user_id: number;
}

type TFornecedoresComTotalCount = {
    data: IListagemFornecedor[];
    totalCount: number;
}

const getAll = async (page = 1, filter = ''): Promise<TFornecedoresComTotalCount | Error> => {
    try {
        const urlRelativa = `/fornecedores?_page=${page}&_limit=${Environment.LIMITE_DE_LINHAS}&name_like=${filter}`;
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

const getById = async (id: number): Promise<IListagemFornecedor | Error> => {
    try {
        const { data } = await Api.get(`/fornecedores/${id}`);

        if (data) {
            return data;
        }

        return new Error('Erro ao consutar o registro.');
    } catch (error) {
        console.error(error);
        return new Error((error as { message: string }).message || 'Erro ao consutar o registro.');
    }
};

const create = async (dados: Omit<IDetalheFornecedor, 'id'>): Promise<number | Error> => {
    try {
        const { data } = await Api.post<IDetalheFornecedor>('/fornecedores', dados);

        if (data) {
            return data.id;
        }

        return new Error('Erro ao criar o registro.');
    } catch (error) {
        console.error(error);
        return new Error((error as { message: string }).message || 'Erro ao criar o registro.');
    }
};

const updateById = async (id: number, dados: IDetalheFornecedor): Promise<void | Error> => {
    try {
        await Api.put(`/fornecedores/${id}`, dados);
    } catch (error) {
        console.error(error);
        return new Error((error as { message: string }).message || 'Erro ao atualizar o registro.');
    }
};

const deleteById = async (id: number): Promise<void | Error> => {
    try {
        await Api.delete(`/fornecedores/${id}`);
    } catch (error) {
        console.error(error);
        return new Error((error as { message: string }).message || 'Erro ao deletar o registro.');
    }
};

export const FornecedoresService = {
    getAll,
    getById,
    create,
    updateById,
    deleteById
};