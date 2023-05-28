import { Grid } from '@mui/material';
import { useEffect, useState } from 'react';
import { IItemTransacaoEntrada } from '../../services/api/transacoesEntrada/TransacoesEntradaService';
import { Scope } from '@unform/core';
import { IUFormErros, UAutoComplete, UId, UTextField } from '../../forms';
import { ItensListTools } from '../itensListTools/ItensListTools';
import * as yup from 'yup';
import { MateriaisService } from '../../services/api/materiais/MateriaisService';

export interface NfeItem extends IItemTransacaoEntrada {
    xProd: string;
    qtdeEstoque: number;
}

interface INfeItensTransacaoEntradaProps {
    isLoading: boolean;
    initialItens: Array<IItemTransacaoEntrada>;
}


export const NfeItensTransacaoEntrada = ({ isLoading, initialItens }: INfeItensTransacaoEntradaProps) => {
    console.log('renderizou NfeItensTransacaoEntrada');

    const [itens, setItens] = useState(initialItens);
    const [erros, setErros] = useState<IUFormErros>({});

    useEffect(() => {
        console.log('renderizou setItens useEffect NfeItensTransacaoEntrada');
        console.log(initialItens);
        setItens(initialItens);
    }, [initialItens]);

    const handleRemover = (id: number): void => {
        setItens(itens.filter(item => item.id !== id));
    };

    const handleAdicionar = (): void => {
        console.log('handleAdicionar');
    };

    return (
        <Grid container spacing={2} alignItems={'center'}>
            {itens.map((item, index) => (
                <Scope key={item.id} path={`itens[${index}]`} >

                    <UId
                        name='id'
                        initialValue={item.id}
                    />

                    <Grid item xs={2}>
                        <UTextField
                            label='Material NF'
                            fullWidth
                            placeholder='material NF'
                            name='xProd'
                            initialValue={item.xProd}
                            disabled
                        />
                    </Grid>

                    <Grid item xs={2}>
                        <UTextField
                            label='Qtde NF'
                            fullWidth
                            placeholder='quantidade na nota Fiscal'
                            name='quantCom'
                            initialValue={item.quantCom}
                            endAdornment={item.undCom}
                            disabled
                        />
                    </Grid>

                    <Grid item xs={2}>
                        <UTextField
                            label='Valor unitário NF'
                            fullWidth
                            placeholder='valor unitário'
                            name='valorUntCom'
                            initialValue={item.valorUntCom}
                            disabled
                        />
                    </Grid>

                    <Grid item xs={1}>
                        <UTextField
                            label='IPI'
                            fullWidth
                            placeholder='IPI'
                            name='valorIpi'
                            initialValue={item.valorIpi}
                            disabled
                        />
                    </Grid>

                    <Grid item xs={2}>
                        <UTextField
                            label='Qtde Estoque'
                            fullWidth
                            placeholder='quantidade no estoque'
                            name='quantEstoque'
                        />
                    </Grid>

                    <Grid item xs={2}>
                        <UAutoComplete
                            isExternalLoading={isLoading}
                            initialSelectedIdValue={item.idMaterial}
                            name='idMaterial'
                            service={MateriaisService}
                            label='Produtos / Insumos'
                            optionLabel='descricao'
                        />
                    </Grid>

                    <Grid item xs={1}>
                        <ItensListTools
                            mostrarBotaoVincular={!item.idMaterial}
                            aoClicarEmRemover={() => handleRemover(item.id)}
                        />
                    </Grid>

                </Scope>
            ))}

        </Grid>

    );
};