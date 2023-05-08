import { Box, Chip, Divider, Grid, LinearProgress, Paper } from '@mui/material';
import { FormHandles } from '@unform/core';
import { Form } from '@unform/web';
import { XMLParser } from 'fast-xml-parser';
import { useEffect, useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import * as yup from 'yup';
import { IVFormErros, VAutoCompleteFornecedores, VAutoCompleteTransportadoras, VDatePicker, VTextField } from '../../shared/forms';
import { LayoutBaseDePagina } from '../../shared/layouts';
import { IItemTransacaoEntrada, ITransacoesEntradaFormData, TransacoesEntradaService } from '../../shared/services/api/transacoesEntrada/TransacoesEntradaService';
import { DetailTools, ItensTransacaoEntrada } from '../../shared/components';

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

    const [initialItens, setInitialItens] = useState<Array<IItemTransacaoEntrada>>([]);

    const { id = 'new' } = useParams<'id'>();
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(false);
    const formRef = useRef<FormHandles>(null);

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
                        formRef.current?.setData(result);
                        setInitialItens(result.itens);
                    }
                });
        }
    }, [id]);


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
    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        const parser = new XMLParser();
        const reader = new FileReader();
        reader.onload = () => {
            const xmlString = reader.result?.toString() ?? '';
            const jsonObj = parser.parse(xmlString);

            const chave = jsonObj.nfeProc.protNFe.infProt.chNFe;

            const dataEmissao = jsonObj.nfeProc.NFe.infNFe.ide.dhEmi;

            const cnpjFornecedora = jsonObj.nfeProc.NFe.infNFe.emit.CNPJ;
            const nomeFantasiafornecedora = jsonObj.nfeProc.NFe.infNFe.emit.xFant;
            const razaoSocialfornecedora = jsonObj.nfeProc.NFe.infNFe.emit.xNome;
            const fonefornecedora = jsonObj.nfeProc.NFe.infNFe.emit.enderEmit.fone;

            const modalidadeFrete = jsonObj.nfeProc.NFe.infNFe.transp.modFrete;
            const cnpjTransportadora = jsonObj.nfeProc.NFe.infNFe.transp.transporta.CNPJ;
            const razaoSocialTransportadora = jsonObj.nfeProc.NFe.infNFe.transp.transporta.xNome;


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