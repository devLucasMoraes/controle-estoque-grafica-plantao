import { Autocomplete, CircularProgress, TextField } from '@mui/material';
import { useField } from '@unform/core';
import { useEffect, useMemo, useState } from 'react';
import { useDebouce } from '../../hooks';
import { FornecedorasService } from '../../services/api/fornecedoras/FornecedorasService';


type TUAutoCompleteOption = {
    id: number;
    label: string;
}

interface IUAutoCompleteFornecedora {
    isExternalLoading?: boolean;
}

export const UAutoCompleteFornecedora = ({ isExternalLoading = false }: IUAutoCompleteFornecedora) => {
    console.log('renderizou UAutoCompleteFornecedora');

    const { fieldName, clearError, error, registerField } = useField('fornecedora_id');

    const [selectedId, setSelectedId] = useState<number | undefined>();
    const [opcoes, setOpcoes] = useState<TUAutoCompleteOption[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [busca, setBusca] = useState('');

    const autoCompleteSelectedOption = useMemo(() => {

        if (!selectedId) return null;

        const selectedOption = opcoes.find(opcao => opcao.id === selectedId);

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
            FornecedorasService.getById(selectedId)
                .then((result) => {
                    setIsLoading(false);
                    if (result instanceof Error) {
                        alert(result.message);
                    } else {
                        const data = [];
                        data.push(result);
                        setOpcoes(data.map(opcao => ({ id: opcao.id, label: opcao.nome_fantasia })));  
                    }
                });
        } else {
            debouce(() => {
                FornecedorasService.getAll(0, busca)
                    .then((result) => {
                        setIsLoading(false);
                        if (result instanceof Error) {
                            alert(result.message);
                        } else {
                            setOpcoes(result.data.content.map(opcao => ({ id: opcao.id, label: opcao.nome_fantasia })));
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
                    label="Fornecedora"
                    error={!!error}
                    helperText={error}
                />
            )}
        />
    );
};