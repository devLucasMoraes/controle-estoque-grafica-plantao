import { Grid, TextField } from '@mui/material';
import { useEffect, useRef, useState } from 'react';
import * as yup from 'yup';
import { AutoCompeteForwardRef, AutoCompleteSelectedId, ItensListTools } from '../../../shared/components';
import { IUFormErros, UAutoComplete, UId, UTextField } from '../../../shared/forms';
import { FornecedorasService } from '../../../shared/services/api/fornecedoras/FornecedorasService';
import { Scope } from '@unform/core';
import { IFornecedorasVinculadas } from '../../../shared/services/api/materiais/MateriaisService';

interface IVinculosComFornecedorasProps {
    initialValues: Array<IFornecedorasVinculadas>
}

const itemSchema: yup.ObjectSchema<IFornecedorasVinculadas> = yup.object().shape({
    id: yup.number().required(),
    idFornecedora: yup.number().required(),
    codProd: yup.string().required(),
});

export const VinculosComFornecedoras = ({ initialValues }: IVinculosComFornecedorasProps) => {


    const idFornecedoraRef = useRef<AutoCompleteSelectedId>(null);
    const codProdRef = useRef<HTMLInputElement>(null);

    const [fornecedorasVinculadas, setFornecedorasVinculadas] = useState<Array<IFornecedorasVinculadas>>(initialValues);
    const [erros, setErros] = useState<IUFormErros>({});

    useEffect(() => {
        console.log('renderizou setFornecedorasVinculadas useEffect VinculosComFornecedoras');
        setFornecedorasVinculadas(initialValues);
    }, [initialValues]);

    function handleAdicionar(): void {
        const novoItem = {
            id: Math.random() - 1,
            idFornecedora: idFornecedoraRef.current?.selectedId,
            codProd: codProdRef.current?.value,
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
                idFornecedoraRef.current?.setComponentErrors(validationErrors['idFornecedora']);
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