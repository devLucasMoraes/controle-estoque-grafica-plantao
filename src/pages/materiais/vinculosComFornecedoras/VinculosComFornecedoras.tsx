import { Checkbox, Grid, InputAdornment, MenuItem, TextField, Typography } from '@mui/material';
import { useEffect, useRef, useState } from 'react';
import * as yup from 'yup';
import { AutoCompeteForwardRef, IAutoCompleteForwardRef, ItensListTools } from '../../../shared/components';
import { IUFormErros, UAutoComplete, UId, UTextField } from '../../../shared/forms';
import { FornecedorasService } from '../../../shared/services/api/fornecedoras/FornecedorasService';
import { Scope } from '@unform/core';
import { IConversoesDeCompra, IFornecedorasVinculadas } from '../../../shared/services/api/materiais/MateriaisService';
import { undDeMedidas } from '../../../shared/data/undDeMedidas';



interface IVinculosComFornecedorasProps {
    initialValues: Array<IFornecedorasVinculadas>
}

const ConversaoDeCompraSchema: yup.ObjectSchema<IConversoesDeCompra> = yup.object().shape({
    id: yup.number().required(),
    undCompra: yup.string().required(),
    undPadrao: yup.string().required(),
    fatorDeConversao: yup.number().required(),
    idFornecedorasVinculadas: yup.number().required(),
});

const VinculoSchema: yup.ObjectSchema<IFornecedorasVinculadas> = yup.object().shape({
    id: yup.number().required(),
    idFornecedora: yup.number().required(),
    codProd: yup.string().required(),
    conversoesDeCompra: new yup.ArraySchema(ConversaoDeCompraSchema).required(),
});

