import { Autocomplete, CircularProgress, TextField } from '@mui/material';
import { useField } from '@unform/core';
import { useEffect, useMemo, useState } from 'react';
import { useDebouce } from '../../hooks';
import { RequisitantesService } from '../../services/api/requisitantes/RequisitantesService';


type TUAutoCompleteOption = {
    id: number;
    label: string;
}

interface IUAutoCompleteRequisitante {
    isExternalLoading?: boolean;
}

export const UAutoCompleteRequisitante = ({ isExternalLoading = false }: IUAutoCompleteRequisitante) => {

    const { fieldName, clearError, error, registerField } = useField('requisitantes_id');

    const [selectedId, setSelectedId] = useState<number | undefined>();
    const [opcoes, setOpcoes] = useState<TUAutoCompleteOption[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [busca, setBusca] = useState('');

    const autoCompleteSelectedOption = useMemo(() => {

        if (!selectedId) return null;
        console.log(`selectedId: ${selectedId}`);

        const selectedOption = opcoes.find(opcao => opcao.id === selectedId);
        console.log(`selectedOption: ${selectedOption}`);

        if (!selectedOption) return null;

        return selectedOption;

    }, [selectedId, opcoes]);

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
                        alert(result.message);
                    } else {
                        console.log('isFirstTime');
                        console.log(result);
                        const data = [];
                        data.push(result);
                        setOpcoes(data.map(opcao => ({ id: opcao.id, label: opcao.nome })));
                    }
                });
        } else {
            debouce(() => {
                console.log(`busca: ${busca}`);
                RequisitantesService.getAll(0, busca)
                    .then((result) => {
                        setIsLoading(false);
                        if (result instanceof Error) {
                            alert(result.message);
                        } else {
                            console.log(result);
                            setOpcoes(result.data.map(opcao => ({ id: opcao.id, label: opcao.nome })));
                        }
                    });
            });
        }

    }, [busca, selectedId]);

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