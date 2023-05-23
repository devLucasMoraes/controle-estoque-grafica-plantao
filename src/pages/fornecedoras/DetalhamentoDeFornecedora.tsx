import { Box, Grid, LinearProgress, Paper, Typography } from '@mui/material';
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { CrudTools } from '../../shared/components';
import { LayoutBaseDaPagina } from '../../shared/layouts';
import { FornecedorasService, IDetalhamentoFornecedora } from '../../shared/services/api/fornecedoras/FornecedorasService';

export const DetalhamentoDeFornecedora = () => {

    const { id } = useParams<'id'>();

    const navigate = useNavigate();

    const [isLoading, setIsLoading] = useState(false);
    const [fornecedora, setFornecedora] = useState<IDetalhamentoFornecedora>();

    useEffect(() => {
        if (id !== 'new') {
            setIsLoading(true);
            FornecedorasService.getById(Number(id))
                .then(result => {
                    setIsLoading(false);
                    if (result instanceof Error) {
                        alert(result.message);
                        navigate('/fornecedoras');
                    } else {
                        console.log(result);
                        setFornecedora(result);
                    }
                });
        }
    }, [id]);

    const handleDelete = (id: number) => {
        if (confirm('Realmente deseja apagar?')) {
            FornecedorasService.deleteById(id)
                .then(result => {
                    if (result instanceof Error) {
                        alert(result.message);
                    } else {
                        alert('Registro apagado com sucesso!');
                        navigate('/fornecedoras');
                    }
                });
        }
    };

    return (
        <LayoutBaseDaPagina
            mostrarBotaoVoltar
            aoClicaeEmVoltar={() => navigate('/fornecedoras')}
            titulo='Detalhamento'
            tools={
                <CrudTools
                    mostrarBotaoApagar
                    mostrarBotaoEditar
                    aoClicaeEmApagar={() => handleDelete(Number(id))}
                    aoClicaeEmEditar={() => navigate(`/fornecedoras/records/edit/${id}`)}
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

                    {fornecedora && (
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
                                {fornecedora?.id}
                            </Typography>
                        </Grid>
                    )}

                    {fornecedora && (
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
                                {fornecedora?.nomeFantasia}
                            </Typography>
                        </Grid>
                    )}

                    {fornecedora && (
                        <Grid item>
                            <Typography
                                variant='caption'
                                noWrap
                            >
                                Razão social
                            </Typography>
                            <Typography
                                noWrap
                            >
                                {fornecedora?.razaoSocial}
                            </Typography>
                        </Grid>
                    )}

                    {fornecedora && (
                        <Grid item>
                            <Typography
                                variant='caption'
                                noWrap
                            >
                                CNPJ
                            </Typography>
                            <Typography
                                noWrap
                            >
                                {fornecedora?.cnpj}
                            </Typography>
                        </Grid>
                    )}

                    {fornecedora && (
                        <Grid item>
                            <Typography
                                variant='caption'
                                noWrap
                            >
                                Telefone
                            </Typography>
                            <Typography
                                noWrap
                            >
                                {fornecedora?.fone}
                            </Typography>
                        </Grid>
                    )}
                </Grid>
            </Box>
        </LayoutBaseDaPagina>
    );
};