import { Box, Grid, LinearProgress, Paper, Typography } from '@mui/material';
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { CrudTools, UnderlineLink, UnderlineLinkCategoria } from '../../shared/components';
import { LayoutBaseDaPagina } from '../../shared/layouts';
import { MateriaisService, IDetalhamentoMaterial } from '../../shared/services/api/materiais/MateriaisService';
import { CategoriasService } from '../../shared/services/api/categorias/CategoriasService';
import { FornecedorasService } from '../../shared/services/api/fornecedoras/FornecedorasService';


export const DetalhamentoDeMaterial = () => {
    console.log('renderizou DetalharMateriais');

    const { id } = useParams<'id'>();

    const navigate = useNavigate();

    const [isLoading, setIsLoading] = useState(false);
    const [materiais, setMateriais] = useState<IDetalhamentoMaterial>();

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

    return (
        <LayoutBaseDaPagina
            mostrarBotaoVoltar
            aoClicaeEmVoltar={() => navigate('/materiais')}
            titulo='Detalhamento'
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
                                {materiais?.valorUnt}
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
                                <UnderlineLink
                                    id={materiais.idCategoria}
                                    service={CategoriasService}
                                    nameProperty='nome'
                                    linkPath='/categorias/records/show/:id'
                                />
                            </Box>
                        </Grid>
                    )}

                    <Grid container direction='column' spacing={2} padding={4}>
                        <Grid item>
                            <Typography
                                variant='caption'
                                noWrap
                            >
                                Fornecedoras Vinculadas \ Codigo do Produto
                            </Typography>
                        </Grid>
                        {materiais?.fornecedorasVinculadas.map((vinculo) => (
                            <Grid item key={vinculo.id} direction='row' display='flex' gap={1}>
                                <UnderlineLink 
                                    id={vinculo.idFornecedora}
                                    service={FornecedorasService}
                                    nameProperty='nomeFantasia'
                                    linkPath='/fornecedoras/records/show/:id'
                                />

                                <Typography noWrap >
                                    {vinculo.codProd}
                                </Typography>
                            </Grid>
                        ))}
                    </Grid>
                </Grid>
            </Box>
        </LayoutBaseDaPagina>
    );
};