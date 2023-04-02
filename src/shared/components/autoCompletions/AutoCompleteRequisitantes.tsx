import { Autocomplete, CircularProgress, TextField } from '@mui/material';
import { useField } from '@unform/core';
import { useEffect, useMemo, useState } from 'react';
import { useDebouce } from '../../hooks';
import { RequisitantesService } from '../../services/api/requisitantes/RequisitantesService';


type TAutoCompleteOption = {
    id: number;
    label: string;
}

interface IAutoCompleteCategoriaProps {
    isExternalLoading?: boolean;
}

export const AutoCompleteRequisitantes = ({ isExternalLoading = false }: IAutoCompleteCategoriaProps) => {

    const { fieldName, clearError, defaultValue, error, registerField } = useField('requisitante_id');
    const [selectedId, setSelectedId] = useState<number | undefined>();

    const [opcoes, setOpcoes] = useState<TAutoCompleteOption[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [busca, setBusca] = useState('');
    const { debouce } = useDebouce();

    useEffect(() => {
        registerField({
            name: fieldName,
            getValue: () => selectedId,
            setValue: (_, newSelectedId) => setSelectedId(newSelectedId)
        });
    }, [registerField, fieldName, selectedId]);

    useEffect(() => {
        setIsLoading(true);
        if (selectedId) {
            RequisitantesService.getById(selectedId)
                .then((result) => {
                    setIsLoading(false);
                    if (result instanceof Error) {
                        //alert(result.message);
                    } else {
                        console.log('isFirstTime');
                        console.log(result);
                        const data = [];
                        data.push(result);
                        setOpcoes(data.map(opcao => ({ id: opcao.id, label: opcao.name })));

                        
                    }
                });
        } else {
            debouce(() => {
                console.log(`busca: ${busca}`);
                RequisitantesService.getAll(1, busca)
                    .then((result) => {
                        setIsLoading(false);
                        if (result instanceof Error) {
                            //alert(result.message);
                        } else {
                            console.log(result);
                            setOpcoes(result.data.map(opcao => ({ id: opcao.id, label: opcao.name })));
                        }
                    });
            });
        }

    }, [busca, selectedId]);



    const autoCompleteSelectedOption = useMemo(() => {
        if (!selectedId) return null;
        console.log(`selectedId: ${selectedId}`);
        const selectedOption = opcoes.find(opcao => opcao.id === selectedId);
        console.log(`selectedOption: ${selectedOption}`);
        if (!selectedOption) return null;

        return selectedOption;
    }, [selectedId, opcoes]);

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
            onChange={(_, newValue) => { setSelectedId(newValue?.id); setBusca(''); clearError(); }}
            renderInput={(params) => (
                <TextField
                    {...params}
                    label="Requisitante"
                    error={!!error}
                    helperText={error}
                />
            )}
        />
    );
};