import { Box, Grid, LinearProgress, Paper } from '@mui/material';
import { FormHandles } from '@unform/core';
import { Form } from '@unform/web';
import { useEffect, useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import * as yup from 'yup';
import { IUFormErros, UAutoComplete, UDatePicker, UTextField } from '../../shared/forms';
import { LayoutBaseDaPagina } from '../../shared/layouts';
import { ITransacoesSaidaFormData, TransacoesSaidaService } from '../../shared/services/api/transacoesSaida/TransacoesSaidaService';
import { CrudTools } from '../../shared/components';
import { RequisitantesService } from '../../shared/services/api/requisitantes/RequisitantesService';
import { DestinosService } from '../../shared/services/api/destinos/DestinosService';




const formValidationSchema: yup.ObjectSchema<Omit<ITransacoesSaidaFormData, 'id'>> = yup.object().shape({
    data_retirada: yup.string().required(),
    valor_total: yup.number().required(),
    op: yup.string().required(),
    obs: yup.string().required(),
    requisitantes_id: yup.number().required(),
    destinos_id: yup.number().required(),
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
                        navigate('/transacoes_saida');
                    } else {
                        formRef.current?.setData(result);
                    }
                });
        }
    }, [id]);


    const handleSave = (dados: Omit<ITransacoesSaidaFormData, 'id'>) => {
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
                                navigate(`/transacoes_saida/records/show/${result}`);
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
                                navigate(`/transacoes_saida/records/show/${Number(id)}`);
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
            TransacoesSaidaService.deleteById(id)
                .then(result => {
                    if (result instanceof Error) {
                        alert(result.message);
                    } else {
                        alert('Registro apagado com sucesso!');
                        navigate('/transacoes_saida');
                    }
                });
        }
    };

    return (
        <LayoutBaseDaPagina
            mostrarBotaoVoltar
            aoClicaeEmVoltar={() => navigate('/transacoes_saida')}
            titulo={id === 'new' ? 'Nova Transação' : 'Editar'}
            tools={
                <CrudTools
                    mostrarBotaoApagar={id !== 'new'}
                    mostrarBotaoDetalhar={id !== 'new'}
                    aoClicaeEmApagar={() => handleDelete(Number(id))}
                    aoClicaeEmDetalhar={() => navigate(`/transacoes_saida/records/show/${id}`)}
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
                            <UDatePicker
                                label='Entregue em'
                                name='data_retirada'
                            />
                        </Grid>

                        <Grid item marginBottom={2}>
                            <UTextField
                                label='Valor total'
                                fullWidth
                                placeholder='valor total'
                                name='valor_total'
                            />
                        </Grid>

                        <Grid item marginBottom={2}>
                            <UTextField
                                label='Ordem de produção'
                                fullWidth
                                placeholder='ordem de produção'
                                name='op'
                            />
                        </Grid>

                        <Grid item marginBottom={2}>
                            <UTextField
                                label='Observações'
                                fullWidth
                                placeholder='observações'
                                name='obs'
                            />
                        </Grid>

                        <Grid item marginBottom={2}>
                            <UAutoComplete 
                                isExternalLoading={isLoading}
                                service={RequisitantesService}
                                label='Requisitante'
                                name='requisitantes_id'
                                optionLabel='nome'
                            />
                        </Grid>

                        <Grid item marginBottom={2}>
                            <UAutoComplete
                                isExternalLoading={isLoading} 
                                service={DestinosService}
                                name='destinos_id'
                                label='Destino'
                                optionLabel='nome'
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