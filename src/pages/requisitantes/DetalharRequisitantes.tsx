import { Box, Grid, LinearProgress, Paper, Typography } from '@mui/material';
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { DetailTools, UnderlineLinkUser } from '../../shared/components';
import { LayoutBaseDePagina } from '../../shared/layouts';
import { RequisitantesService, IListagemRequisitantes } from '../../shared/services/api/requisitantes/RequisitantesService';


export const DetalharRequisitantes = () => {

    const navigate = useNavigate();
    const { id } = useParams<'id'>();
    const [isLoading, setIsLoading] = useState(false);
    const [requisitantes, setRequisitantes] = useState<IListagemRequisitantes>();


    const handleDelete = (id: number) => {
        if (confirm('Realmente deseja apagar?')) {
            RequisitantesService.deleteById(id)
                .then(result => {
                    if (result instanceof Error) {
                        alert(result.message);
                    } else {
                        alert('Registro apagado com sucesso!');
                        navigate('/requisitantes');
                    }
                });
        }
    };

    useEffect(() => {
        if (id !== 'new') {
            setIsLoading(true);
            RequisitantesService.getById(Number(id))
                .then(result => {
                    setIsLoading(false);
                    if (result instanceof Error) {
                        alert(result.message);
                        navigate('/requisitantes');
                    } else {
                        console.log(result);
                        setRequisitantes(result);
                    }
                });
        }
    }, [id]);

    return (
        <LayoutBaseDePagina
            mostrarBotaoVoltar
            aoClicaeEmVoltar={() => navigate('/requisitantes')}
            titulo='Detalhar'
            tools={
                <DetailTools
                    mostrarBotaoApagar
                    mostrarBotaoEditar
                    aoClicaeEmApagar={() => handleDelete(Number(id))}
                    aoClicaeEmEditar={() => navigate(`/requisitantes/records/edit/${id}`)}
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
                            {requisitantes?.id}
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
                            {requisitantes?.name}
                        </Typography>
                    </Grid>

                    <Grid item>
                        <Typography
                            variant='caption'
                            noWrap
                        >
                            Celular
                        </Typography>
                        <Typography
                            noWrap
                        >
                            {requisitantes?.fone}
                        </Typography>
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
                            <UnderlineLinkUser id={requisitantes?.user_id} />
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
                            {requisitantes?.createdAt}
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
                            {requisitantes?.updatedAt}
                        </Typography>
                    </Grid>
                </Grid>
            </Box>
        </LayoutBaseDePagina>
    );
};