import { Box, Chip, Divider, Grid, LinearProgress, Paper } from '@mui/material';
import { FormHandles } from '@unform/core';
import { Form } from '@unform/web';
import { useEffect, useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import * as yup from 'yup';
import { IVFormErros, VAutoCompleteFornecedores, VAutoCompleteTransportadoras, VDatePicker, VTextField } from '../../shared/forms';
import { LayoutBaseDePagina } from '../../shared/layouts';
import { IItemTransacaoEntrada, ITransacoesEntradaFormData, TransacoesEntradaService } from '../../shared/services/api/transacoesEntrada/TransacoesEntradaService';
import { DetailTools, ItensTransacaoEntrada, NovaFornecedoraDialog, NovaTransportadoraDialog } from '../../shared/components';
import { TransportadorasService } from '../../shared/services/api/transportadoras/TransportadorasService';
import { FornecedorasService } from '../../shared/services/api/fornecedoras/FornecedorasService';
import { useFileHandler } from '../../shared/hooks/useFileHandler';

const itemSchema: yup.ObjectSchema<Omit<IItemTransacaoEntrada, 'id'>> = yup.object().shape({
    materiais_id: yup.number().required(),
    und_com: yup.string().required(),
    quant_com: yup.number().required(),
    valor_unt_com: yup.number().required(),
    valor_ipi: yup.number().required(),
    obs: yup.string(),
});

const formValidationSchema: yup.ObjectSchema<Omit<ITransacoesEntradaFormData, 'id'>> = yup.object().shape({
    nfe: yup.string().required(),
    data_emissao: yup.string().required(),
    data_recebimento: yup.string().required(),
    valor_total: yup.number().required(),
    valor_frete: yup.number().required(),
    valor_ipi_total: yup.number().required(),
    obs: yup.string(),
    transportadora_id: yup.number().required(),
    fornecedora_id: yup.number().required(),
    itens: new yup.ArraySchema(itemSchema).required()
});

export const EditarTransacoesEntrada = () => {
    console.log('renderizou EditarTransacoesEntrada');

    const { id = 'new' } = useParams<'id'>();
    const navigate = useNavigate();
    const formRef = useRef<FormHandles>(null);

    const [initialItens, setInitialItens] = useState<Array<IItemTransacaoEntrada>>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [showNovaFornecedoraDialog, setShowNovaFornecedoraDialog] = useState(false);
    const [showNovaTransportadoraDialog, setShowNovaTransportadoraDialog] = useState(false);

    const getTransportadoraNfeId = async (cnpj: string): Promise<number | undefined> => {
        try {
            const result = await TransportadorasService.getByCNPJ(cnpj);
            console.log(cnpj);
            if (result instanceof Error) {
                setShowNovaTransportadoraDialog(true);
            } else {
                return result.id;
            }
        } catch (error) {
            alert('Aconteceu um erro desconhecido');
            throw error;
        }
    };

    const getFornecedoraNfeId = async (cnpj: string): Promise<number | undefined> => {
        try {
            const result = await FornecedorasService.getByCNPJ(cnpj);
            console.log(cnpj);
            if (result instanceof Error) {
                setShowNovaFornecedoraDialog(true);
            } else {
                return result.id;
            }
        } catch (error) {
            alert('Aconteceu um erro desconhecido');
            throw error;
        }
    };

    const { fileData, handleFileChange, fornecedoraFileData, transportadoraFileData } = useFileHandler(getFornecedoraNfeId, getTransportadoraNfeId);

    useEffect(() => {
        console.log('renderizou useEffect EditarTransacoesEntrada');
        if (id !== 'new') {
            setIsLoading(true);
            TransacoesEntradaService.getById(Number(id))
                .then(result => {
                    setIsLoading(false);
                    if (result instanceof Error) {
                        alert(result.message);
                        navigate('/transacoes_entrada');
                    } else {
                        console.log(result);
                        formRef.current?.setData(result);
                        setInitialItens(result.itens);
                    }
                });
        }
        if (id === 'new' && fileData) {
            formRef.current?.setData(fileData);
            setInitialItens(fileData.itens);
        }
    }, [id, fileData]);

    const handleSave = (dados: Omit<ITransacoesEntradaFormData, 'id'>) => {
        console.log(dados);
        formValidationSchema
            .validate(dados, { abortEarly: false })
            .then(dadosValidados => {
                console.log(dadosValidados);
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


    function handleAoFecharOuSalvar(fieldName: string, id: number | undefined): void {
        fieldName === 'fornecedora_id' ? setShowNovaFornecedoraDialog(false) : '';
        fieldName === 'transportadora_id' ? setShowNovaTransportadoraDialog(false) : '';
        formRef.current?.setFieldValue(fieldName, id);
    }

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
                    {showNovaFornecedoraDialog && (
                        <NovaFornecedoraDialog 
                            initialFornecedoraFileData={fornecedoraFileData} aoFecharOuSalvar={(fieldName, id) => handleAoFecharOuSalvar(fieldName, id)} />
                    )}
                    {showNovaTransportadoraDialog && (
                        <NovaTransportadoraDialog initialTransportadoraFileData={transportadoraFileData} aoFecharOuSalvar={(fieldName, id) => handleAoFecharOuSalvar(fieldName, id)} />
                    )}
                    <Grid container padding={4} rowGap={2}>
                        {isLoading && (
                            <Grid item>
                                <LinearProgress variant='indeterminate' />
                            </Grid>
                        )}

                        <Grid container justifyContent="space-between" spacing={2}>
                            <Grid item xs={12} lg={6}>
                                <VTextField
                                    label='NFe'
                                    fullWidth
                                    placeholder='NFe'
                                    name='nfe'
                                />
                            </Grid>

                            <Grid item xs={12} lg={2}>
                                <VDatePicker
                                    label='Data de emissao da nota'
                                    name='data_emissao'
                                />
                            </Grid>
                            <Grid item xs={12} lg={2}>
                                <VDatePicker
                                    label='Recebido em'
                                    name='data_recebimento'
                                />
                            </Grid>
                        </Grid>

                        <Grid container columnSpacing={2} spacing={2}>

                            <Grid item xs={12} lg={2}>
                                <VTextField
                                    label='Valor total IPI'
                                    fullWidth
                                    placeholder='valor total IPI'
                                    name='valor_ipi_total'
                                />
                            </Grid>

                            <Grid item xs={12} lg={2}>
                                <VTextField
                                    label='Valor total da nota'
                                    fullWidth
                                    placeholder='valor total da nota'
                                    name='valor_total'
                                />
                            </Grid>

                            <Grid item xs={12} lg={3}>
                                <VAutoCompleteFornecedores isExternalLoading={isLoading} />
                            </Grid>

                            <Grid item xs={12} lg={2}>
                                <VTextField
                                    label='Valor do frete'
                                    fullWidth
                                    placeholder='valor do frete'
                                    name='valor_frete'
                                />
                            </Grid>

                            <Grid item xs={12} lg={3}>
                                <VAutoCompleteTransportadoras isExternalLoading={isLoading} />
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

                        <Grid item flexGrow={1}>
                            <Divider textAlign="left">
                                <Chip label="ITENS" />
                            </Divider>
                        </Grid>

                        <ItensTransacaoEntrada
                            isLoading={isLoading}
                            initialItens={initialItens}
                        />

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