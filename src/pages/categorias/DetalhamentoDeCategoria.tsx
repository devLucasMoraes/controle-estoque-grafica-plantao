import { Box, Grid, LinearProgress, Paper, Typography } from '@mui/material';
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { CrudTools } from '../../shared/components';
import { LayoutBaseDaPagina } from '../../shared/layouts';
import { CategoriasService, IDetalhamentoCategoria } from '../../shared/services/api/categorias/CategoriasService';


export const DetalhamentoDeCategoria = () => {
    console.log('renderizou DetalhamentoDeCategoria');

    const { id } = useParams<'id'>();

    const navigate = useNavigate();

    const [isLoading, setIsLoading] = useState(false);
    const [categoria, setCategoria] = useState<IDetalhamentoCategoria>();

    useEffect(() => {
        console.log('renderizou useEffect CategoriasService.getById DetalhamentoDeCategoria');
        if (id !== 'new') {
            setIsLoading(true);
            CategoriasService.getById(Number(id))
                .then(result => {
                    setIsLoading(false);
                    if (result instanceof Error) {
                        alert(result.message);
                        navigate('/categorias');
                    } else {
                        setCategoria(result);
                    }
                });
        }
    }, [id]);

    const handleDelete = (id: number) => {
        console.log('renderizou handleDelete DetalhamentoDeCategoria');
        if (confirm('Realmente deseja apagar?')) {
            CategoriasService.deleteById(id)
                .then(result => {
                    if (result instanceof Error) {
                        alert(result.message);
                    } else {
                        alert('Registro apagado com sucesso!');
                        navigate('/categorias');
                    }
                });
        }
    };

    return (
        <LayoutBaseDaPagina
            mostrarBotaoVoltar
            aoClicaeEmVoltar={() => navigate('/categorias')}
            titulo='Detalhamento'
            tools={
                <CrudTools
                    mostrarBotaoApagar
                    mostrarBotaoEditar
                    aoClicaeEmApagar={() => handleDelete(Number(id))}
                    aoClicaeEmEditar={() => navigate(`/categorias/records/edit/${id}`)}
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

                    {categoria && (
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
                                {categoria?.id}
                            </Typography>
                        </Grid>
                    )}

                    {categoria && (
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
                                {categoria?.nome}
                            </Typography>
                        </Grid>

                    )}
                    
                    {categoria && (
                        <Grid item>
                            <Typography
                                variant='caption'
                                noWrap
                            >
                                Unidade de medida
                            </Typography>
                            <Typography
                                noWrap
                            >
                                {categoria?.undPadrao}
                            </Typography>
                        </Grid>
                    )}

                    {categoria && (
                        <Grid item>
                            <Typography
                                variant='caption'
                                noWrap
                            >
                                Estoque minimo
                            </Typography>
                            <Typography
                                noWrap
                            >
                                {categoria?.estoqueMinimo}
                            </Typography>
                        </Grid>
                    )}

                </Grid>
            </Box>
        </LayoutBaseDaPagina>
    );
};