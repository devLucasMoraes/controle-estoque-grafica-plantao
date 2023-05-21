import { Autocomplete, CircularProgress, TextField } from '@mui/material';
import { useField } from '@unform/core';
import { useEffect, useMemo, useState } from 'react';

type TUAutoCompleteOption = {
    id: number;
    label: string;
};

interface IUAutoCompleteProps {
    isExternalLoading?: boolean;
    initialSelectedIdValue?: number;
    name: string;
    service: {
        getById: (id: number) => Promise<any>;
        getAll: (page: number, search: string) => Promise<any>;
    };
    label: string;
    optionLabel: string;
}

export const UAutoComplete = ({
    isExternalLoading = false,
    initialSelectedIdValue,
    name,
    service,
    label,
    optionLabel,
}: IUAutoCompleteProps) => {
    console.log(`renderizou UAutoComplete ${label}`);

    const { fieldName, clearError, error, registerField } = useField(name);

    const [selectedId, setSelectedId] = useState<number | undefined>(initialSelectedIdValue);
    const [options, setOptions] = useState<TUAutoCompleteOption[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');

    const autoCompleteSelectedOption = useMemo(() => {
        if (!selectedId) return null;

        const selectedOption = options.find((option) => option.id === selectedId);

        if (!selectedOption) return null;

        return selectedOption;
    }, [selectedId, options]);

    useEffect(() => {
        console.log(`renderizou useEffect registerField UAutoComplete ${label}`);
        registerField({
            name: fieldName,
            getValue: () => selectedId,
            setValue: (_, newSelectedId) => setSelectedId(newSelectedId),
        });
    }, [registerField, fieldName, selectedId]);

    useEffect(() => {
        setIsLoading(true);
        console.log(`renderizou useEffect service UAutoComplete ${label}`);
        if (selectedId) {
            service.getById(selectedId)
                .then((result) => {
                    setIsLoading(false);
                    if (result instanceof Error) {
                        alert(result.message);
                    } else {
                        const data = [];
                        data.push(result);
                        setOptions(data.map((option) => ({ id: option.id, label: option[optionLabel] })));
                    }
                });
        } else {
            service.getAll(0, searchTerm)
                .then((result) => {
                    setIsLoading(false);
                    if (result instanceof Error) {
                        alert(result.message);
                    } else {
                        setOptions(result.data.content.map((option: any) => ({ id: option.id, label: option[optionLabel] })));
                    }
                });
        }
    }, [searchTerm, selectedId, service, optionLabel]);

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
            onInputChange={(_, newValue) => setSearchTerm(newValue)}
            options={options}
            onChange={(_, newValue) => {
                setSelectedId(newValue?.id);
                setSearchTerm('');
                clearError();
            }}
            renderInput={(params) => (
                <TextField {...params} label={label} error={!!error} helperText={error} size='small' />
            )}
        />
    );
};
