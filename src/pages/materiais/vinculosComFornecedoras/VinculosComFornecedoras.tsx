import { Grid, TextField } from '@mui/material';
import { useRef, useState } from 'react';
import * as yup from 'yup';
import { AutoCompeteForwardRef, AutoCompleteSelectedId, ItensListTools } from '../../../shared/components';
import { IUFormErros, UAutoComplete, UId, UTextField } from '../../../shared/forms';
import { FornecedorasService } from '../../../shared/services/api/fornecedoras/FornecedorasService';
import { Scope } from '@unform/core';


interface novoItem {
    id?: number;
    fornecedora_id?: number;
    cod_prod?: string;
}

const itemSchema: yup.ObjectSchema<novoItem> = yup.object().shape({
    id: yup.number().required(),
    fornecedora_id: yup.number().required(),
    cod_prod: yup.string().required(),
});

export const VinculosComFornecedoras = () => {


    const idFornecedoraRef = useRef<AutoCompleteSelectedId>(null);
    const codProdRef = useRef<HTMLInputElement>(null);

    const [fornecedorasVinculadas, setFornecedorasVinculadas] = useState<Array<novoItem>>([]);
    const [erros, setErros] = useState<IUFormErros>({});

    function handleAdicionar(): void {
        const novoItem: novoItem = {
            id: Math.random() - 1,
            fornecedora_id: idFornecedoraRef.current?.selectedId,
            cod_prod: codProdRef.current?.value,
        };
        itemSchema
            .validate(novoItem, { abortEarly: false })
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
                idFornecedoraRef.current?.setComponentErrors(validationErrors['fornecedora_id']);
                console.log(validationErrors);
            });
        console.log(novoItem);
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

    return (
        <Grid container spacing={2} alignItems={'center'}>
            <Grid item xs={6}>
                <AutoCompeteForwardRef
                    ref={idFornecedoraRef}
                    error={erros['fornecedora_id']}
                    label='Fornecedora'
                    service={FornecedorasService}
                    optionLabel='nome_fantasia'
                />
            </Grid>

            <Grid item xs={5}>
                <TextField
                    label='Código Produto'
                    fullWidth
                    placeholder='código do produto'
                    inputRef={codProdRef}
                    helperText={erros['cod_prod']}
                    error={!!erros['cod_prod']}
                    onFocus={() => handleInputFocus('cod_prod')}
                    size='small'
                />
            </Grid>

            <Grid item xs={1}>
                <ItensListTools
                    mostrarBotaoAdicionar
                    aoClicarEmAdicionar={() => handleAdicionar()}
                />
            </Grid>

            {fornecedorasVinculadas.map((item, index) => (
                <Scope key={item.id} path={`fornecedorasVinculadas[${index}]`} >
                    <UId
                        name='id'
                        initialValue={item.id}
                    />

                    <Grid item xs={6}>
                        <UAutoComplete
                            name='fornecedora_id'
                            service={FornecedorasService}
                            label='Fornecedora'
                            optionLabel='nome_fantasia'
                            initialSelectedIdValue={item.fornecedora_id}
                        />
                    </Grid>

                    <Grid item xs={5}>
                        <UTextField
                            fullWidth
                            label='Código Produto'
                            placeholder='código do produto'
                            name='cod_prod'
                            initialValue={item.cod_prod}
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