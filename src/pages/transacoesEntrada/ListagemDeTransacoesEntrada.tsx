import { Box, Paper } from '@mui/material';
import { DataGrid, GridColDef, GridPaginationModel, ptBR } from '@mui/x-data-grid';
import { GridActionsCellItem } from '@mui/x-data-grid/components';
import { Delete, Edit, Info } from '@mui/icons-material';
import { useEffect, useMemo, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { ToolsList, UnderlineLinkFornecedores, UnderlineLinkTransportadoras } from '../../shared/components';
import { Environment } from '../../shared/environment';
import { useDebouce } from '../../shared/hooks';
import { LayoutBaseDaPagina } from '../../shared/layouts';
import { IDetalhamentoTransacoesEntrada, TransacoesEntradaService } from '../../shared/services/api/transacoesEntrada/TransacoesEntradaService';

export const ListagemDeTransacoesEntrada = () => {

    const [searchParams, setSearchParams] = useSearchParams();
    const navigate = useNavigate();
    const [rows, setRows] = useState<IDetalhamentoTransacoesEntrada[]>([]);
    const [totalCount, setTotalCount] = useState(0);
    const [isLoading, setIsLoading] = useState(true);
    const [busca, setBusca] = useState('');

    const pagina = useMemo(() => {
        return Number(searchParams.get('pagina') || '0');
    }, [searchParams]);


    const buscaMemo = useMemo(() => {
        return searchParams.get('busca') || '';
    }, [searchParams]);

    const [paginationModel, setPaginationModel] = useState({
        page: 0,
        pageSize: Environment.LIMITE_DE_LINHAS,
    });

    const handleDelete = (id: number) => {
        if (confirm('Realmente deseja apagar?')) {
            TransacoesEntradaService.deleteById(id)
                .then(result => {
                    if (result instanceof Error) {
                        alert(result.message);
                    } else {
                        setRows(oldRows => {
                            return [
                                ...oldRows.filter(oldRow => oldRow.id !== id)
                            ];
                        });
                        alert('Registro apagado com sucesso!');
                    }
                });
        }
    };

    const { debouce } = useDebouce(1000);

    useEffect(() => {
        setIsLoading(true);
        TransacoesEntradaService.getAll(pagina, buscaMemo)
            .then((result) => {
                setIsLoading(false);
                if (result instanceof Error) {
                    alert(result.message);
                } else {
                    setTotalCount(result.totalCount);
                    setRows(result.data.content);
                }
            });
    }, [buscaMemo, pagina]);

    const pagination = (e: GridPaginationModel): void => {
        setPaginationModel(e);
        const page = e.page;
        setSearchParams({ busca: buscaMemo, pagina: page.toString() }, { replace: true });
    };

    const setBuscaDebouce = (texto: string): void => {
        setBusca(texto);
        debouce(() => setSearchParams({ busca: texto, pagina: '0' }, { replace: true }));
    };

    const columns = useMemo<GridColDef<IDetalhamentoTransacoesEntrada>[]>(() => [
        {
            field: 'acitions',
            headerName: '',
            type: 'acitions',
            minWidth: 110,
            flex: 0.1,
            hideable: false,
            disableReorder: true,
            disableColumnMenu: true,
            disableExport: true,
            renderCell: (params) => [
                <GridActionsCellItem
                    key={`transacoesEntradaDelete${params.row.id}`}
                    icon={<Delete />}
                    label="Delete"
                    onClick={() => handleDelete(params.row.id)}

                />,
                <GridActionsCellItem
                    key={`transacoesEntradaEdit${params.row.id}`}
                    icon={<Edit />}
                    label="Edit"
                    onClick={() => navigate(`/transacoes_entrada/records/edit/${params.row.id}`)}

                />,
                <GridActionsCellItem
                    key={`transacoesEntradaInfo${params.row.id}`}
                    icon={<Info />}
                    label="info"
                    onClick={() => navigate(`/transacoes_entrada/records/show/${params.row.id}`)}
                />
            ]
        },
        {
            field: 'data_emissao',
            headerName: 'Emitido em',
            minWidth: 155,
            flex: 0.3
        },
        {
            field: 'data_recebimento',
            headerName: 'Recebido em',
            minWidth: 155,
            flex: 0.3
        },
        {
            field: 'valor_ipi_total',
            headerName: 'Taxa IPI',
            minWidth: 155,
            flex: 0.3
        },
        {
            field: 'valor_total',
            headerName: 'Valor total',
            minWidth: 155,
            flex: 0.3
        },
        {
            field: 'fornecedora_id',
            headerName: 'Fornecedora',
            minWidth: 220,
            flex: 0.2,
            renderCell: (params) => (
                <UnderlineLinkFornecedores id={params.row.fornecedora_id} />
            )
        },
        {
            field: 'valor_frete',
            headerName: 'Valor do frete',
            minWidth: 155,
            flex: 0.3
        },
        {
            field: 'transportadora_id',
            headerName: 'Transportadora',
            minWidth: 220,
            flex: 0.2,
            renderCell: (params) => (
                <UnderlineLinkTransportadoras id={params.row.transportadora_id} />
            )
        }
    ], [handleDelete]);

    return (
        <LayoutBaseDaPagina
            titulo='Listagem'
            totalCount={totalCount}
            tools={
                <ToolsList
                    aoClicarEmNovo={() => navigate('/transacoes_entrada/records/new')}
                    mostrarInputBusca
                    textoDaBusca={busca}
                    aoMudarTextDeBusca={texto => setBuscaDebouce(texto)}
                />
            }
        >
            <Box
                component={Paper}
                height='99%'
                variant='outlined'


            >
                <DataGrid
                    localeText={ptBR.components.MuiDataGrid.defaultProps.localeText}
                    rowCount={totalCount}
                    rows={rows}
                    columns={columns}
                    //slots={{ toolbar: GridToolbar }}
                    loading={isLoading}
                    paginationMode='server'
                    paginationModel={paginationModel}
                    onPaginationModelChange={e => pagination(e)}
                    pageSizeOptions={[Environment.LIMITE_DE_LINHAS]}
                />
            </Box>
        </LayoutBaseDaPagina>
    );
};