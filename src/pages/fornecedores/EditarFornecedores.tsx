import { Box, Grid, LinearProgress, Paper } from '@mui/material';
import { FormHandles } from '@unform/core';
import { Form } from '@unform/web';
import { useEffect, useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import * as yup from 'yup';
import { AutoCompleteUser, DetailTools } from '../../shared/components';
import { IVFormErros, VTextField } from '../../shared/forms';
import { LayoutBaseDePagina } from '../../shared/layouts';
import { FornecedoresService } from '../../shared/services/api/fornecedores/FornecedoresService';


interface IFormData {
    name: string;
    razao_social: string;
    cnpj: string;
    fone1: string;
    fone2: string;
    user_id: number;
}

const formValidationSchema: yup.ObjectSchema<IFormData> = yup.object().shape({
    name: yup.string().required(),
    razao_social: yup.string().required(),
    cnpj: yup.string().required(),
    fone1: yup.string().required(),
    fone2: yup.string().required(),
    user_id: yup.number().required()
});

export const EditarFornecedores= () => {

    const { id = 'new' } = useParams<'id'>();
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(false);
    const formRef = useRef<FormHandles>(null);

    useEffect(() => {
        if (id !== 'new') {
            setIsLoading(true);
            FornecedoresService.getById(Number(id))
                .then(result => {
                    setIsLoading(false);
                    if (result instanceof Error) {
                        alert(result.message);
                        navigate('/fornecedores');
                    } else {
                        console.log(result);
                        formRef.current?.setData(result);
                    }
                });
        }
    }, [id]);


    const handleSave = (dados: IFormData) => {
        formValidationSchema
            .validate(dados, { abortEarly: false })
            .then(dadosValidados => {
                setIsLoading(true);
                if (id === 'new') {
                    FornecedoresService
                        .create(dadosValidados)
                        .then(result => {
                            setIsLoading(false);
                            if (result instanceof Error) {
                                alert(result.message);
                            } else {
                                navigate(`/fornecedores/records/show/${result}`);
                            }
                        });
                } else {
                    FornecedoresService
                        .updateById(Number(id), { id: Number(id), ...dadosValidados })
                        .then(result => {
                            setIsLoading(false);
                            if (result instanceof Error) {
                                alert(result.message);
                            } else {
                                navigate(`/fornecedores/records/show/${Number(id)}`);
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
        if (confirm('Realmente deseja apagar?')) {
            FornecedoresService.deleteById(id)
                .then(result => {
                    if (result instanceof Error) {
                        alert(result.message);
                    } else {
                        alert('Registro apagado com sucesso!');
                        navigate('/fornecedores');
                    }
                });
        }
    };

    return (
        <LayoutBaseDePagina
            mostrarBotaoVoltar
            aoClicaeEmVoltar={() => navigate('/fornecedores')}
            titulo={id === 'new' ? 'Novo Fornecedor' : 'Editar'}
            tools={
                <DetailTools
                    mostrarBotaoApagar={id !== 'new'}
                    mostrarBotaoDetalhar={id !== 'new'}
                    aoClicaeEmApagar={() => handleDelete(Number(id))}
                    aoClicaeEmDetalhar={() => navigate(`/fornecedores/records/show/${id}`)}
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
                                name='name'
                            />
                        </Grid>

                        <Grid item marginBottom={2}>
                            <VTextField
                                label='Razão social'
                                fullWidth
                                placeholder='razão social'
                                name='razao_social'
                            />
                        </Grid>

                        <Grid item marginBottom={2}>
                            <VTextField
                                label='CNPJ'
                                fullWidth
                                placeholder='CNPJ'
                                name='cnpj'
                            />
                        </Grid>

                        <Grid item marginBottom={2}>
                            <VTextField
                                label='Telefone'
                                fullWidth
                                placeholder='telefone'
                                name='fone1'
                            />
                        </Grid>

                        <Grid item marginBottom={2}>
                            <VTextField
                                label='Celular'
                                fullWidth
                                placeholder='celular'
                                name='fone2'
                            />
                        </Grid>

                        <Grid item marginBottom={2}>
                            <AutoCompleteUser isExternalLoading={isLoading} />
                        </Grid>

                    </Grid>
                    <Box component='section' paddingBottom={4}>
                        <DetailTools
                            mostrarBotaoSalvar
                            aoClicaeEmSalvar={() => formRef.current?.submitForm()}
                        />
                    </Box>
                </Box>
            </Form>

        </LayoutBaseDePagina>
    );
};