import { Box, Chip, Divider, Grid, LinearProgress, Paper } from '@mui/material';
import { FormHandles } from '@unform/core';
import { Form } from '@unform/web';
import { useEffect, useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import * as yup from 'yup';
import { CrudTools } from '../../shared/components';
import { IVFormErros, VAutoCompleteCategoria, VTextField } from '../../shared/forms';
import { LayoutBaseDaPagina } from '../../shared/layouts';
import { IMaterialFormData, MateriaisService } from '../../shared/services/api/materiais/MateriaisService';
import { ListaUnidadesConvertidas } from './listaUnidadesConvertidas';


const formValidationSchema: yup.ObjectSchema<Omit<IMaterialFormData, 'id'>> = yup.object().shape({
    descricao: yup.string().required(),
    categorias_id: yup.number().required(),
    valor_unt: yup.number().required(),
});

export const EdicaoOuCriacaoDeMaterial = () => {
    console.log('renderizou EditarMateriais');

    const { id = 'new' } = useParams<'id'>();

    const navigate = useNavigate();

    const formRef = useRef<FormHandles>(null);

    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        console.log('renderizou useEffect MateriaisService.getById EditarMateriais');
        if (id !== 'new') {
            setIsLoading(true);
            MateriaisService.getById(Number(id))
                .then(result => {
                    setIsLoading(false);
                    if (result instanceof Error) {
                        alert(result.message);
                        navigate('/materiais');
                    } else {
                        formRef.current?.setData(result);
                    }
                });
        }
    }, [id]);

    const handleSave = (dados: Omit<IMaterialFormData, 'id'>) => {
        console.log('renderizou handleSave EditarMateriais');
        formValidationSchema
            .validate(dados, { abortEarly: false })
            .then(dadosValidados => {
                setIsLoading(true);
                if (id === 'new') {
                    MateriaisService
                        .create(dadosValidados)
                        .then(result => {
                            setIsLoading(false);
                            if (result instanceof Error) {
                                alert(result.message);
                            } else {
                                navigate(`/materiais/records/show/${result}`);
                            }
                        });
                } else {
                    MateriaisService
                        .updateById(Number(id), { id: Number(id), ...dadosValidados })
                        .then(result => {
                            setIsLoading(false);
                            if (result instanceof Error) {
                                alert(result.message);
                            } else {
                                navigate(`/materiais/records/show/${Number(id)}`);
                            }
                        });
                }
            })
            .catch((erros: yup.ValidationError) => {
                const validationErrors: IVFormErros = {};
                erros.inner.forEach(error => {
                    if (!error.path) return;
                    validationErrors[error.path] = error.message;
                    console.log(validationErrors);
                });
                formRef.current?.setErrors(validationErrors);
            });
    };

    const handleDelete = (id: number) => {
        console.log('renderizou handleDelete EditarMateriais');
        if (confirm('Realmente deseja apagar?')) {
            MateriaisService.deleteById(id)
                .then(result => {
                    if (result instanceof Error) {
                        alert(result.message);
                    } else {
                        alert('Registro apagado com sucesso!');
                        navigate('/materiais');
                    }
                });
        }
    };

    return (
        <LayoutBaseDaPagina
            mostrarBotaoVoltar
            aoClicaeEmVoltar={() => navigate('/materiais')}
            titulo={id === 'new' ? 'Novo Material' : 'Editar'}
            tools={
                <CrudTools
                    mostrarBotaoApagar={id !== 'new'}
                    mostrarBotaoDetalhar={id !== 'new'}
                    aoClicaeEmApagar={() => handleDelete(Number(id))}
                    aoClicaeEmDetalhar={() => navigate(`/materiais/records/show/${id}`)}
                />
            }
        >
            <Form ref={formRef} onSubmit={dados => handleSave(dados)}>
                <Box component={Paper} display='flex' flexDirection='column' variant='outlined' margin={1} alignItems='center' justifyContent='center'>
                    <Grid container padding={4} rowGap={2}>
                        {isLoading && (
                            <Grid item>
                                <LinearProgress variant='indeterminate' />
                            </Grid>
                        )}

                        <Grid container columnSpacing={2} spacing={2}>
                            <Grid item xs={12} lg={6}>
                                <VTextField
                                    label='Descriçao'
                                    fullWidth
                                    placeholder='Descriçao'
                                    name='descricao'
                                />
                            </Grid>

                            <Grid item xs={12} lg={2}>
                                <VTextField
                                    label='Valor unitário'
                                    fullWidth
                                    placeholder='valor unitário'
                                    name='valor_unt'
                                />
                            </Grid>

                            <Grid item xs={12} lg={4}>
                                <VAutoCompleteCategoria
                                    isExternalLoading={isLoading}
                                    name='categorias_id'
                                />
                            </Grid>
                        </Grid>

                        <Grid item flexGrow={1}>
                            <Divider textAlign="left">
                                <Chip label="CONVERSOR DE UNIDADES" />
                            </Divider>
                        </Grid>
                        
                        <ListaUnidadesConvertidas />
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