import { Box, Icon, Paper } from '@mui/material';
import { DataGrid, GridColDef, ptBR } from '@mui/x-data-grid';
import { GridActionsCellItem, GridToolbar } from '@mui/x-data-grid/components';
import { useEffect, useMemo, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { ToolsList } from '../../shared/components';
import { Environment } from '../../shared/environment';
import { useDebouce } from '../../shared/hooks';
import { LayoutBaseDePagina } from '../../shared/layouts';
import { IListagemUser, UsersService } from '../../shared/services/api/users/UsersService';

export const ListagemDeUsers: React.FC = () => {

    const [searchParams, setSearchParams] = useSearchParams();
    const navigate = useNavigate();
    const [rows, setRows] = useState<IListagemUser[]>([]);
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
            UsersService.deleteById(id)
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
        UsersService.getAll(pagina, buscaMemo)
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

    useEffect(() => {
        const page = paginationModel.page + 1;
        setSearchParams({ busca: buscaMemo, pagina: page.toString() }, { replace: true });
    }, [paginationModel]);

    useEffect(() => {
        debouce(() => setSearchParams({ busca: busca, pagina: '1' }, { replace: true }));
    }, [busca]);

    const columns = useMemo<GridColDef<IListagemUser>[]>(() => [
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
                    key={`delete${params.row.id}`}
                    icon={<Icon>delete</Icon>}
                    label="Delete"
                    onClick={() => handleDelete(params.row.id)}

                />,
                <GridActionsCellItem
                    key={`edit${params.row.id}`}
                    icon={<Icon>edit</Icon>}
                    label="Edit"
                    onClick={() => navigate(`/users/records/edit/${params.row.id}`)}

                />,
                <GridActionsCellItem
                    key={`info${params.row.id}`}
                    icon={<Icon>info</ Icon>}
                    label="info"
                    onClick={() => navigate(`/users/records/show/${params.row.id}`)}
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
            field: 'name',
            headerName: 'Nome',
            minWidth: 155,
            flex: 0.3
        },
        {
            field: 'email',
            headerName: 'Email',
            minWidth: 220,
            flex: 0.2
        },
        {
            field: 'password_hash',
            headerName: 'Senha',
            minWidth: 155,
            flex: 0.1
        },
        {
            field: 'role',
            headerName: 'Cargo',
            minWidth: 155,
            flex: 0.1
        },
        {
            field: 'status',
            headerName: 'Status',
            minWidth: 110,
            flex: 0.1
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
                    aoClicarEmNovo={() => navigate('/users/records/new')}
                    mostrarInputBusca
                    textoDaBusca={busca}
                    aoMudarTextDeBusca={texto => setBusca(texto)}
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
                    slots={{ toolbar: GridToolbar }}
                    loading={isLoading}
                    paginationMode='server'
                    paginationModel={paginationModel}
                    onPaginationModelChange={setPaginationModel}
                    pageSizeOptions={[Environment.LIMITE_DE_LINHAS]}
                />
            </Box>
        </LayoutBaseDePagina>
    );
};