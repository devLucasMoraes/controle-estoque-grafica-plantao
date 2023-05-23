import { Box, Grid, LinearProgress, Paper } from '@mui/material';
import { FormHandles } from '@unform/core';
import { Form } from '@unform/web';
import { useEffect, useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import * as yup from 'yup';
import { CrudTools } from '../../shared/components';
import { IUFormErros, UTextField } from '../../shared/forms';
import { LayoutBaseDaPagina } from '../../shared/layouts';
import { ITransportadoraFormData, TransportadorasService } from '../../shared/services/api/transportadoras/TransportadorasService';

const formValidationSchema: yup.ObjectSchema<Omit<ITransportadoraFormData, 'id'>> = yup.object().shape({
    nomeFantasia: yup.string().required(),
    razaoSocial: yup.string().required(),
    cnpj: yup.string().required(),
    fone: yup.string().required(),
});

export const EdicaoOuCriacaoDeTransportadora = () => {

    const { id = 'new' } = useParams<'id'>();

    const navigate = useNavigate();

    const formRef = useRef<FormHandles>(null);

    const [isLoading, setIsLoading] = useState(false);

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
                        formRef.current?.setData(result);
                    }
                });
        }
    }, [id]);

    const handleSave = (dados: Omit<ITransportadoraFormData, 'id'>) => {
        formValidationSchema
            .validate(dados, { abortEarly: false })
            .then(dadosValidados => {
                setIsLoading(true);
                if (id === 'new') {
                    TransportadorasService
                        .create(dadosValidados)
                        .then(result => {
                            setIsLoading(false);
                            if (result instanceof Error) {
                                alert(result.message);
                            } else {
                                navigate(`/transportadoras/records/show/${result}`);
                            }
                        });
                } else {
                    TransportadorasService
                        .updateById(Number(id), { id: Number(id), ...dadosValidados })
                        .then(result => {
                            setIsLoading(false);
                            if (result instanceof Error) {
                                alert(result.message);
                            } else {
                                navigate(`/transportadoras/records/show/${Number(id)}`);
                            }
                        });
                }
            })
            .catch((erros: yup.ValidationError) => {
                const validationErrors: IUFormErros = {};
                erros.inner.forEach(error => {
                    if (!error.path) return;
                    validationErrors[error.path] = error.message;
                });
                formRef.current?.setErrors(validationErrors);
            });
    };

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

    return (
        <LayoutBaseDaPagina
            mostrarBotaoVoltar
            aoClicaeEmVoltar={() => navigate('/transportadoras')}
            titulo={id === 'new' ? 'Nova Transportadora' : 'Editar'}
            tools={
                <CrudTools
                    mostrarBotaoApagar={id !== 'new'}
                    mostrarBotaoDetalhar={id !== 'new'}
                    aoClicaeEmApagar={() => handleDelete(Number(id))}
                    aoClicaeEmDetalhar={() => navigate(`/transportadoras/records/show/${id}`)}
                />
            }
        >
            <Form ref={formRef} onSubmit={dados => handleSave(dados)}>
                <Box component={Paper} display='flex' flexDirection='column' variant='outlined' margin={1} alignItems='center' justifyContent='center'>
                    <Grid container direction='column' spacing={2} padding={4}>
                        {isLoading && (
                            <Grid item>
                                <LinearProgress variant='indeterminate' />
                            </Grid>
                        )}

                        <Grid item marginBottom={2}>
                            <UTextField
                                label='Nome'
                                fullWidth
                                placeholder='Nome'
                                name='nomeFantasia'
                            />
                        </Grid>

                        <Grid item marginBottom={2}>
                            <UTextField
                                label='Razão social'
                                fullWidth
                                placeholder='razão social'
                                name='razaoSocial'
                            />
                        </Grid>

                        <Grid item marginBottom={2}>
                            <UTextField
                                label='CNPJ'
                                fullWidth
                                placeholder='CNPJ'
                                name='cnpj'
                            />
                        </Grid>

                        <Grid item marginBottom={2}>
                            <UTextField
                                label='Telefone'
                                fullWidth
                                placeholder='telefone'
                                name='fone'
                            />
                        </Grid>
                    </Grid>

                    <Box component='section' paddingBottom={4}>
                        <CrudTools
                            mostrarBotaoSalvar
                            aoClicaeEmSalvar={() => formRef.current?.submitForm()}
                        />
                    </Box>
                </Box>
            </Form>
        </LayoutBaseDaPagina>
    );
};