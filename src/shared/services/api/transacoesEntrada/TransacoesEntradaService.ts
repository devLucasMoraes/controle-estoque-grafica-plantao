import { Environment } from '../../../environment';
import { Api } from '../axios-config';

interface ISpringPageData {
    content: IDetalhamentoTransacoesEntrada[];
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

export interface IDetalhamentoTransacoesEntrada {
    id: number;
    nfe: string;
    data_emissao: string;
    data_recebimento: string;
    valor_total: number;
    valor_frete: number;
    valor_ipi_total: number;
    obs: string;
    transportadora_id: number;
    fornecedora_id: number;
    itens: Array<IItemTransacaoEntrada>
}

export interface IItemTransacaoEntrada {
    id: number
    materiais_id: number
    und_com: string
    quant_com: number
    valor_unt_com: number
    valor_ipi: number
    obs: string
}

export interface ITransacoesEntradaFormData {
    id: number;
    nfe: string;
    data_emissao: string;
    data_recebimento: string;
    valor_total: number;
    valor_frete: number;
    valor_ipi_total: number;
    obs: string;
    transportadora_id: number;
    fornecedora_id: number;
    itens: Array<Omit<IItemTransacaoEntrada, 'id'>>
}

type TTransacoesEntradaComTotalCount = {
    data: ISpringPageData;
    totalCount: number;
}

const getAll = async (page = 1, filter = ''): Promise<TTransacoesEntradaComTotalCount | Error> => {
    try {
        const urlRelativa = `/transacoes_entrada?_page=${page}&_limit=${Environment.LIMITE_DE_LINHAS}&nfe_like=${filter}`;
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

const getById = async (id: number): Promise<IDetalhamentoTransacoesEntrada | Error> => {
    try {
        const { data } = await Api.get(`/transacoes_entrada/${id}`);

        if (data) {
            return data;
        }

        return new Error('Erro ao consutar o registro.');
    } catch (error) {
        console.error(error);
        return new Error((error as { message: string }).message || 'Erro ao consutar o registro.');
    }
};

const create = async (dados: Omit<ITransacoesEntradaFormData, 'id'>): Promise<number | Error> => {
    try {
        const { data } = await Api.post<ITransacoesEntradaFormData>('/transacoes_entrada', dados);

        if (data) {
            return data.id;
        }

        return new Error('Erro ao criar o registro.');
    } catch (error) {
        console.error(error);
        return new Error((error as { message: string }).message || 'Erro ao criar o registro.');
    }
};

const updateById = async (id: number, dados: ITransacoesEntradaFormData): Promise<void | Error> => {
    try {
        await Api.put(`/transacoes_entrada/${id}`, dados);
    } catch (error) {
        console.error(error);
        return new Error((error as { message: string }).message || 'Erro ao atualizar o registro.');
    }
};

const deleteById = async (id: number): Promise<void | Error> => {
    try {
        await Api.delete(`/transacoes_entrada/${id}`);
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