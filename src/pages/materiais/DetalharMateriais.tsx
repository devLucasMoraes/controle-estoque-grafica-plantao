import { Box, Grid, LinearProgress, Paper, Typography } from '@mui/material';
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { CrudTools, UnderlineLinkCategoria } from '../../shared/components';
import { LayoutBaseDaPagina } from '../../shared/layouts';
import { MateriaisService, IDetalhamentoMaterial } from '../../shared/services/api/materiais/MateriaisService';


export const DetalharMateriais = () => {
    console.log('renderizou DetalharMateriais');

    const navigate = useNavigate();
    const { id } = useParams<'id'>();
    const [isLoading, setIsLoading] = useState(false);
    const [materiais, setMateriais] = useState<IDetalhamentoMaterial>();


    const handleDelete = (id: number) => {
        console.log('renderizou handleDelete DetalharMateriais');
        if (confirm('Realmente deseja apagar?')) {
            MateriaisService.deleteById(id)
                .then(result => {
                    if (result instanceof Error) {
                        alert(result.message);
                    } else {
                        alert('Registro apagado com sucesso!');
                        navigate('/materiais');
                    }
                });
        }
    };

    useEffect(() => {
        console.log('renderizou useEffect MateriaisService.getById DetalharMateriais');
        if (id !== 'new') {
            setIsLoading(true);
            MateriaisService.getById(Number(id))
                .then(result => {
                    setIsLoading(false);
                    if (result instanceof Error) {
                        alert(result.message);
                        navigate('/materiais');
                    } else {
                        console.log(result);
                        setMateriais(result);
                    }
                });
        }
    }, [id]);

    return (
        <LayoutBaseDaPagina
            mostrarBotaoVoltar
            aoClicaeEmVoltar={() => navigate('/materiais')}
            titulo='Detalhar'
            tools={
                <CrudTools
                    mostrarBotaoApagar
                    mostrarBotaoEditar
                    aoClicaeEmApagar={() => handleDelete(Number(id))}
                    aoClicaeEmEditar={() => navigate(`/materiais/records/edit/${id}`)}
                />
            }
        >
            <Box
                component={Paper}
                height='99%'
                variant='outlined'
            >
                <Grid container direction='column' spacing={2} padding={4}>
                    {isLoading && (
                        <Grid item>
                            <LinearProgress variant='indeterminate' />
                        </Grid>
                    )}


                    {materiais && (
                        <Grid item>
                            <Typography
                                variant='caption'
                                noWrap
                            >
                                Id
                            </Typography>
                            <Typography
                                noWrap
                            >
                                {materiais?.id}
                            </Typography>
                        </Grid>
                    )}

                    {materiais && (
                        <Grid item>
                            <Typography
                                variant='caption'
                                noWrap
                            >
                                Codigo do produto
                            </Typography>
                            <Typography
                                noWrap
                            >
                                {materiais?.cod_prod}
                            </Typography>
                        </Grid>
                    )}

                    {materiais && (
                        <Grid item>
                            <Typography
                                variant='caption'
                                noWrap
                            >
                                Nome
                            </Typography>
                            <Typography
                                noWrap
                            >
                                {materiais?.descricao}
                            </Typography>
                        </Grid>

                    )}

                    {materiais && (
                        <Grid item>
                            <Typography
                                variant='caption'
                                noWrap
                            >
                                Valor unitario
                            </Typography>
                            <Typography
                                noWrap
                            >
                                {materiais?.valor_unt}
                            </Typography>
                        </Grid>

                    )}

                    {materiais && (
                        <Grid item >
                            <Box display='flex' flexDirection='column'>
                                <Typography
                                    component={Box}
                                    variant='caption'
                                    noWrap
                                >
                                    Categoria
                                </Typography>
                                <UnderlineLinkCategoria id={materiais?.categorias_id} />
                            </Box>
                        </Grid>
                    )}

                </Grid>
            </Box>
        </LayoutBaseDaPagina>
    );
};