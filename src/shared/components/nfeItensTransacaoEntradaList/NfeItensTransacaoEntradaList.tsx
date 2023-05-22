import { Grid } from '@mui/material';
import { useEffect, useState } from 'react';
import { IItemTransacaoEntrada } from '../../services/api/transacoesEntrada/TransacoesEntradaService';
import { Scope } from '@unform/core';
import { IUFormErros, UAutoComplete, UId, UTextField } from '../../forms';
import { ItensListTools } from '../itensListTools/ItensListTools';
import * as yup from 'yup';
import { MateriaisService } from '../../services/api/materiais/MateriaisService';



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

export const NfeItensTransacaoEntrada = ({ isLoading, initialItens }: IItensTransacaoEntradaProps) => {
    console.log('renderizou ItensTransacaoEntrada');

    const [itens, setItens] = useState(
        [
            {
                id: Math.random(),
                mat_nf: 'alcool',
                materiais_id: undefined,
                und_com: 'LT',
                quant_com: 10.00,
                valor_unt_com: 100.00,
                valor_ipi: 0.00
            },
            {
                id: Math.random(),
                mat_nf: 'beca',
                materiais_id: undefined,
                und_com: 'LT',
                quant_com: 10.00,
                valor_unt_com: 100.00,
                valor_ipi: 0.00
            }
        ]
    );
    const [erros, setErros] = useState<IUFormErros>({});



    useEffect(() => {
        console.log('renderizou setItens useEffect ItensTransacaoEntrada');
        
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
                            name='material_nf'
                            initialValue={item.mat_nf}
                            disabled
                        />
                    </Grid>

                    <Grid item xs={2}>
                        <UTextField
                            label='Qtde NF'
                            fullWidth
                            placeholder='quantidade na nota Fiscal'
                            name='quant_com'
                            initialValue={item.quant_com}
                            endAdornment={item.und_com}
                            disabled
                        />
                    </Grid>

                    <Grid item xs={2}>
                        <UTextField
                            label='Valor unitário NF'
                            fullWidth
                            placeholder='valor unitário'
                            name='valor_unt_com'
                            initialValue={item.valor_unt_com}
                            disabled
                        />
                    </Grid>

                    <Grid item xs={1}>
                        <UTextField
                            label='IPI'
                            fullWidth
                            placeholder='IPI'
                            name='valor_ipi'
                            initialValue={item.valor_ipi}
                            disabled
                        />
                    </Grid>

                    <Grid item xs={2}>
                        <UTextField
                            label='Qtde Estoque'
                            fullWidth
                            placeholder='quantidade no estoque'
                            name='quant_com'

                        />
                    </Grid>

                    <Grid item xs={2}>
                        <UAutoComplete
                            isExternalLoading={isLoading}
                            initialSelectedIdValue={item.materiais_id}
                            name='materiais_id'
                            service={MateriaisService}
                            label='Produtos / Insumos'
                            optionLabel='descricao'
                        />
                    </Grid>

                    <Grid item xs={1}>
                        <ItensListTools
                            mostrarBotaoVincular
                            aoClicarEmRemover={() => handleRemover(item.id)}
                        />
                    </Grid>

                </Scope>
            ))}

        </Grid>

    );
};