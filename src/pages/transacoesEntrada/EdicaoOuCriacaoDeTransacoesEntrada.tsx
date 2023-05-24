import { Box, Chip, Divider, Grid, LinearProgress, Paper } from '@mui/material';
import { FormHandles } from '@unform/core';
import { Form } from '@unform/web';
import { useEffect, useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import * as yup from 'yup';
import { IUFormErros, UAutoComplete, UDatePicker, UTextField } from '../../shared/forms';
import { LayoutBaseDaPagina } from '../../shared/layouts';
import { IItemTransacaoEntrada, ITransacoesEntradaFormData, TransacoesEntradaService } from '../../shared/services/api/transacoesEntrada/TransacoesEntradaService';
import { CrudTools, ItensTransacaoEntrada, NfeItensTransacaoEntrada, NovaFornecedoraDialog, NovaTransportadoraDialog } from '../../shared/components';
import { TransportadorasService } from '../../shared/services/api/transportadoras/TransportadorasService';
import { FornecedorasService } from '../../shared/services/api/fornecedoras/FornecedorasService';
import { useFileHandler } from '../../shared/hooks/useFileHandler';
import { MateriaisService } from '../../shared/services/api/materiais/MateriaisService';

const itemSchema: yup.ObjectSchema<Omit<IItemTransacaoEntrada, 'id'>> = yup.object().shape({
    idMaterial: yup.number().required(),
    undCom: yup.string().required(),
    quantCom: yup.number().required(),
    valorUntCom: yup.number().required(),
    valorIpi: yup.number().required(),
    obs: yup.string(),
    xProd: yup.string(),
    qtdeEstoque: yup.number(),
});

const formValidationSchema: yup.ObjectSchema<Omit<ITransacoesEntradaFormData, 'id'>> = yup.object().shape({
    nfe: yup.string().required(),
    dataEmissao: yup.string().required(),
    dataRecebimento: yup.string().required(),
    valorTotal: yup.number().required(),
    valorFrete: yup.number().required(),
    valorIpiTotal: yup.number().required(),
    obs: yup.string(),
    idTransportadora: yup.number().required(),
    idFornecedora: yup.number().required(),
    itens: new yup.ArraySchema(itemSchema).required()
});

export const EdicaoOuCriacaoDeTransacoesEntrada = () => {
    console.log('renderizou EdicaoOuCriacaoDeTransacoesEntrada');

    const { id = 'new' } = useParams<'id'>();

    const navigate = useNavigate();

    const formRef = useRef<FormHandles>(null);

    const [initialItens, setInitialItens] = useState<Array<IItemTransacaoEntrada>>([]);
    const [initialNfeItens, setInitiaNfelItens] = useState<Array<IItemTransacaoEntrada>>([]);
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

    const getMaterialNfeId = async (codProd: string): Promise<number | undefined> => {
        try {
            const result = await MateriaisService.getByCodProd(codProd);
            console.log(codProd);
            if (result instanceof Error) {
                alert(result.message);
            } else {
                return result.id;
            }
        } catch (error) {
            alert('Aconteceu um erro desconhecido');
            throw error;
        }
    };

    const { fileData, handleFileChange, fornecedoraFileData, transportadoraFileData } = useFileHandler(getFornecedoraNfeId, getTransportadoraNfeId, getMaterialNfeId);

    useEffect(() => {
        console.log('renderizou useEffect EdicaoOuCriacaoDeTransacoesEntrada');
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
                        setInitialItens(result.itens);
                        formRef.current?.setData(result);
                    }
                });
        }
        if (id === 'new' && fileData) {
            setInitiaNfelItens(fileData.itens);
            formRef.current?.setData(fileData);
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
        <LayoutBaseDaPagina
            mostrarBotaoVoltar
            aoClicaeEmVoltar={() => navigate('/transacoes_entrada')}
            titulo={id === 'new' ? 'Nova Transação' : 'Editar'}
            tools={
                <CrudTools
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
                                <UTextField
                                    label='NFe'
                                    fullWidth
                                    placeholder='NFe'
                                    name='nfe'
                                />
                            </Grid>

                            <Grid item xs={12} lg={2}>
                                <UDatePicker
                                    label='Data de emissao da nota'
                                    name='dataEmissao'
                                />
                            </Grid>

                            <Grid item xs={12} lg={2}>
                                <UDatePicker
                                    label='Recebido em'
                                    name='dataRecebimento'
                                />
                            </Grid>
                        </Grid>

                        <Grid container columnSpacing={2} spacing={2}>
                            <Grid item xs={12} lg={2}>
                                <UTextField
                                    label='Valor total IPI'
                                    fullWidth
                                    placeholder='valor total IPI'
                                    name='valorIpiTotal'
                                />
                            </Grid>

                            <Grid item xs={12} lg={2}>
                                <UTextField
                                    label='Valor total da nota'
                                    fullWidth
                                    placeholder='valor total da nota'
                                    name='valorTotal'
                                />
                            </Grid>

                            <Grid item xs={12} lg={3}>
                                <UAutoComplete
                                    isExternalLoading={isLoading}
                                    service={FornecedorasService}
                                    label='Fornecedora'
                                    name='idFornecedora'
                                    optionLabel='nomeFantasia'
                                />
                            </Grid>

                            <Grid item xs={12} lg={2}>
                                <UTextField
                                    label='Valor do frete'
                                    fullWidth
                                    placeholder='valor do frete'
                                    name='valorFrete'
                                />
                            </Grid>

                            <Grid item xs={12} lg={3}>
                                <UAutoComplete
                                    isExternalLoading={isLoading}
                                    service={TransportadorasService}
                                    label='Transportadora'
                                    name='idTransportdora'
                                    optionLabel='nomeFantasia'
                                />
                            </Grid>

                            <Grid item xs={6}>
                                <UTextField
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

                        {fileData ? 
                            (<NfeItensTransacaoEntrada
                                isLoading={isLoading}
                                initialItens={initialNfeItens}
                            />) : 
                            (<ItensTransacaoEntrada
                                isLoading={isLoading}
                                initialItens={initialItens}
                            />) 
                        }

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