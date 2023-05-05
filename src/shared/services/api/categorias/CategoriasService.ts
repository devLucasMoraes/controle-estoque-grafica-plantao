import { Environment } from '../../../environment';
import { Api } from '../axios-config';

interface ISpringPageData {
    content: IDetalhamentoCategoria[];
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

export interface IDetalhamentoCategoria {
    id: number;
    nome: string;
    und_padrao: string;
    estoque_minimo: number;
}

export interface ICategoriaFormData {
    id: number;
    nome: string;
    und_padrao: string;
    estoque_minimo: number;
}

type TCategoriasComTotalCount = {
    data: ISpringPageData;
    totalCount: number;
}

const getAll = async (page = 1, filter = ''): Promise<TCategoriasComTotalCount | Error> => {
    try {
        const urlRelativa = `/categorias?_page=${page}&_limit=${Environment.LIMITE_DE_LINHAS}&nome_like=${filter}`;
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

const getById = async (id: number): Promise<IDetalhamentoCategoria | Error> => {
    try {
        const { data } = await Api.get(`/categorias/${id}`);

        if (data) {
            return data;
        }

        return new Error('Erro ao consutar o registro.');
    } catch (error) {
        console.error(error);
        return new Error((error as { message: string }).message || 'Erro ao consutar o registro.');
    }
};

const create = async (dados: Omit<ICategoriaFormData, 'id'>): Promise<number | Error> => {
    try {
        const { data } = await Api.post<ICategoriaFormData>('/categorias', dados);

        if (data) {
            return data.id;
        }

        return new Error('Erro ao criar o registro.');
    } catch (error) {
        console.error(error);
        return new Error((error as { message: string }).message || 'Erro ao criar o registro.');
    }
};

const updateById = async (id: number, dados: ICategoriaFormData): Promise<void | Error> => {
    try {
        await Api.put(`/categorias/${id}`, dados);
    } catch (error) {
        console.error(error);
        return new Error((error as { message: string }).message || 'Erro ao atualizar o registro.');
    }
};

const deleteById = async (id: number): Promise<void | Error> => {
    try {
        await Api.delete(`/categorias/${id}`);
    } catch (error) {
        console.error(error);
        return new Error((error as { message: string }).message || 'Erro ao deletar o registro.');
    }
};

export const CategoriasService = {
    getAll,
    getById,
    create,
    updateById,
    deleteById
};