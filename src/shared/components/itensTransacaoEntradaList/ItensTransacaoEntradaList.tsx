import { Grid, TextField } from '@mui/material';
import { useEffect, useRef, useState } from 'react';
import { IItemTransacaoEntrada } from '../../services/api/transacoesEntrada/TransacoesEntradaService';
import { Scope } from '@unform/core';
import { VAutoCompleteMateriais, VId, VTextField } from '../../forms';
import { ItensListTools } from '../itensListTools/ItensListTools';
import { AutoCompleteMateriais } from '../autoCompleteMateriais/AutoCompleteMateriais';


interface IItensTransacaoEntradaProps {
    isLoading: boolean;
    initialItens: Array<IItemTransacaoEntrada>;
}

export const ItensTransacaoEntrada = ({ isLoading, initialItens }: IItensTransacaoEntradaProps) => {
    console.log('renderizou ItensTransacaoEntrada');

    const [itens, setItens] = useState<Array<IItemTransacaoEntrada>>(initialItens);
    const obsRef = useRef<HTMLInputElement>(null);
    const idMaterialRef = useRef<HTMLInputElement>(null);
    const valorIpiRef = useRef<HTMLInputElement>(null);
    const valorUntComRef = useRef<HTMLInputElement>(null);
    const undComRef = useRef<HTMLInputElement>(null);
    const quantComRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        console.log('renderizou useEffect ItensTransacaoEntrada');
        setItens(initialItens);
    }, [initialItens]);

    const handleRemover = (id: number): void => {
        setItens(itens.filter(item => item.id !== id));
    };

    const handleAdicionar = (): void => {
        if (
            obsRef.current?.value !== undefined &&
            idMaterialRef.current?.value !== undefined &&
            quantComRef.current?.value !== undefined &&
            undComRef.current?.value !== undefined &&
            undComRef.current?.value !== undefined &&
            valorIpiRef.current?.value !== undefined
        ) {
            const novoItem: IItemTransacaoEntrada = {
                id: itens.length + 1,
                materiais_id: Number(idMaterialRef.current?.value),
                obs: obsRef.current?.value,
                quant_com: Number(quantComRef.current?.value),
                und_com: undComRef.current?.value,
                valor_ipi: Number(valorIpiRef.current?.value),
                valor_unt_com: Number(valorUntComRef.current?.value)
            };
            setItens([...itens, novoItem]);
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
                />
            </Grid>

            <Grid item xs={2}>
                <TextField
                    label='Unidade de compra'
                    fullWidth
                    placeholder='unidade de compra'
                    inputRef={undComRef}
                />
            </Grid>

            <Grid item xs={2}>
                <TextField
                    label='Valor unitário'
                    fullWidth
                    placeholder='valor unitário'
                    inputRef={valorUntComRef}
                />
            </Grid>

            <Grid item xs={1}>
                <TextField
                    label='IPI'
                    fullWidth
                    placeholder='IPI'
                    inputRef={valorIpiRef}
                />
            </Grid>

            <Grid item xs={2}>
                <AutoCompleteMateriais
                    isExternalLoading={isLoading}
                    inputRef={idMaterialRef}
                />
            </Grid>

            <Grid item xs={2}>
                <TextField
                    label='Observações'
                    fullWidth
                    placeholder='observações'
                    inputRef={obsRef}
                />
            </Grid>

            <Grid item xs={1}>
                <ItensListTools
                    mostrarBotaoAdicionar
                    aoClicarEmAdicionar={() => handleAdicionar()}
                />
            </Grid>

            {itens.map((item) => (
                <Scope key={item.id} path={`itens[${item.id}]`} >

                    <VId
                        name='id'
                        initialValue={item.id}
                    />


                    <Grid item xs={2}>
                        <VTextField
                            label='Quantidade'
                            fullWidth
                            placeholder='quantidade'
                            name='quant_com'
                            initialValue={item.quant_com}
                        />
                    </Grid>

                    <Grid item xs={2}>
                        <VTextField
                            label='Unidade de compra'
                            fullWidth
                            placeholder='unidade de compra'
                            name='und_com'
                            initialValue={item.und_com}

                        />
                    </Grid>

                    <Grid item xs={2}>
                        <VTextField
                            label='Valor unitário'
                            fullWidth
                            placeholder='valor unitário'
                            name='valor_unt_com'
                            initialValue={item.valor_unt_com}
                        />
                    </Grid>

                    <Grid item xs={1}>
                        <VTextField
                            label='IPI'
                            fullWidth
                            placeholder='IPI'
                            name='valor_ipi'
                            initialValue={item.valor_ipi}
                        />
                    </Grid>

                    <Grid item xs={2}>
                        <VAutoCompleteMateriais
                            isExternalLoading={isLoading}
                            initialSelectedIdValue={item.materiais_id}
                            name='materiais_id'
                        />
                    </Grid>

                    <Grid item xs={2}>
                        <VTextField
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