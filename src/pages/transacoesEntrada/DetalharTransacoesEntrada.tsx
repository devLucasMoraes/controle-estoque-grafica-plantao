import { Box, Grid, LinearProgress, Paper, Typography } from '@mui/material';
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { DetailTools, UnderlineLinkFornecedores, UnderlineLinkMateriais, UnderlineLinkTransportadoras, UnderlineLinkUser } from '../../shared/components';
import { LayoutBaseDePagina } from '../../shared/layouts';
import { TransacoesEntradaService, IListagemTransacoesEntrada } from '../../shared/services/api/transacoesEntrada/TransacoesEntradaService';


export const DetalharTransacoesEntrada = () => {

    const navigate = useNavigate();
    const { id } = useParams<'id'>();
    const [isLoading, setIsLoading] = useState(false);
    const [transacoesEntrada, setTransacoesEntrada] = useState<IListagemTransacoesEntrada>();


    const handleDelete = (id: number) => {
        if (confirm('Realmente deseja apagar?')) {
            TransacoesEntradaService.deleteById(id)
                .then(result => {
                    if (result instanceof Error) {
                        alert(result.message);
                    } else {
                        alert('Registro apagado com sucesso!');
                        navigate('/transacoesEntrada');
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
                        navigate('/transacoesEntrada');
                    } else {
                        console.log('result');
                        console.log(result);
                        setTransacoesEntrada(result);
                    }
                });
        }
    }, [id]);

    return (
        <LayoutBaseDePagina
            mostrarBotaoVoltar
            aoClicaeEmVoltar={() => navigate('/transacoesEntrada')}
            titulo='Detalhar'
            tools={
                <DetailTools
                    mostrarBotaoApagar
                    mostrarBotaoEditar
                    aoClicaeEmApagar={() => handleDelete(Number(id))}
                    aoClicaeEmEditar={() => navigate(`/transacoesEntrada/records/edit/${id}`)}
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
                            {transacoesEntrada?.id}
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
                            {transacoesEntrada?.qtd}
                        </Typography>
                    </Grid>

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
                            {transacoesEntrada?.data_de_recebimento}
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
                            {transacoesEntrada?.valor}
                        </Typography>
                    </Grid>

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

                    <Grid item >
                        <Box display='flex' flexDirection='column'>
                            <Typography
                                component={Box}
                                variant='caption'
                                noWrap
                            >
                                Material
                            </Typography>
                            <UnderlineLinkMateriais id={transacoesEntrada?.material_id} />
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
                            <UnderlineLinkUser id={transacoesEntrada?.user_id} />
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
                            {transacoesEntrada?.createdAt}
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
                            {transacoesEntrada?.updatedAt}
                        </Typography>
                    </Grid>
                </Grid>
            </Box>
        </LayoutBaseDePagina>
    );
};