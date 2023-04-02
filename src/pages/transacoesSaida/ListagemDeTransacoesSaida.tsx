import { Box, Paper } from '@mui/material';
import { DataGrid, GridColDef, GridPaginationModel, ptBR } from '@mui/x-data-grid';
import { GridActionsCellItem } from '@mui/x-data-grid/components';
import { Delete, Edit, Info } from '@mui/icons-material';
import { useEffect, useMemo, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { ToolsList, UnderlineLinkDestinos, UnderlineLinkMateriais, UnderlineLinkRequisitantes, UnderlineLinkUser } from '../../shared/components';
import { Environment } from '../../shared/environment';
import { useDebouce } from '../../shared/hooks';
import { LayoutBaseDePagina } from '../../shared/layouts';
import { IListagemTransacoesSaida, TransacoesSaidaService } from '../../shared/services/api/transacoesSaida/TransacoesSaidaService';

export const ListagemDeTransacoesSaida= () => {

    const [searchParams, setSearchParams] = useSearchParams();
    const navigate = useNavigate();
    const [rows, setRows] = useState<IListagemTransacoesSaida[]>([]);
    const [totalCount, setTotalCount] = useState(0);
    const [isLoading, setIsLoading] = useState(true);
    const [busca, setBusca] = useState('');

    const pagina = useMemo(() => {
        return Number(searchParams.get('pagina') || '1');
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
            TransacoesSaidaService.deleteById(id)
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
        TransacoesSaidaService.getAll(pagina, buscaMemo)
            .then((result) => {
                setIsLoading(false);
                if (result instanceof Error) {
                    alert(result.message);
                } else {
                    setTotalCount(result.totalCount);
                    setRows(result.data);
                }
            });
    }, [buscaMemo, pagina]);

    const pagination = (e: GridPaginationModel): void => {
        setPaginationModel(e);
        const page = e.page + 1;
        setSearchParams({ busca: buscaMemo, pagina: page.toString() }, { replace: true });
    };

    const setBuscaDebouce = (texto: string): void => {
        setBusca(texto);
        debouce(() => setSearchParams({ busca: texto, pagina: '1' }, { replace: true }));
    };

    const columns = useMemo<GridColDef<IListagemTransacoesSaida>[]>(() => [
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
                    key={`transacoesSaidaDelete${params.row.id}`}
                    icon={<Delete />}
                    label="Delete"
                    onClick={() => handleDelete(params.row.id)}

                />,
                <GridActionsCellItem
                    key={`transacoesSaidaEdit${params.row.id}`}
                    icon={<Edit />}
                    label="Edit"
                    onClick={() => navigate(`/transacoesSaida/records/edit/${params.row.id}`)}

                />,
                <GridActionsCellItem
                    key={`transacoesSaidaInfo${params.row.id}`}
                    icon={<Info />}
                    label="info"
                    onClick={() => navigate(`/transacoesSaida/records/show/${params.row.id}`)}
                />
            ]
        },
        {
            field: 'id',
            headerName: 'ID',
            flex: 0.1,
            minWidth: 90
        },
        {
            field: 'qtd',
            headerName: 'Quantidade',
            minWidth: 155,
            flex: 0.3
        },
        {
            field: 'data_de_recebimento',
            headerName: 'Recebido em',
            minWidth: 155,
            flex: 0.3
        },
        {
            field: 'valor',
            headerName: 'Valor do item',
            minWidth: 155,
            flex: 0.3
        },
        {
            field: 'op',
            headerName: 'Ordem de Produção',
            minWidth: 155,
            flex: 0.3
        },
        {
            field: 'obs',
            headerName: 'Observações',
            minWidth: 155,
            flex: 0.3
        },
        {
            field: 'requisitante_id',
            headerName: 'Requisitante',
            minWidth: 220,
            flex: 0.2,
            renderCell: (params) => (
                <UnderlineLinkRequisitantes id={params.row.requisitante_id} />
            )
        },
        {
            field: 'destino_id',
            headerName: 'Destino',
            minWidth: 220,
            flex: 0.2,
            renderCell: (params) => (
                <UnderlineLinkDestinos id={params.row.destino_id} />
            )
        },
        {
            field: 'material_id',
            headerName: 'Material',
            minWidth: 220,
            flex: 0.2,
            renderCell: (params) => (
                <UnderlineLinkMateriais id={params.row.material_id} />
            )
        },
        {
            field: 'user_id',
            headerName: 'Usuario',
            minWidth: 155,
            flex: 0.1,
            renderCell: (params) => (
                <UnderlineLinkUser id={params.row.user_id} />
            )
        },
        {
            field: 'createdAt',
            headerName: 'Criado em',
            width: 155
        },
        {
            field: 'updatedAt',
            headerName: 'Atualizado em',
            width: 155
        }
    ], [handleDelete]);

    return (
        <LayoutBaseDePagina
            titulo='Listagem'
            totalCount={totalCount}
            tools={
                <ToolsList
                    aoClicarEmNovo={() => navigate('/transacoesSaida/records/new')}
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
        </LayoutBaseDePagina>
    );
};