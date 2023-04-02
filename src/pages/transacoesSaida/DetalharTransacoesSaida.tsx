import { Box, Grid, LinearProgress, Paper, Typography } from '@mui/material';
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { DetailTools, UnderlineLinkDestinos, UnderlineLinkMateriais, UnderlineLinkRequisitantes, UnderlineLinkUser } from '../../shared/components';
import { LayoutBaseDePagina } from '../../shared/layouts';
import { TransacoesSaidaService, IListagemTransacoesSaida } from '../../shared/services/api/transacoesSaida/TransacoesSaidaService';


export const DetalharTransacoesSaida = () => {

    const navigate = useNavigate();
    const { id } = useParams<'id'>();
    const [isLoading, setIsLoading] = useState(false);
    const [transacoesSaida, setTransacoesSaida] = useState<IListagemTransacoesSaida>();


    const handleDelete = (id: number) => {
        if (confirm('Realmente deseja apagar?')) {
            TransacoesSaidaService.deleteById(id)
                .then(result => {
                    if (result instanceof Error) {
                        alert(result.message);
                    } else {
                        alert('Registro apagado com sucesso!');
                        navigate('/transacoesSaida');
                    }
                });
        }
    };

    useEffect(() => {
        if (id !== 'new') {
            setIsLoading(true);
            TransacoesSaidaService.getById(Number(id))
                .then(result => {
                    setIsLoading(false);
                    if (result instanceof Error) {
                        alert(result.message);
                        navigate('/transacoesSaida');
                    } else {
                        console.log('result');
                        console.log(result);
                        setTransacoesSaida(result);
                    }
                });
        }
    }, [id]);

    return (
        <LayoutBaseDePagina
            mostrarBotaoVoltar
            aoClicaeEmVoltar={() => navigate('/transacoesSaida')}
            titulo='Detalhar'
            tools={
                <DetailTools
                    mostrarBotaoApagar
                    mostrarBotaoEditar
                    aoClicaeEmApagar={() => handleDelete(Number(id))}
                    aoClicaeEmEditar={() => navigate(`/transacoesSaida/records/edit/${id}`)}
                />
            }
        >
            <Box
                component={Paper}
                
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
                            {transacoesSaida?.id}
                        </Typography>
                    </Grid>

                    <Grid item>
                        <Typography
                            variant='caption'
                            noWrap
                        >
                            Quantidade
                        </Typography>
                        <Typography
                            noWrap
                        >
                            {transacoesSaida?.qtd}
                        </Typography>
                    </Grid>

                    <Grid item>
                        <Typography
                            variant='caption'
                            noWrap
                        >
                            Entregue em
                        </Typography>
                        <Typography
                            noWrap
                        >
                            {transacoesSaida?.data_de_retirada}
                        </Typography>
                    </Grid>

                    <Grid item>
                        <Typography
                            variant='caption'
                            noWrap
                        >
                            Valor
                        </Typography>
                        <Typography
                            noWrap
                        >
                            {transacoesSaida?.valor}
                        </Typography>
                    </Grid>

                    <Grid item>
                        <Typography
                            variant='caption'
                            noWrap
                        >
                            Ordem de produção
                        </Typography>
                        <Typography
                            noWrap
                        >
                            {transacoesSaida?.op}
                        </Typography>
                    </Grid>

                    <Grid item>
                        <Typography
                            variant='caption'
                            noWrap
                        >
                            Observações
                        </Typography>
                        <Typography
                            noWrap
                        >
                            {transacoesSaida?.obs}
                        </Typography>
                    </Grid>

                    <Grid item >
                        <Box display='flex' flexDirection='column'>
                            <Typography
                                component={Box}
                                variant='caption'
                                noWrap
                            >
                                Requisitante
                            </Typography>
                            <UnderlineLinkRequisitantes id={transacoesSaida?.requisitante_id} />
                        </Box>
                    </Grid>

                    <Grid item >
                        <Box display='flex' flexDirection='column'>
                            <Typography
                                component={Box}
                                variant='caption'
                                noWrap
                            >
                                Destino
                            </Typography>
                            <UnderlineLinkDestinos id={transacoesSaida?.destino_id} />
                        </Box>
                    </Grid>

                    <Grid item >
                        <Box display='flex' flexDirection='column'>
                            <Typography
                                component={Box}
                                variant='caption'
                                noWrap
                            >
                                Material
                            </Typography>
                            <UnderlineLinkMateriais id={transacoesSaida?.material_id} />
                        </Box>
                    </Grid>

                    <Grid item >
                        <Box display='flex' flexDirection='column'>
                            <Typography
                                component={Box}
                                variant='caption'
                                noWrap
                            >
                                Modificado por
                            </Typography>
                            <UnderlineLinkUser id={transacoesSaida?.user_id} />
                        </Box>
                    </Grid>

                    <Grid item>
                        <Typography
                            variant='caption'
                            noWrap
                        >
                            Criado em
                        </Typography>
                        <Typography
                            noWrap
                        >
                            {transacoesSaida?.createdAt}
                        </Typography>
                    </Grid>

                    <Grid item>
                        <Typography
                            variant='caption'
                            noWrap
                        >
                            Atualizado em
                        </Typography>
                        <Typography
                            noWrap
                        >
                            {transacoesSaida?.updatedAt}
                        </Typography>
                    </Grid>
                </Grid>
            </Box>
        </LayoutBaseDePagina>
    );
};