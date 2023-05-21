import { Autocomplete, CircularProgress, TextField } from '@mui/material';
import { useField } from '@unform/core';
import { useEffect, useMemo, useState } from 'react';
import { useDebouce } from '../../hooks';
import { MateriaisService } from '../../services/api/materiais/MateriaisService';


type TUAutoCompleteOption = {
    id: number;
    label: string;
}

interface IUAutoCompleteMaterial {
    isExternalLoading?: boolean;
    initialSelectedIdValue?: number;
    name: string;
}

export const UAutoCompleteMaterial = ({ isExternalLoading = false, name, initialSelectedIdValue }: IUAutoCompleteMaterial) => {
    console.log('renderizou UAutoCompleteMaterial');

    const { fieldName, clearError, error, registerField } = useField(name);

    const [selectedId, setSelectedId] = useState<number | undefined>(initialSelectedIdValue);
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
        //console.log('renderizou useEffect registerField UAutoCompleteMaterial');
        registerField({
            name: fieldName,
            getValue: () => selectedId,
            setValue: (_, newSelectedId) => setSelectedId(newSelectedId)
        });
    }, [registerField, fieldName, selectedId]);

    useEffect(() => {
        //console.log('renderizou useEffect MateriaisService UAutoCompleteMaterial');
        setIsLoading(true);
        if (selectedId) {
            MateriaisService.getById(selectedId)
                .then((result) => {
                    setIsLoading(false);
                    if (result instanceof Error) {
                        alert(result.message);
                    } else {
                        const data = [];
                        data.push(result);
                        setOpcoes(data.map(opcao => ({ id: opcao.id, label: opcao.descricao })));
                    }
                });
        } else {
            debouce(() => {
                MateriaisService.getAll(0, busca)
                    .then((result) => {
                        setIsLoading(false);
                        if (result instanceof Error) {
                            alert(result.message);
                        } else {
                            setOpcoes(result.data.content.map(opcao => ({ id: opcao.id, label: opcao.descricao })));
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
                    label="Produto / Insumo"
                    error={!!error}
                    helperText={error}
                    size='small'
                />
            )}
        />
    );
};