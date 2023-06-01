/* eslint-disable react/display-name */
import { Autocomplete, CircularProgress, TextField } from '@mui/material';
import { useField } from '@unform/core';
import { forwardRef, useCallback, useEffect, useImperativeHandle, useMemo, useState } from 'react';


type TAutoCompleteOption = {
    id: number;
    label: string;
};

interface IUAutoCompeteForwardRefProps {
    isExternalLoading?: boolean;
    initialSelectedIdValue?: number;
    name: string;
    service: {
        getById: (id: number) => Promise<any>;
        getAll: (page: number, search: string) => Promise<any>;
    }; // Tipo genérico para o serviço
    label: string;
    optionLabel: string; // Nome da chave do objeto de opção para exibição do rótulo
}

export interface IUAutoCompleteForwardRef {
    selectedId: number;
    setSelectedIdUndefined: () => void;
}

export const UAutoCompeteForwardRef = forwardRef(
    ({ initialSelectedIdValue, isExternalLoading = false, name, service, label, optionLabel }: IUAutoCompeteForwardRefProps, ref) => {

        const { fieldName, registerField, defaultValue, error, clearError } = useField(name);

        const [selectedId, setSelectedId] = useState<number | undefined>(initialSelectedIdValue);
        const [options, setOptions] = useState<TAutoCompleteOption[]>([]);
        const [isLoading, setIsLoading] = useState(false);
        const [searchTerm, setSearchTerm] = useState('');

        const setSelectedIdUndefined = useCallback(() => {
            setSelectedId(undefined);
        }, []);

        useImperativeHandle(ref, () => ({
            selectedId,
            setSelectedIdUndefined
        }));

        const selectedOption = useMemo(() => {
            if (!selectedId) return null;
            return options.find((option) => option.id === selectedId);
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
            if (selectedId) {
                service.getById(selectedId)
                    .then((result) => {
                        setIsLoading(false);
                        if (result instanceof Error) {
                            console.error(result.message);
                        } else {
                            setOptions([{ id: result.id, label: result[optionLabel] }]);
                        }
                    });
            } else {
                service.getAll(0, searchTerm)
                    .then((result) => {
                        setIsLoading(false);
                        if (result instanceof Error) {
                            console.error(result.message);
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
                value={selectedOption}
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
                    <TextField
                        {...params}
                        label={label}
                        inputRef={ref}
                        error={!!error}
                        helperText={error}
                        size='small'
                    />
                )}
            />
        );
    }
);
