import { Box, Grid, LinearProgress, Paper, Typography } from '@mui/material';
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { DetailTools } from '../../shared/components';
import { LayoutBaseDePagina } from '../../shared/layouts';
import { CategoriasService, IDetalhamentoCategoria } from '../../shared/services/api/categorias/CategoriasService';


export const DetalharCategoria = () => {
    console.log('renderizou DetalharCategoria');

    const navigate = useNavigate();
    const { id } = useParams<'id'>();
    const [isLoading, setIsLoading] = useState(false);
    const [categoria, setCategoria] = useState<IDetalhamentoCategoria>();


    const handleDelete = (id: number) => {
        console.log('renderizou handleDelete DetalharCategoria');
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

    useEffect(() => {
        console.log('renderizou useEffect CategoriasService.getById DetalharCategoria');
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

    return (
        <LayoutBaseDePagina
            mostrarBotaoVoltar
            aoClicaeEmVoltar={() => navigate('/categorias')}
            titulo='Detalhar'
            tools={
                <DetailTools
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
                                {categoria?.und_padrao}
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
                                {categoria?.estoque_minimo}
                            </Typography>
                        </Grid>
                    )}

                </Grid>
            </Box>
        </LayoutBaseDePagina>
    );
};