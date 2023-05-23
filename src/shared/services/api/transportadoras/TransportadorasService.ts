import { Environment } from '../../../environment';
import { Api } from '../axios-config';

interface ISpringPageData {
    content: IDetalhamentoTransportadora[];
    pageable: {
        sort: {
            empty: boolean;
            sorted: boolean;
            unsorted: boolean;
        };
        offset: number;
        pageNumber: number;
        pageSize: number;
        paged: boolean;
        unpaged: boolean;
    };
    last: boolean;
    totalPages: number;
    totalElements: number;
    size: number;
    number: number;
    sort: {
        empty: boolean;
        sorted: boolean;
        unsorted: boolean;
    };
    first: boolean;
    numberOfElements: number;
    empty: boolean;
}

export interface IDetalhamentoTransportadora {
    id: number;
    nomeFantasia: string;
    razaoSocial: string;
    cnpj: string;
    fone: string;
}

export interface ITransportadoraFormData {
    id: number;
    nomeFantasia: string;
    razaoSocial: string;
    cnpj: string;
    fone: string;
}

type TTransportadorasComTotalCount = {
    data: ISpringPageData;
    totalCount: number;
}

const getAll = async (page = 0, filter = ''): Promise<TTransportadorasComTotalCount | Error> => {
    try {
        const urlRelativa = `/transportadoras?page=${page}&size=${Environment.LIMITE_DE_LINHAS}&nome_fantasia=${filter}`;
        const { data, headers } = await Api.get(urlRelativa);
        
        if (data) {
            return {
                data,
                //totalCount: Number(headers['x-total-count'] || Environment.LIMITE_DE_LINHAS)
                totalCount: data.totalElements
            };
        }

        return new Error('Erro ao listar os registros.');
    } catch (error) {
        console.error(error);
        return new Error((error as { message: string }).message || 'Erro ao listar os registros.');
    }
};

const getById = async (id: number): Promise<IDetalhamentoTransportadora | Error> => {
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

const getByCNPJ = async (cnpj: string): Promise<IDetalhamentoTransportadora | Error> => {
    try {
        const { data } = await Api.get(`/transportadoras/search/cnpj/${cnpj}`);

        if (data) {
            return data;
        }

        return new Error('Erro ao consutar o registro.');
    } catch (error) {
        console.error(error);
        return new Error((error as { message: string }).message || 'Erro ao consutar o registro.');
    }
};

const create = async (dados: Omit<ITransportadoraFormData, 'id'>): Promise<number | Error> => {
    try {
        const { data } = await Api.post<ITransportadoraFormData>('/transportadoras', dados);

        if (data) {
            return data.id;
        }

        return new Error('Erro ao criar o registro.');
    } catch (error) {
        console.error(error);
        return new Error((error as { message: string }).message || 'Erro ao criar o registro.');
    }
};

const updateById = async (id: number, dados: ITransportadoraFormData): Promise<void | Error> => {
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
    getByCNPJ,
    create,
    updateById,
    deleteById
};