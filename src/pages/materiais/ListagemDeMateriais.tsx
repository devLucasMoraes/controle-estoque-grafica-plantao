import { Box, Paper } from '@mui/material';
import { DataGrid, GridColDef, GridPaginationModel, ptBR } from '@mui/x-data-grid';
import { GridActionsCellItem } from '@mui/x-data-grid/components';
import { Delete, Edit, Info } from '@mui/icons-material';
import { useEffect, useMemo, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { ListingTools, UnderlineLinkCategoria } from '../../shared/components';
import { Environment } from '../../shared/environment';
import { useDebouce } from '../../shared/hooks';
import { LayoutBaseDaPagina } from '../../shared/layouts';
import { IDetalhamentoMaterial, MateriaisService } from '../../shared/services/api/materiais/MateriaisService';

export const ListagemDeMateriais = () => {
    console.log('renderizou ListagemDeMateriais');

    const [searchParams, setSearchParams] = useSearchParams();

    const navigate = useNavigate();

    const [rows, setRows] = useState<IDetalhamentoMaterial[]>([]);
    const [totalCount, setTotalCount] = useState(0);
    const [isLoading, setIsLoading] = useState(true);
    const [busca, setBusca] = useState('');
    const [paginationModel, setPaginationModel] = useState({
        page: 0,
        pageSize: Environment.LIMITE_DE_LINHAS,
    });

    const pagina = useMemo(() => {
        return Number(searchParams.get('pagina') || '0');
    }, [searchParams]);
    const buscaMemo = useMemo(() => {
        return searchParams.get('busca') || '';
    }, [searchParams]);

    const { debouce } = useDebouce(1000);

    useEffect(() => {
        console.log('renderizou useEffect MateriaisService.getAll ListagemDeMateriais');
        setIsLoading(true);
        MateriaisService.getAll(pagina, buscaMemo)
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

    const handleDelete = (id: number) => {
        console.log('renderizou handleDelete ListagemDeMateriais');
        if (confirm('Realmente deseja apagar?')) {
            MateriaisService.deleteById(id)
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

    const pagination = (e: GridPaginationModel): void => {
        setPaginationModel(e);
        const page = e.page;
        setSearchParams({ busca: buscaMemo, pagina: page.toString() }, { replace: true });
    };

    const setBuscaDebouce = (texto: string): void => {
        setBusca(texto);
        debouce(() => setSearchParams({ busca: texto, pagina: '0' }, { replace: true }));
    };

    const columns = useMemo<GridColDef<IDetalhamentoMaterial>[]>(() => [
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
                    key={`materiaisDelete${params.row.id}`}
                    icon={<Delete />}
                    label="Delete"
                    onClick={() => handleDelete(params.row.id)}

                />,
                <GridActionsCellItem
                    key={`materiaisEdit${params.row.id}`}
                    icon={<Edit />}
                    label="Edit"
                    onClick={() => navigate(`/materiais/records/edit/${params.row.id}`)}

                />,
                <GridActionsCellItem
                    key={`materiaisInfo${params.row.id}`}
                    icon={<Info />}
                    label="info"
                    onClick={() => navigate(`/materiais/records/show/${params.row.id}`)}
                />
            ]
        },
        {
            field: 'descricao',
            headerName: 'Nome',
            minWidth: 155,
            flex: 0.3
        },
        {
            field: 'valorUnt',
            headerName: 'Valor unitario',
            minWidth: 155,
            flex: 0.3
        },
        {
            field: 'idCategoria',
            headerName: 'Categoria',
            minWidth: 220,
            flex: 0.2,
            renderCell: (params) => (
                <UnderlineLinkCategoria id={params.row.idCategoria} />
            )
        }
    ], [handleDelete]);

    return (
        <LayoutBaseDaPagina
            titulo='Listagem'
            totalCount={totalCount}
            tools={
                <ListingTools
                    aoClicarEmNovo={() => navigate('/materiais/records/new')}
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