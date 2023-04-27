import { Box, Grid, LinearProgress, Paper } from '@mui/material';
import { FormHandles } from '@unform/core';
import { Form } from '@unform/web';
import {XMLParser} from 'fast-xml-parser';
import { useEffect, useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import * as yup from 'yup';
import { AutoCompleteFornecedores, AutoCompleteMateriais, AutoCompleteTransportadoras, DetailTools } from '../../shared/components';
import { IVFormErros, VDatePicker, VTextField } from '../../shared/forms';
import { LayoutBaseDePagina } from '../../shared/layouts';
import { ITransacoesEntradaFormData, TransacoesEntradaService } from '../../shared/services/api/transacoesEntrada/TransacoesEntradaService';



const formValidationSchema: yup.ObjectSchema<Omit<ITransacoesEntradaFormData, 'id'>> = yup.object().shape({
    nfe: yup.string().required(),
    data_de_emissao: yup.string().required(),
    data_de_recebimento: yup.string().required(),
    valor_total: yup.number().required(),
    valor_frete: yup.number().required(),
    valor_ipi_total: yup.number().required(),
    obs: yup.string().required(),
    transportadora_id: yup.number().required(),
    fornecedora_id: yup.number().required(),
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
                        navigate('/transacoes_entrada');
                    } else {
                        formRef.current?.setData(result);
                        console.log('@@@@@@@Result@@@@@@');
                        console.log(result);
                    }
                });
        }
    }, [id]);


    const handleSave = (dados: Omit<ITransacoesEntradaFormData, 'id'>) => {
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
                                navigate(`/transacoes_entrada/records/show/${result}`);
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
                                navigate(`/transacoes_entrada/records/show/${Number(id)}`);
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
                        navigate('/transacoes_entrada');
                    }
                });
        }
    };
    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        const parser = new XMLParser();
        const reader = new FileReader();
        reader.onload = () => {
            const xmlString = reader.result?.toString() ?? '';
            const jsonObj = parser.parse(xmlString);
            console.log(jsonObj.nfeProc);
        };
        reader.readAsText(file);
    };

    return (
        <LayoutBaseDePagina
            mostrarBotaoVoltar
            aoClicaeEmVoltar={() => navigate('/transacoes_entrada')}
            titulo={id === 'new' ? 'Nova Transação' : 'Editar'}
            tools={
                <DetailTools
                    mostrarBotaoApagar={id !== 'new'}
                    mostrarBotaoDetalhar={id !== 'new'}
                    mostrarBotaoImportarXML={id === 'new'}
                    aoClicaeEmApagar={() => handleDelete(Number(id))}
                    aoClicaeEmDetalhar={() => navigate(`/transacoes_entrada/records/show/${id}`)}
                    aoAlternarArquivo={handleFileChange}
                />
            }
        >
            <Form ref={formRef} onSubmit={dados => handleSave(dados)}>
                <Box component={Paper} display='flex' flexDirection='column' variant='outlined' margin={1} alignItems='center' justifyContent='center'>
                    <Grid container spacing={2} padding={4}>
                        {isLoading && (
                            <Grid item>
                                <LinearProgress variant='indeterminate' />
                            </Grid>
                        )}

                        <Grid item xs={6} >
                            <VTextField
                                label='NFe'
                                fullWidth
                                placeholder='NFe'
                                name='nfe'
                            />
                        </Grid>

                        <Grid item xs={6}>
                            <VDatePicker
                                label='Recebido em'
                                name='data_de_recebimento'
                            />
                        </Grid>

                        <Grid item xs={4}>
                            <VTextField
                                label='Valor do frete'
                                fullWidth
                                placeholder='valor do frete'
                                name='valor_frete'
                            />
                        </Grid>

                        <Grid item xs={4}>
                            <AutoCompleteTransportadoras isExternalLoading={isLoading} />
                        </Grid>

                        <Grid item xs={4}>
                            <AutoCompleteFornecedores isExternalLoading={isLoading} />
                        </Grid>

                        <Grid item xs={2}>
                            <VTextField
                                label='Quantidade'
                                fullWidth
                                placeholder='quantidade'
                                name='qtd'
                            />
                        </Grid>

                        <Grid item xs={2}>
                            <VTextField
                                label='Valor do item'
                                fullWidth
                                placeholder='valor do item'
                                name='valor'
                            />
                        </Grid>

                        <Grid item xs={2}>
                            <AutoCompleteMateriais isExternalLoading={isLoading} />
                        </Grid>

                        <Grid item xs={6}>
                            <VTextField
                                label='Observações'
                                fullWidth
                                placeholder='observações'
                                name='obs'
                            />
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