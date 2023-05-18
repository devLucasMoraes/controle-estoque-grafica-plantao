import { Box, Grid, LinearProgress, Paper, Typography } from '@mui/material';
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { DetailTools, UnderlineLinkFornecedores, UnderlineLinkTransportadoras } from '../../shared/components';
import { LayoutBaseDaPagina } from '../../shared/layouts';
import { TransacoesEntradaService, IDetalhamentoTransacoesEntrada } from '../../shared/services/api/transacoesEntrada/TransacoesEntradaService';


export const DetalharTransacoesEntrada = () => {

    const navigate = useNavigate();
    const { id } = useParams<'id'>();
    const [isLoading, setIsLoading] = useState(false);
    const [transacoesEntrada, setTransacoesEntrada] = useState<IDetalhamentoTransacoesEntrada>();


    const handleDelete = (id: number) => {
        if (confirm('Realmente deseja apagar?')) {
            TransacoesEntradaService.deleteById(id)
                .then(result => {
                    if (result instanceof Error) {
                        alert(result.message);
                    } else {
                        alert('Registro apagado com sucesso!');
                        navigate('/transacoes_entrada');
                    }
                });
        }
    };

    useEffect(() => {
        if (id !== 'new') {
            setIsLoading(true);
            TransacoesEntradaService.getById(Number(id))
                .then(result => {
                    setIsLoading(false);
                    if (result instanceof Error) {
                        alert(result.message);
                        navigate('/transacoes_entrada');
                    } else {
                        console.log('result');
                        console.log(result);
                        setTransacoesEntrada(result);
                    }
                });
        }
    }, [id]);

    return (
        <LayoutBaseDaPagina
            mostrarBotaoVoltar
            aoClicaeEmVoltar={() => navigate('/transacoes_entrada')}
            titulo='Detalhar'
            tools={
                <DetailTools
                    mostrarBotaoApagar
                    mostrarBotaoEditar
                    aoClicaeEmApagar={() => handleDelete(Number(id))}
                    aoClicaeEmEditar={() => navigate(`/transacoes_entrada/records/edit/${id}`)}
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

                    {transacoesEntrada && (
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
                                {transacoesEntrada?.id}
                            </Typography>
                        </Grid>
                    )}

                    {transacoesEntrada && (
                        <Grid item>
                            <Typography
                                variant='caption'
                                noWrap
                            >
                                NFe
                            </Typography>
                            <Typography
                                noWrap
                            >
                                {transacoesEntrada?.nfe}
                            </Typography>
                        </Grid>
                    )}

                    {transacoesEntrada && (
                        <Grid item>
                            <Typography
                                variant='caption'
                                noWrap
                            >
                                Emitido em
                            </Typography>
                            <Typography
                                noWrap
                            >
                                {transacoesEntrada?.data_emissao}
                            </Typography>
                        </Grid>
                    )}

                    {transacoesEntrada && (
                        <Grid item>
                            <Typography
                                variant='caption'
                                noWrap
                            >
                                Recebido em
                            </Typography>
                            <Typography
                                noWrap
                            >
                                {transacoesEntrada?.data_recebimento}
                            </Typography>
                        </Grid>
                    )}

                    {transacoesEntrada && (
                        <Grid item>
                            <Typography
                                variant='caption'
                                noWrap
                            >
                                Taxa IPI
                            </Typography>
                            <Typography
                                noWrap
                            >
                                {transacoesEntrada?.valor_ipi_total}
                            </Typography>
                        </Grid>
                    )}

                    {transacoesEntrada && (
                        <Grid item>
                            <Typography
                                variant='caption'
                                noWrap
                            >
                                Valor total
                            </Typography>
                            <Typography
                                noWrap
                            >
                                {transacoesEntrada?.valor_total}
                            </Typography>
                        </Grid>
                    )}

                    {transacoesEntrada && (
                        <Grid item >
                            <Box display='flex' flexDirection='column'>
                                <Typography
                                    component={Box}
                                    variant='caption'
                                    noWrap
                                >
                                    Fornecedora
                                </Typography>
                                <UnderlineLinkFornecedores id={transacoesEntrada?.fornecedora_id} />
                            </Box>
                        </Grid>
                    )}

                    {transacoesEntrada && (
                        <Grid item>
                            <Typography
                                variant='caption'
                                noWrap
                            >
                                Valor do Frete
                            </Typography>
                            <Typography
                                noWrap
                            >
                                {transacoesEntrada?.valor_frete}
                            </Typography>
                        </Grid>
                    )}

                    {transacoesEntrada && (
                        <Grid item >
                            <Box display='flex' flexDirection='column'>
                                <Typography
                                    component={Box}
                                    variant='caption'
                                    noWrap
                                >
                                    Transportadora
                                </Typography>
                                <UnderlineLinkTransportadoras id={transacoesEntrada?.transportadora_id} />
                            </Box>
                        </Grid>
                    )}

                    {transacoesEntrada && (
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
                                {transacoesEntrada?.obs}
                            </Typography>
                        </Grid>
                    )}


                </Grid>
            </Box>
        </LayoutBaseDaPagina>
    );
};