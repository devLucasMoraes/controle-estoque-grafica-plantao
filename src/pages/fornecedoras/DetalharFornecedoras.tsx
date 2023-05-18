import { Box, Grid, LinearProgress, Paper, Typography } from '@mui/material';
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { CrudTools } from '../../shared/components';
import { LayoutBaseDaPagina } from '../../shared/layouts';
import { FornecedorasService, IDetalhamentoFornecedora } from '../../shared/services/api/fornecedoras/FornecedorasService';


export const DetalharFornecedoras = () => {

    const navigate = useNavigate();
    const { id } = useParams<'id'>();
    const [isLoading, setIsLoading] = useState(false);
    const [fornecedor, setFornecedor] = useState<IDetalhamentoFornecedora>();


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
                        setFornecedor(result);
                    }
                });
        }
    }, [id]);

    return (
        <LayoutBaseDaPagina
            mostrarBotaoVoltar
            aoClicaeEmVoltar={() => navigate('/fornecedoras')}
            titulo='Detalhar'
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
                            {fornecedor?.id}
                        </Typography>
                    </Grid>

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
                            {fornecedor?.nome_fantasia}
                        </Typography>
                    </Grid>

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
                            {fornecedor?.razao_social}
                        </Typography>
                    </Grid>

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
                            {fornecedor?.cnpj}
                        </Typography>
                    </Grid>

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
                            {fornecedor?.fone}
                        </Typography>
                    </Grid>

                </Grid>
            </Box>
        </LayoutBaseDaPagina>
    );
};