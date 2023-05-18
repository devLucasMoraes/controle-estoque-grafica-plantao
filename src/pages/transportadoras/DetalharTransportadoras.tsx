import { Box, Grid, LinearProgress, Paper, Typography } from '@mui/material';
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { DetailTools } from '../../shared/components';
import { LayoutBaseDaPagina } from '../../shared/layouts';
import { TransportadorasService, IDetalhamentoTransportadora } from '../../shared/services/api/transportadoras/TransportadorasService';


export const DetalharTransportadoras = () => {

    const navigate = useNavigate();
    const { id } = useParams<'id'>();
    const [isLoading, setIsLoading] = useState(false);
    const [transportadora, setTransportadora] = useState<IDetalhamentoTransportadora>();


    const handleDelete = (id: number) => {
        if (confirm('Realmente deseja apagar?')) {
            TransportadorasService.deleteById(id)
                .then(result => {
                    if (result instanceof Error) {
                        alert(result.message);
                    } else {
                        alert('Registro apagado com sucesso!');
                        navigate('/transportadoras');
                    }
                });
        }
    };

    useEffect(() => {
        if (id !== 'new') {
            setIsLoading(true);
            TransportadorasService.getById(Number(id))
                .then(result => {
                    setIsLoading(false);
                    if (result instanceof Error) {
                        alert(result.message);
                        navigate('/transportadoras');
                    } else {
                        console.log(result);
                        setTransportadora(result);
                    }
                });
        }
    }, [id]);

    return (
        <LayoutBaseDaPagina
            mostrarBotaoVoltar
            aoClicaeEmVoltar={() => navigate('/transportadoras')}
            titulo='Detalhar'
            tools={
                <DetailTools
                    mostrarBotaoApagar
                    mostrarBotaoEditar
                    aoClicaeEmApagar={() => handleDelete(Number(id))}
                    aoClicaeEmEditar={() => navigate(`/transportadoras/records/edit/${id}`)}
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
                            {transportadora?.id}
                        </Typography>
                    </Grid>

                    <Grid item>
                        <Typography
                            variant='caption'
                            noWrap
                        >
                            Nome fantasia
                        </Typography>
                        <Typography
                            noWrap
                        >
                            {transportadora?.nome_fantasia}
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
                            {transportadora?.razao_social}
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
                            {transportadora?.cnpj}
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
                            {transportadora?.fone}
                        </Typography>
                    </Grid>

       
                </Grid>
            </Box>
        </LayoutBaseDaPagina>
    );
};