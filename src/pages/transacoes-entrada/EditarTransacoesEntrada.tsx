import { Box, Grid, LinearProgress, Paper } from '@mui/material';
import { FormHandles } from '@unform/core';
import { Form } from '@unform/web';
import { useEffect, useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import * as yup from 'yup';
import { AutoCompleteFornecedores, AutoCompleteMateriais, AutoCompleteTransportadoras, AutoCompleteUser, DetailTools } from '../../shared/components';
import { IVFormErros, VDatePicker, VTextField } from '../../shared/forms';
import { LayoutBaseDePagina } from '../../shared/layouts';
import { TransacoesEntradaService } from '../../shared/services/api/transacoesEntrada/TransacoesEntradaService';


interface IFormData {
    qtd: number;
    data_de_recebimento: string;
    valor: number;
    valor_frete: number;
    nfe: string;
    obs: string;
    transportadora_id: number;
    fornecedora_id: number;
    material_id: number;
    user_id: number;
}

const formValidationSchema: yup.ObjectSchema<IFormData> = yup.object().shape({
    qtd: yup.number().required(),
    data_de_recebimento: yup.string().required(),
    valor: yup.number().required(),
    valor_frete: yup.number().required(),
    nfe: yup.string().required(),
    obs: yup.string().required(),
    transportadora_id: yup.number().required(),
    fornecedora_id: yup.number().required(),
    material_id: yup.number().required(),
    user_id: yup.number().required()
});

export const EditarTransacoesEntrada = () => {

    const { id = 'new' } = useParams<'id'>();
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(false);
    const formRef = useRef<FormHandles>(null);

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
                    TransacoesEntradaService
                        .create(dadosValidados)
                        .then(result => {
                            setIsLoading(false);
                            if (result instanceof Error) {
                                alert(result.message);
                            } else {
                                navigate(`/transacoesEntrada/records/show/${result}`);
                            }
                        });
                } else {
                    TransacoesEntradaService
                        .updateById(Number(id), { id: Number(id), ...dadosValidados })
                        .then(result => {
                            setIsLoading(false);
                            if (result instanceof Error) {
                                alert(result.message);
                            } else {
                                navigate(`/transacoesEntrada/records/show/${Number(id)}`);
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

    return (
        <LayoutBaseDePagina
            mostrarBotaoVoltar
            aoClicaeEmVoltar={() => navigate('/transacoesEntrada')}
            titulo={id === 'new' ? 'Nova Transação' : 'Editar'}
            tools={
                <DetailTools
                    mostrarBotaoApagar={id !== 'new'}
                    mostrarBotaoDetalhar={id !== 'new'}
                    aoClicaeEmApagar={() => handleDelete(Number(id))}
                    aoClicaeEmDetalhar={() => navigate(`/transacoesEntrada/records/show/${id}`)}
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
                                label='Recebido em'
                                name='data_de_recebimento'
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
                                label='Valor do frete'
                                fullWidth
                                placeholder='valor do frete'
                                name='valor_frete'
                            />
                        </Grid>

                        <Grid item marginBottom={2}>
                            <VTextField
                                label='NFe'
                                fullWidth
                                placeholder='NFe'
                                name='nfe'
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
                            <AutoCompleteTransportadoras isExternalLoading={isLoading} />
                        </Grid>

                        <Grid item marginBottom={2}>
                            <AutoCompleteFornecedores isExternalLoading={isLoading} />
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