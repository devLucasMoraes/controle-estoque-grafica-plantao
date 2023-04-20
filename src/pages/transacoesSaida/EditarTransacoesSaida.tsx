import { Box, Grid, LinearProgress, Paper } from '@mui/material';
import { FormHandles } from '@unform/core';
import { Form } from '@unform/web';
import { useEffect, useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import * as yup from 'yup';
import { AutoCompleteMateriais, AutoCompleteUser, DetailTools } from '../../shared/components';
import { IVFormErros, VDatePicker, VTextField } from '../../shared/forms';
import { LayoutBaseDePagina } from '../../shared/layouts';
import { TransacoesSaidaService } from '../../shared/services/api/transacoesSaida/TransacoesSaidaService';
import { AutoCompleteRequisitantes } from '../../shared/components/autoCompletions/AutoCompleteRequisitantes';
import { AutoCompleteDestinos } from '../../shared/components/autoCompletions/AutoCompleteDestinos';


interface IFormData {
    data_de_retirada: string;
    qtd: number;
    valor: number;
    op: string;
    obs: string;
    user_id: number;
    requisitante_id: number;
    destino_id: number;
    material_id: number;
}

const formValidationSchema: yup.ObjectSchema<IFormData> = yup.object().shape({
    qtd: yup.number().required(),
    data_de_retirada: yup.string().required(),
    valor: yup.number().required(),
    op: yup.string().required(),
    obs: yup.string().required(),
    requisitante_id: yup.number().required(),
    destino_id: yup.number().required(),
    material_id: yup.number().required(),
    user_id: yup.number().required()
});

export const EditarTransacoesSaida = () => {

    const { id = 'new' } = useParams<'id'>();
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(false);
    const formRef = useRef<FormHandles>(null);

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
                    TransacoesSaidaService
                        .create(dadosValidados)
                        .then(result => {
                            setIsLoading(false);
                            if (result instanceof Error) {
                                alert(result.message);
                            } else {
                                navigate(`/transacoesSaida/records/show/${result}`);
                            }
                        });
                } else {
                    TransacoesSaidaService
                        .updateById(Number(id), { id: Number(id), ...dadosValidados })
                        .then(result => {
                            setIsLoading(false);
                            if (result instanceof Error) {
                                alert(result.message);
                            } else {
                                navigate(`/transacoesSaida/records/show/${Number(id)}`);
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

    return (
        <LayoutBaseDePagina
            mostrarBotaoVoltar
            aoClicaeEmVoltar={() => navigate('/transacoesSaida')}
            titulo={id === 'new' ? 'Nova Transação' : 'Editar'}
            tools={
                <DetailTools
                    mostrarBotaoApagar={id !== 'new'}
                    mostrarBotaoDetalhar={id !== 'new'}
                    aoClicaeEmApagar={() => handleDelete(Number(id))}
                    aoClicaeEmDetalhar={() => navigate(`/transacoesSaida/records/show/${id}`)}
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
                                label='Quantidade'
                                fullWidth
                                placeholder='quantidade'
                                name='qtd'
                            />
                        </Grid>

                        <Grid item marginBottom={2}>
                            <VDatePicker
                                label='Entregue em'
                                name='data_de_retirada'
                            />
                        </Grid>

                        <Grid item marginBottom={2}>
                            <VTextField
                                label='Valor do item'
                                fullWidth
                                placeholder='valor do item'
                                name='valor'
                            />
                        </Grid>

                        <Grid item marginBottom={2}>
                            <VTextField
                                label='Ordem de produção'
                                fullWidth
                                placeholder='ordem de produção'
                                name='op'
                            />
                        </Grid>

                        <Grid item marginBottom={2}>
                            <VTextField
                                label='Observações'
                                fullWidth
                                placeholder='observações'
                                name='obs'
                            />
                        </Grid>

                        <Grid item marginBottom={2}>
                            <AutoCompleteRequisitantes isExternalLoading={isLoading} />
                        </Grid>

                        <Grid item marginBottom={2}>
                            <AutoCompleteDestinos isExternalLoading={isLoading} />
                        </Grid>

                        <Grid item marginBottom={2}>
                            <AutoCompleteMateriais isExternalLoading={isLoading} />
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