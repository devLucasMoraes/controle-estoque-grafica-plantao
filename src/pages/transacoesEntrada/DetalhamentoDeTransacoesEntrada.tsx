import { Box, Grid, LinearProgress, Paper, Typography } from '@mui/material';
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { CrudTools, UnderlineLinkFornecedores, UnderlineLinkTransportadoras } from '../../shared/components';
import { LayoutBaseDaPagina } from '../../shared/layouts';
import { TransacoesEntradaService, IDetalhamentoTransacoesEntrada } from '../../shared/services/api/transacoesEntrada/TransacoesEntradaService';


export const DetalhamentoDeTransacoesEntrada = () => {
    console.log('renderizou DetalhamentoDeTransacoesEntrada');

    const { id } = useParams<'id'>();

    const navigate = useNavigate();

    const [isLoading, setIsLoading] = useState(false);
    const [transacoesEntrada, setTransacoesEntrada] = useState<IDetalhamentoTransacoesEntrada>();

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

    return (
        <LayoutBaseDaPagina
            mostrarBotaoVoltar
            aoClicaeEmVoltar={() => navigate('/transacoes_entrada')}
            titulo='Detalhamento'
            tools={
                <CrudTools
                    mostrarBotaoApagar
                    mostrarBotaoEditar
                    aoClicaeEmApagar={() => handleDelete(Number(id))}
                    aoClicaeEmEditar={() => navigate(`/transacoes_entrada/records/edit/${id}`)}
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
                                {transacoesEntrada?.dataEmissao}
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
                                {transacoesEntrada?.dataRecebimento}
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
                                {transacoesEntrada?.valorIpiTotal}
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
                                {transacoesEntrada?.valorTotal}
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
                                <UnderlineLinkFornecedores id={transacoesEntrada?.idFornecedora} />
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
                                {transacoesEntrada?.valorFrete}
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
                                <UnderlineLinkTransportadoras id={transacoesEntrada?.idTransportadora} />
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