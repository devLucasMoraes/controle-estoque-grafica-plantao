import { Box, Paper } from '@mui/material';
import { DataGrid, GridColDef, GridPaginationModel, ptBR } from '@mui/x-data-grid';
import { GridActionsCellItem } from '@mui/x-data-grid/components';
import { Delete, Edit, Info } from '@mui/icons-material';
import { useEffect, useMemo, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { ToolsList, UnderlineLinkUser } from '../../shared/components';
import { Environment } from '../../shared/environment';
import { useDebouce } from '../../shared/hooks';
import { LayoutBaseDePagina } from '../../shared/layouts';
import { IListagemRequisitantes, RequisitantesService } from '../../shared/services/api/requisitantes/RequisitantesService';

export const ListagemDeRequisitantes = () => {

    const [searchParams, setSearchParams] = useSearchParams();
    const navigate = useNavigate();
    const [rows, setRows] = useState<IListagemRequisitantes[]>([]);
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
            RequisitantesService.deleteById(id)
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
        RequisitantesService.getAll(pagina, buscaMemo)
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

    const columns = useMemo<GridColDef<IListagemRequisitantes>[]>(() => [
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
                    key={`requisitantesDelete${params.row.id}`}
                    icon={<Delete />}
                    label="Delete"
                    onClick={() => handleDelete(params.row.id)}

                />,
                <GridActionsCellItem
                    key={`requisitantesEdit${params.row.id}`}
                    icon={<Edit />}
                    label="Edit"
                    onClick={() => navigate(`/requisitantes/records/edit/${params.row.id}`)}

                />,
                <GridActionsCellItem
                    key={`requisitantesInfo${params.row.id}`}
                    icon={<Info />}
                    label="info"
                    onClick={() => navigate(`/requisitantes/records/show/${params.row.id}`)}
                />
            ]
        },
        {
            field: 'name',
            headerName: 'Nome',
            minWidth: 155,
            flex: 0.3
        },
        {
            field: 'fone',
            headerName: 'Celular',
            minWidth: 220,
            flex: 0.2
        }
    ], [handleDelete]);

    return (
        <LayoutBaseDePagina
            titulo='Listagem'
            totalCount={totalCount}
            tools={
                <ToolsList
                    aoClicarEmNovo={() => navigate('/requisitantes/records/new')}
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