export const VinculosComFornecedoras = ({ initialValues }: IVinculosComFornecedorasProps) => {


    const idFornecedoraRef = useRef<IAutoCompleteForwardRef>(null);
    const codProdRef = useRef<HTMLInputElement>(null);

    const [fornecedorasVinculadas, setFornecedorasVinculadas] = useState<Array<IFornecedorasVinculadas>>(initialValues);
    const [conversoesDeCompra, setconversoesDeCompra] = useState<Array<IConversoesDeCompra>>([
        {
            id: Math.random() - 1,
            undCompra: 'string',
            undPadrao: 'string',
            fatorDeConversao: 1,
            idFornecedorasVinculadas: 1
        }
    ]);
    const [erros, setErros] = useState<IUFormErros>({});
    const [checked, setChecked] = useState(false);

    useEffect(() => {
        console.log('renderizou setFornecedorasVinculadas useEffect VinculosComFornecedoras');
        setFornecedorasVinculadas(initialValues);
    }, [initialValues]);

    function handleAdicionar(): void {
        const novoVinculo = {
            id: Math.random() - 1,
            idFornecedora: idFornecedoraRef.current?.selectedId,
            codProd: codProdRef.current?.value,
            conversoesDeCompra: conversoesDeCompra
        };
        ConversaoDeCompraSchema
            .validate(novoVinculo, { abortEarly: false })
            .then(itemValidado => {
                setFornecedorasVinculadas(oldItens => [...oldItens, itemValidado]);

                if (codProdRef.current) {
                    codProdRef.current.value = '';
                }

                if (idFornecedoraRef.current) {
                    idFornecedoraRef.current.setSelectedIdUndefined();
                }
            })
            .catch((erros: yup.ValidationError) => {
                const validationErrors: IUFormErros = {};
                erros.inner.forEach(error => {
                    if (!error.path) return;
                    validationErrors[error.path] = error.message;
                });
                setErros(validationErrors);
                idFornecedoraRef.current?.setComponentErrors(validationErrors['idFornecedora']);
                console.log(validationErrors);
            });
        console.log(novoVinculo);
    }

    function handleInputFocus(ref: string): void {
        if (erros[ref]) {
            setErros((errosAntigos) => ({
                ...errosAntigos,
                [ref]: '',
            }));

        }
    }

    function handleRemover(id?: number): void {
        setFornecedorasVinculadas(fornecedorasVinculadas.filter(item => item.id !== id));
    }

    const handleChangeCheckBox = (event: React.ChangeEvent<HTMLInputElement>) => {
        setChecked(event.target.checked);
    };

    function handleAdicionarConversao(): void {
        const novaConversao = {
            id: Math.random() - 1,
            undCompra: yup.string().required(),
            undPadrao: yup.string().required(),
            fatorDeConversao: yup.number().required(),
            idFornecedorasVinculadas: yup.number().required(),
        };
        VinculoSchema
            .validate(novaConversao, { abortEarly: false })
            .then(itemValidado => {
                setconversoesDeCompra(oldItens => [...oldItens, itemValidado]);

                if (codProdRef.current) {
                    codProdRef.current.value = '';
                }

                if (idFornecedoraRef.current) {
                    idFornecedoraRef.current.setSelectedIdUndefined();
                }
            })
            .catch((erros: yup.ValidationError) => {
                const validationErrors: IUFormErros = {};
                erros.inner.forEach(error => {
                    if (!error.path) return;
                    validationErrors[error.path] = error.message;
                });
                setErros(validationErrors);
                idFornecedoraRef.current?.setComponentErrors(validationErrors['idFornecedora']);
                console.log(validationErrors);
            });
        console.log(novaConversao);
    }

    return (
        <Grid container spacing={2} alignItems={'center'}>

            <Grid item xs={6}>
                <AutoCompeteForwardRef
                    ref={idFornecedoraRef}
                    error={erros['idFornecedora']}
                    label='Fornecedora'
                    service={FornecedorasService}
                    optionLabel='nomeFantasia'
                />
            </Grid>

            <Grid item xs={5}>
                <TextField
                    label='Código Produto'
                    fullWidth
                    placeholder='código do produto'
                    inputRef={codProdRef}
                    helperText={erros['codProd']}
                    error={!!erros['codProd']}
                    onFocus={() => handleInputFocus('codProd')}
                    size='small'
                />
            </Grid>

            <Grid item xs={1}>
                <ItensListTools
                    mostrarBotaoAdicionar
                    aoClicarEmAdicionar={() => handleAdicionar()}
                />
            </Grid>

            <Grid item xs={11} display='flex' alignItems='center' gap={1}>
                <Checkbox
                    checked={checked}
                    onChange={handleChangeCheckBox}
                />
                <Typography>Possui conversao na compra?</Typography>
                {checked && conversoesDeCompra.map((item, index) => (
                    <Grid key={index} container spacing={2} alignItems={'center'}>
                        <Grid item xs={5}>
                            <TextField
                                label='Unidade de Compra'
                                fullWidth
                                placeholder='unidade de compra'
                                name='undPadrao'
                                select 
                                size='small'
                            >
                                {undDeMedidas.map((option) => (
                                    <MenuItem key={option.value} value={option.value}>
                                        {option.label}
                                    </MenuItem>
                                ))}
                            </TextField>
                        </Grid>
                        <Grid item xs={5}>
                            <TextField
                                label='Fator de Conversão'
                                fullWidth
                                placeholder='fator de comversão'
                                name='undPadrao'
                                size='small'
                                InputProps={{
                                    endAdornment: <InputAdornment position="end">LT</InputAdornment>,
                                }}
                            />
                        </Grid>
                        <Grid item xs={1}>
                            <ItensListTools
                                mostrarBotaoAdicionar
                                aoClicarEmAdicionar={() => handleAdicionarConversao()}
                            />
                        </Grid>
                    </Grid>
                ))}
            </Grid>




            {fornecedorasVinculadas.map((item, index) => (
                <Scope key={item.id} path={`fornecedorasVinculadas[${index}]`} >
                    <UId
                        name='id'
                        initialValue={item.id}
                    />

                    <Grid item xs={6}>
                        <UAutoComplete
                            name='idFornecedora'
                            service={FornecedorasService}
                            label='Fornecedora'
                            optionLabel='nomeFantasia'
                            initialSelectedIdValue={item.idFornecedora}
                        />
                    </Grid>

                    <Grid item xs={5}>
                        <UTextField
                            fullWidth
                            label='Código Produto'
                            placeholder='código do produto'
                            name='codProd'
                            initialValue={item.codProd}
                        />
                    </Grid>

                    {conversoesDeCompra.map((item, index) => (
                        <Scope key={item.id} path={`conversoesDeCompra[${index}]`}>
                            <Grid item xs={5}>
                                <UTextField
                                    fullWidth
                                    label='Embalagem'
                                    placeholder='embalagem'
                                    name='undCompra'
                                    initialValue={item.undCompra}
                                />
                            </Grid>
                        </Scope>
                    ))}

                    <Grid item xs={1}>
                        <ItensListTools
                            mostrarBotaoRemover
                            aoClicarEmRemover={() => handleRemover(item.id)}
                        />
                    </Grid>
                </Scope>
            ))}

        </Grid>
    );
};