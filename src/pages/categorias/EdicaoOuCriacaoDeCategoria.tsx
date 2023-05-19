import { Box, Grid, LinearProgress, Paper } from '@mui/material';
import { FormHandles } from '@unform/core';
import { Form } from '@unform/web';
import { useEffect, useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import * as yup from 'yup';
import { CrudTools } from '../../shared/components';
import { IVFormErros, VTextField } from '../../shared/forms';
import { LayoutBaseDaPagina } from '../../shared/layouts';
import { CategoriasService, ICategoriaFormData } from '../../shared/services/api/categorias/CategoriasService';


const formValidationSchema: yup.ObjectSchema<Omit<ICategoriaFormData, 'id'>> = yup.object().shape({
    nome: yup.string().required(),
    und_padrao: yup.string().required(),
    estoque_minimo: yup.number().required(),
});

export const EdicaoOuCriacaoDeCategoria = () => {
    console.log('renderizou EdicaoOuCriacaoDeCategoria');

    const { id = 'new' } = useParams<'id'>();

    const navigate = useNavigate();
    
    const formRef = useRef<FormHandles>(null);

    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        console.log('renderizou useEffect CategoriasService.getById EdicaoOuCriacaoDeCategoria');
        if (id !== 'new') {
            setIsLoading(true);
            CategoriasService.getById(Number(id))
                .then(result => {
                    setIsLoading(false);
                    if (result instanceof Error) {
                        alert(result.message);
                        navigate('/categorias');
                    } else {
                        formRef.current?.setData(result);
                    }
                });
        }
    }, [id]);

    const handleSave = (dados: Omit<ICategoriaFormData, 'id'>) => {
        console.log('renderizou handleSave EdicaoOuCriacaoDeCategoria');
        formValidationSchema
            .validate(dados, { abortEarly: false })
            .then(dadosValidados => {
                setIsLoading(true);
                if (id === 'new') {
                    CategoriasService
                        .create(dadosValidados)
                        .then(result => {
                            setIsLoading(false);
                            if (result instanceof Error) {
                                alert(result.message);
                            } else {
                                navigate(`/categorias/records/show/${result}`);
                            }
                        });
                } else {
                    CategoriasService
                        .updateById(Number(id), { id: Number(id), ...dadosValidados })
                        .then(result => {
                            setIsLoading(false);
                            if (result instanceof Error) {
                                alert(result.message);
                            } else {
                                navigate(`/categorias/records/show/${Number(id)}`);
                            }
                        });
                }
            })
            .catch((erros: yup.ValidationError) => {
                const validationErrors: IVFormErros = {};
                erros.inner.forEach(error => {
                    if (!error.path) return;
                    validationErrors[error.path] = error.message;
                });
                formRef.current?.setErrors(validationErrors);
            });
    };

    const handleDelete = (id: number) => {
        console.log('renderizou handleDelete EdicaoOuCriacaoDeCategoria');
        if (confirm('Realmente deseja apagar?')) {
            CategoriasService.deleteById(id)
                .then(result => {
                    if (result instanceof Error) {
                        alert(result.message);
                    } else {
                        alert('Registro apagado com sucesso!');
                        navigate('/categorias');
                    }
                });
        }
    };

    return (
        <LayoutBaseDaPagina
            mostrarBotaoVoltar
            aoClicaeEmVoltar={() => navigate('/categorias')}
            titulo={id === 'new' ? 'Nova Categoria' : 'Edição'}
            tools={
                <CrudTools
                    mostrarBotaoApagar={id !== 'new'}
                    mostrarBotaoDetalhar={id !== 'new'}
                    aoClicaeEmApagar={() => handleDelete(Number(id))}
                    aoClicaeEmDetalhar={() => navigate(`/categorias/records/show/${id}`)}
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
                            <VTextField
                                label='Nome'
                                fullWidth
                                placeholder='Nome'
                                name='nome'
                            />
                        </Grid>

                        <Grid item marginBottom={2}>
                            <VTextField
                                label='Unidade de medida'
                                fullWidth
                                placeholder='unidade de medida'
                                name='und_padrao'
                            />
                        </Grid>

                        <Grid item marginBottom={2}>
                            <VTextField
                                label='Estoque minimo'
                                fullWidth
                                placeholder='estoque minimo'
                                name='estoque_minimo'
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