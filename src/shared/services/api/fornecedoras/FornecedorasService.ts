import { Environment } from '../../../environment';
import { Api } from '../axios-config';

export interface IDetalhamentoFornecedora {
    id: number;
    nome_fantasia: string;
    razao_social: string;
    cnpj: string;
    fone: string;
}

export interface IFornecedorasFormData {
    id: number;
    nome_fantasia: string;
    razao_social: string;
    cnpj: string;
    fone: string;
}

type TFornecedoresComTotalCount = {
    data: IDetalhamentoFornecedora[];
    totalCount: number;
}

const getAll = async (page = 1, filter = ''): Promise<TFornecedoresComTotalCount | Error> => {
    try {
        const urlRelativa = `/fornecedoras?_page=${page}&_limit=${Environment.LIMITE_DE_LINHAS}&nome_fantasia_like=${filter}`;
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

const getById = async (id: number): Promise<IDetalhamentoFornecedora | Error> => {
    try {
        const { data } = await Api.get(`/fornecedoras/${id}`);

        if (data) {
            return data;
        }

        return new Error('Erro ao consutar o registro.');
    } catch (error) {
        console.error(error);
        return new Error((error as { message: string }).message || 'Erro ao consutar o registro.');
    }
};

const create = async (dados: Omit<IFornecedorasFormData, 'id'>): Promise<number | Error> => {
    try {
        const { data } = await Api.post<IFornecedorasFormData>('/fornecedoras', dados);

        if (data) {
            return data.id;
        }

        return new Error('Erro ao criar o registro.');
    } catch (error) {
        console.error(error);
        return new Error((error as { message: string }).message || 'Erro ao criar o registro.');
    }
};

const updateById = async (id: number, dados: IFornecedorasFormData): Promise<void | Error> => {
    try {
        await Api.put(`/fornecedoras/${id}`, dados);
    } catch (error) {
        console.error(error);
        return new Error((error as { message: string }).message || 'Erro ao atualizar o registro.');
    }
};

const deleteById = async (id: number): Promise<void | Error> => {
    try {
        await Api.delete(`/fornecedoras/${id}`);
    } catch (error) {
        console.error(error);
        return new Error((error as { message: string }).message || 'Erro ao deletar o registro.');
    }
};

export const FornecedorasService = {
    getAll,
    getById,
    create,
    updateById,
    deleteById
};