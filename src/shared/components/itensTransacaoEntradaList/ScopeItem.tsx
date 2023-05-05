import { Grid } from '@mui/material';
import { Scope } from '@unform/core';
import { VTextField } from '../../forms';
import { VAutoCompleteMateriais } from '../../forms/virtualAutoCompletions/VAutoCompleteMateriais';
import { ItensListTools } from '../itensListTools/ItensListTools';
import { IItemOfScope } from './ItensTransacaoEntradaList';

interface ScopeItemProps {
    index: number;
    isLoading: boolean;
    aoRemover: (id: number) => void;
    aoAdicionar: (item: IItemOfScope) => void;
    mostrarBotaoAdicionar: boolean;
    mostrarBotaoRemover: boolean;
}

export const ScopeItem = ({ index, isLoading, mostrarBotaoAdicionar, mostrarBotaoRemover }: ScopeItemProps) => {

    const item: IItemOfScope = {
        id: 0,
        materiais_id: 0,
        obs: '',
        quant_com: 0,
        und_com: '',
        valor_ipi: 0,
        valor_unt_com: 0,
        mostrarBotaoAdicionar: true,
        mostrarBotaoRemover: false
    };


    return (
        <Scope key={index} path={`itens[${index}]`}>
            <Grid item xs={2}>
                <VTextField
                    label='Quantidade'
                    fullWidth
                    placeholder='quantidade'
                    name='quant_com'
                />
            </Grid>

            <Grid item xs={2}>
                <VTextField
                    label='Unidade de compra'
                    fullWidth
                    placeholder='unidade de compra'
                    name='und_com'
                />
            </Grid>

            <Grid item xs={2}>
                <VTextField
                    label='Valor unitário'
                    fullWidth
                    placeholder='valor unitário'
                    name='valor_unt_com'
                />
            </Grid>

            <Grid item xs={1}>
                <VTextField
                    label='IPI'
                    fullWidth
                    placeholder='IPI'
                    name='valor_ipi'
                />
            </Grid>

            <Grid item xs={2}>
                <VAutoCompleteMateriais
                    isExternalLoading={isLoading}
                    name='materiais_id'
                />
            </Grid>

            <Grid item xs={2}>
                <VTextField
                    label='Observações'
                    fullWidth
                    placeholder='observações'
                    name='obs'
                />
            </Grid>

            <Grid item xs={1}>
                <ItensListTools
                    mostrarBotaoAdicionar={mostrarBotaoAdicionar}
                    mostrarBotaoRemover={mostrarBotaoRemover}
                
                />
            </Grid>

        </Scope>
    );
};