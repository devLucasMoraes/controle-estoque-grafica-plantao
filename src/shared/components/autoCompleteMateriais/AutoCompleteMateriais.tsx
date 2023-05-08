/* eslint-disable react/display-name */

import { Autocomplete, CircularProgress, TextField } from '@mui/material';
import { SetStateAction, forwardRef, useCallback, useEffect, useImperativeHandle, useMemo, useState } from 'react';
import { useDebouce } from '../../hooks';
import { MateriaisService } from '../../services/api/materiais/MateriaisService';


type TAutoCompleteOption = {
    id: number;
    label: string;
}

interface IAutoCompleteCategoriaProps {
    isExternalLoading?: boolean;
    initialValue?: number;
    error?: string
}

export interface AutoCompleteMateriaisSelectedId {
    selectedId: number;
    setSelectedIdUndefined: () => void;
    setErrosMateriais: (error: string) => void;
}

export const AutoCompleteMateriais = forwardRef(({ initialValue, isExternalLoading = false, error }: IAutoCompleteCategoriaProps, ref) => {
    console.log('renderizou AutoCompleteMateriais');

    const [selectedId, setSelectedId] = useState<number | undefined>(initialValue);
    const [erros, setErros] = useState(error);

    const [opcoes, setOpcoes] = useState<TAutoCompleteOption[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [busca, setBusca] = useState('');
    const { debouce } = useDebouce();


    const setErrosMateriais = useCallback((error: SetStateAction<string | undefined>) => {
        setErros(error);
    }, []);

    const setSelectedIdUndefined = useCallback(() => {
        setSelectedId(undefined);
    }, []);

    useImperativeHandle(ref, () => {
        return {
            selectedId,
            setSelectedIdUndefined,
            setErrosMateriais
        };
    });

    useEffect(() => {
        console.log('renderizou useEffect MateriaisService.getById AutoCompleteMateriais');
        console.log(`selectedId: ${selectedId}`);
        setIsLoading(true);
        if (selectedId) {
            MateriaisService.getById(selectedId)
                .then((result) => {
                    setIsLoading(false);
                    if (result instanceof Error) {
                        //alert(result.message);
                    } else {
                        const data = [];
                        data.push(result);
                        setOpcoes(data.map(opcao => ({ id: opcao.id, label: opcao.descricao })));
                    }
                });
        } else {
            debouce(() => {
                MateriaisService.getAll(1, busca)
                    .then((result) => {
                        setIsLoading(false);
                        if (result instanceof Error) {
                            //alert(result.message);
                        } else {
                            setOpcoes(result.data.content.map(opcao => ({ id: opcao.id, label: opcao.descricao })));
                        }
                    });
            });
        }

    }, [busca, selectedId]);



    const autoCompleteSelectedOption = useMemo(() => {
        if (!selectedId) return null;
        const selectedOption = opcoes.find(opcao => opcao.id === selectedId);
        if (!selectedOption) return null;

        return selectedOption;
    }, [selectedId, opcoes]);

    const handleFocus = (): void => {
        if (erros) {
            setErros('');
        }
    };

    return (
        <Autocomplete
            openText='Abrir'
            closeText='Fechar'
            noOptionsText='Sem opções'
            loadingText='Carregando...'

            disablePortal

            disabled={isExternalLoading}
            value={autoCompleteSelectedOption}
            loading={isLoading}
            popupIcon={isExternalLoading || isLoading ? <CircularProgress size={28} /> : undefined}
            onInputChange={(_, newValue) => setBusca(newValue)}
            options={opcoes}
            onChange={(_, newValue) => { setSelectedId(newValue?.id); setBusca(''); }}
            renderInput={(params) => (
                <TextField
                    {...params}
                    label="Material"
                    inputRef={ref}
                    error={!!erros}
                    helperText={erros}
                    onFocus={() => handleFocus()}
                />
            )}
        />
    );
});