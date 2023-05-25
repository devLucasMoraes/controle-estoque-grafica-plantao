import { Grid, TextField } from '@mui/material';
import { Scope } from '@unform/core';
import { useEffect, useRef, useState } from 'react';
import * as yup from 'yup';
import { IItemTransacaoEntrada } from '../../services/api/transacoesEntrada/TransacoesEntradaService';
import { IUFormErros, UAutoComplete, UId, UTextField } from '../../forms';
import { ItensListTools } from '../itensListTools/ItensListTools';
import { AutoCompeteForwardRef, IAutoCompleteForwardRef } from '../autoCompeteForwardRef/AutoCompeteForwardRef';
import { MateriaisService } from '../../services/api/materiais/MateriaisService';



interface IItensTransacaoEntradaProps {
    isLoading: boolean;
    initialItens: Array<IItemTransacaoEntrada>;
}

const itemSchema: yup.ObjectSchema<IItemTransacaoEntrada> = yup.object().shape({
    id: yup.number().required(),
    idMaterial: yup.number().required(),
    undCom: yup.string().required(),
    quantCom: yup.number().required(),
    valorUntCom: yup.number().required(),
    valorIpi: yup.number().required(),
    obs: yup.string(),
    xProd: yup.string(),
    qtdeEstoque: yup.number()
});

export const ItensTransacaoEntrada = ({ isLoading, initialItens }: IItensTransacaoEntradaProps) => {
    console.log('renderizou ItensTransacaoEntrada');

    const [itens, setItens] = useState<Array<IItemTransacaoEntrada>>(initialItens);
    const [erros, setErros] = useState<IUFormErros>({});
    const obsRef = useRef<HTMLInputElement>(null);
    const idMaterialRef = useRef<IAutoCompleteForwardRef>(null);
    const valorIpiRef = useRef<HTMLInputElement>(null);
    const valorUntComRef = useRef<HTMLInputElement>(null);
    const undComRef = useRef<HTMLInputElement>(null);
    const quantComRef = useRef<HTMLInputElement>(null);

    const inputRefs = [
        obsRef,
        valorIpiRef,
        valorUntComRef,
        undComRef,
        quantComRef
    ];

    useEffect(() => {
        console.log('renderizou setItens useEffect ItensTransacaoEntrada');
        setItens(initialItens);
    }, [initialItens]);

    const handleRemover = (id: number): void => {
        setItens(itens.filter(item => item.id !== id));
    };

    const handleAdicionar = (): void => {
        const novoItem = {
            id: Math.random(),
            idMaterial: idMaterialRef.current?.selectedId,
            quantCom: Number(quantComRef.current?.value == '' ? 'undefined' : quantComRef.current?.value),
            undCom: undComRef.current?.value,
            valorIpi: Number(valorIpiRef.current?.value == '' ? 'undefined' : valorIpiRef.current?.value),
            valorUntCom: Number(valorUntComRef.current?.value == '' ? 'undefined' : valorUntComRef.current?.value)
        };
        console.log(novoItem);
        itemSchema
            .validate(novoItem, { abortEarly: false })
            .then(itemValidado => {
                setItens(oldItens => [...oldItens, itemValidado]);
                inputRefs.forEach((ref) => {
                    if (ref.current) {
                        ref.current.value = '';
                    }
                });
                if (idMaterialRef.current) {
                    idMaterialRef.current.setSelectedIdUndefined();
                }
            })
            .catch((erros: yup.ValidationError) => {
                const validationErrors: IUFormErros = {};
                erros.inner.forEach(error => {
                    if (!error.path) return;
                    validationErrors[error.path] = error.message;
                });
                setErros(validationErrors);
                idMaterialRef.current?.setComponentErrors(validationErrors['materiais_id']);
                console.log(validationErrors);
            });

    };

    const handleInputFocus = (ref: string) => {
        if (erros[ref]) {
            setErros((errosAntigos) => ({
                ...errosAntigos,
                [ref]: '',
            }));

        }
    };

    return (
        <Grid container spacing={2} alignItems={'center'}>
            <Grid item xs={2}>
                <TextField
                    label='Quantidade'
                    fullWidth
                    placeholder='quantidade'
                    inputRef={quantComRef}
                    helperText={erros['quantCom']}
                    error={!!erros['quantCom']}
                    onFocus={() => handleInputFocus('quantCom')}
                    size='small'
                />
            </Grid>

            <Grid item xs={2}>
                <TextField
                    label='Unidade de compra'
                    fullWidth
                    placeholder='unidade de compra'
                    inputRef={undComRef}
                    helperText={erros['undCom']}
                    error={!!erros['undCom']}
                    onFocus={() => handleInputFocus('undCom')}
                    size='small'
                />
            </Grid>

            <Grid item xs={2}>
                <TextField
                    label='Valor unitário'
                    fullWidth
                    placeholder='valor unitário'
                    inputRef={valorUntComRef}
                    helperText={erros['valorUntCom']}
                    error={!!erros['valorUntCom']}
                    onFocus={() => handleInputFocus('valorUntCom')}
                    size='small'
                />
            </Grid>

            <Grid item xs={1}>
                <TextField
                    label='IPI'
                    fullWidth
                    placeholder='IPI'
                    inputRef={valorIpiRef}
                    helperText={erros['valorIpi']}
                    error={!!erros['valorIpi']}
                    onFocus={() => handleInputFocus('valorIpi')}
                    size='small'
                />
            </Grid>

            <Grid item xs={2}>
                <AutoCompeteForwardRef
                    isExternalLoading={isLoading}
                    ref={idMaterialRef}
                    error={erros['idMaterial']}
                    service={MateriaisService}
                    label='Produtos / Insumos'
                    optionLabel='descricao'
                />
            </Grid>

            <Grid item xs={1}>
                <ItensListTools
                    mostrarBotaoAdicionar
                    aoClicarEmAdicionar={() => handleAdicionar()}
                />
            </Grid>

            {itens.map((item, index) => (
                <Scope key={item.id} path={`itens[${index}]`} >

                    <UId
                        name='id'
                        initialValue={item.id}
                    />


                    <Grid item xs={2}>
                        <UTextField
                            label='Quantidade'
                            fullWidth
                            placeholder='quantidade'
                            name='quantCom'
                            initialValue={item.quantCom}
                        />
                    </Grid>

                    <Grid item xs={2}>
                        <UTextField
                            label='Unidade de compra'
                            fullWidth
                            placeholder='unidade de compra'
                            name='undCom'
                            initialValue={item.undCom}

                        />
                    </Grid>

                    <Grid item xs={2}>
                        <UTextField
                            label='Valor unitário'
                            fullWidth
                            placeholder='valor unitário'
                            name='valorUntCom'
                            initialValue={item.valorUntCom}
                        />
                    </Grid>

                    <Grid item xs={1}>
                        <UTextField
                            label='IPI'
                            fullWidth
                            placeholder='IPI'
                            name='valorIpi'
                            initialValue={item.valorIpi}
                        />
                    </Grid>

                    <Grid item xs={2}>
                        <UAutoComplete
                            isExternalLoading={isLoading}
                            initialSelectedIdValue={item.idMaterial}
                            name='idMaterial'
                            service={MateriaisService}
                            label='Produtos/Insumos'
                            optionLabel='descricao'
                        />
                    </Grid>

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