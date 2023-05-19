import { Grid, TextField } from '@mui/material';
import { useEffect, useRef, useState } from 'react';
import { IItemTransacaoEntrada } from '../../services/api/transacoesEntrada/TransacoesEntradaService';
import { Scope } from '@unform/core';
import { IUFormErros, UAutoCompleteMaterial, UId, UTextField } from '../../forms';
import { ItensListTools } from '../itensListTools/ItensListTools';
import { AutoCompleteMateriais, AutoCompleteMateriaisSelectedId } from '../autoCompleteMateriais/AutoCompleteMateriais';
import * as yup from 'yup';



interface IItensTransacaoEntradaProps {
    isLoading: boolean;
    initialItens: Array<IItemTransacaoEntrada>;
}

interface novoItem {
    id?: number;
    materiais_id?: number;
    obs?: string;
    quant_com?: number;
    und_com?: string;
    valor_ipi?: number;
    valor_unt_com?: number;
}

const itemSchema: yup.ObjectSchema<IItemTransacaoEntrada> = yup.object().shape({
    id: yup.number().required(),
    materiais_id: yup.number().required(),
    und_com: yup.string().required(),
    quant_com: yup.number().required(),
    valor_unt_com: yup.number().required(),
    valor_ipi: yup.number().required(),
    obs: yup.string(),
});

export const ItensTransacaoEntrada = ({ isLoading, initialItens }: IItensTransacaoEntradaProps) => {
    console.log('renderizou ItensTransacaoEntrada');

    const [itens, setItens] = useState<Array<IItemTransacaoEntrada>>(initialItens);
    const [erros, setErros] = useState<IUFormErros>({});
    const obsRef = useRef<HTMLInputElement>(null);
    const idMaterialRef = useRef<AutoCompleteMateriaisSelectedId>(null);
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
        const novoItem: novoItem = {
            id: Math.random(),
            materiais_id: idMaterialRef.current?.selectedId,
            obs: obsRef.current?.value,
            quant_com: Number(quantComRef.current?.value == '' ? 'undefined' : quantComRef.current?.value),
            und_com: undComRef.current?.value,
            valor_ipi: Number(valorIpiRef.current?.value == '' ? 'undefined' : valorIpiRef.current?.value),
            valor_unt_com: Number(valorUntComRef.current?.value == '' ? 'undefined' : valorUntComRef.current?.value)
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
                idMaterialRef.current?.setErrosMateriais(validationErrors['materiais_id']);
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
                    helperText={erros['quant_com']}
                    error={!!erros['quant_com']}
                    onFocus={() => handleInputFocus('quant_com')}
                />
            </Grid>

            <Grid item xs={2}>
                <TextField
                    label='Unidade de compra'
                    fullWidth
                    placeholder='unidade de compra'
                    inputRef={undComRef}
                    helperText={erros['und_com']}
                    error={!!erros['und_com']}
                    onFocus={() => handleInputFocus('und_com')}

                />
            </Grid>

            <Grid item xs={2}>
                <TextField
                    label='Valor unitário'
                    fullWidth
                    placeholder='valor unitário'
                    inputRef={valorUntComRef}
                    helperText={erros['valor_unt_com']}
                    error={!!erros['valor_unt_com']}
                    onFocus={() => handleInputFocus('valor_unt_com')}

                />
            </Grid>

            <Grid item xs={1}>
                <TextField
                    label='IPI'
                    fullWidth
                    placeholder='IPI'
                    inputRef={valorIpiRef}
                    helperText={erros['valor_ipi']}
                    error={!!erros['valor_ipi']}
                    onFocus={() => handleInputFocus('valor_ipi')}

                />
            </Grid>

            <Grid item xs={2}>
                <AutoCompleteMateriais
                    isExternalLoading={isLoading}
                    ref={idMaterialRef}
                    error={erros['materiais_id']}
                />
            </Grid>

            <Grid item xs={2}>
                <TextField
                    label='Observações'
                    fullWidth
                    placeholder='observações'
                    inputRef={obsRef}
                    helperText={erros['obs']}
                    error={!!erros['obs']}
                    onFocus={() => handleInputFocus('obs')}

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
                            name='quant_com'
                            initialValue={item.quant_com}
                        />
                    </Grid>

                    <Grid item xs={2}>
                        <UTextField
                            label='Unidade de compra'
                            fullWidth
                            placeholder='unidade de compra'
                            name='und_com'
                            initialValue={item.und_com}

                        />
                    </Grid>

                    <Grid item xs={2}>
                        <UTextField
                            label='Valor unitário'
                            fullWidth
                            placeholder='valor unitário'
                            name='valor_unt_com'
                            initialValue={item.valor_unt_com}
                        />
                    </Grid>

                    <Grid item xs={1}>
                        <UTextField
                            label='IPI'
                            fullWidth
                            placeholder='IPI'
                            name='valor_ipi'
                            initialValue={item.valor_ipi}
                        />
                    </Grid>

                    <Grid item xs={2}>
                        <UAutoCompleteMaterial
                            isExternalLoading={isLoading}
                            initialSelectedIdValue={item.materiais_id}
                            name='materiais_id'
                        />
                    </Grid>

                    <Grid item xs={2}>
                        <UTextField
                            label='Observações'
                            fullWidth
                            placeholder='observações'
                            name='obs'
                            initialValue={item.obs}

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