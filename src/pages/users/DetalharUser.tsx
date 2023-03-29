import { Box, Grid, LinearProgress, Paper, Typography } from '@mui/material';
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { DetailTools } from '../../shared/components';
import { LayoutBaseDePagina } from '../../shared/layouts';
import { UsersService, IListagemUser } from '../../shared/services/api/users/UsersService';


export const DetalharUser = () => {

    const navigate = useNavigate();
    const { id } = useParams<'id'>();
    const [isLoading, setIsLoading] = useState(false);
    const [user, setUser] = useState<IListagemUser>();


    const handleDelete = (id: number) => {
        if (confirm('Realmente deseja apagar?')) {
            UsersService.deleteById(id)
                .then(result => {
                    if (result instanceof Error) {
                        alert(result.message);
                    } else {
                        alert('Registro apagado com sucesso!');
                        navigate('/users');
                    }
                });
        }
    };

    useEffect(() => {
        if (id !== 'new') {
            setIsLoading(true);
            UsersService.getById(Number(id))
                .then(result => {
                    setIsLoading(false);
                    if (result instanceof Error) {
                        alert(result.message);
                        navigate('/users');
                    } else {
                        console.log(result);
                        setUser(result);
                    }
                });
        }
    }, [id]);

    return (
        <LayoutBaseDePagina
            mostrarBotaoVoltar
            aoClicaeEmVoltar={() => navigate('/users')}
            titulo='Detalhar'
            tools={
                <DetailTools
                    mostrarBotaoApagar
                    mostrarBotaoEditar
                    aoClicaeEmApagar={() => handleDelete(Number(id))}
                    aoClicaeEmEditar={() => navigate(`/users/records/edit/${id}`)}
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
                            {user?.id}
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
                            {user?.name}
                        </Typography>
                    </Grid>

                    <Grid item>
                        <Typography
                            variant='caption'
                            noWrap
                        >
                            Email
                        </Typography>
                        <Typography
                            noWrap
                        >
                            {user?.email}
                        </Typography>
                    </Grid>

                    <Grid item>
                        <Typography
                            variant='caption'
                            noWrap
                        >
                            Senha
                        </Typography>
                        <Typography
                            noWrap
                        >
                            {user?.password_hash}
                        </Typography>
                    </Grid>

                    <Grid item>
                        <Typography
                            variant='caption'
                            noWrap
                        >
                            Cargo
                        </Typography>
                        <Typography
                            noWrap
                        >
                            {user?.role}
                        </Typography>
                    </Grid>

                    <Grid item >
                        <Box display='flex' flexDirection='column'>
                            <Typography
                                component={Box}
                                variant='caption'
                                noWrap
                            >
                                status
                            </Typography>
                            <Typography
                                noWrap
                            >
                                {user?.status}
                            </Typography>
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
                            {user?.createdAt}
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
                            {user?.updatedAt}
                        </Typography>
                    </Grid>
                </Grid>
            </Box>
        </LayoutBaseDePagina>
    );
};