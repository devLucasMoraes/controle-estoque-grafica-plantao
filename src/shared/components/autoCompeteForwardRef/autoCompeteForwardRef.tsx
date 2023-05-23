/* eslint-disable react/display-name */
import { Autocomplete, CircularProgress, TextField } from '@mui/material';
import { SetStateAction, forwardRef, useCallback, useEffect, useImperativeHandle, useMemo, useState } from 'react';


type TAutoCompleteOption = {
    id: number;
    label: string;
};

interface IAutoCompeteForwardRefProps {
    isExternalLoading?: boolean;
    initialValue?: number;
    error?: string;
    service: {
        getById: (id: number) => Promise<any>;
        getAll: (page: number, search: string) => Promise<any>;
    }; // Tipo genérico para o serviço
    label: string;
    optionLabel: string; // Nome da chave do objeto de opção para exibição do rótulo
}

export interface AutoCompleteSelectedId {
    selectedId: number;
    setSelectedIdUndefined: () => void;
    setComponentErrors: (error: string) => void;
}

export const AutoCompeteForwardRef = forwardRef(
    ({ initialValue, isExternalLoading = false, error, service, label, optionLabel }: IAutoCompeteForwardRefProps, ref) => {
        const [selectedId, setSelectedId] = useState<number | undefined>(initialValue);
        const [errors, setErrors] = useState(error);
        const [options, setOptions] = useState<TAutoCompleteOption[]>([]);
        const [isLoading, setIsLoading] = useState(false);
        const [searchTerm, setSearchTerm] = useState('');

        const setComponentErrors = useCallback((error: SetStateAction<string | undefined>) => {
            setErrors(error);
        }, []);

        const setSelectedIdUndefined = useCallback(() => {
            setSelectedId(undefined);
        }, []);

        useImperativeHandle(ref, () => ({
            selectedId,
            setSelectedIdUndefined,
            setComponentErrors,
        }));

        const selectedOption = useMemo(() => {
            if (!selectedId) return null;
            return options.find((option) => option.id === selectedId);
        }, [selectedId, options]);

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

        const handleFocus = () => {
            if (errors) {
                setErrors('');
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
                value={selectedOption}
                loading={isLoading}
                popupIcon={isExternalLoading || isLoading ? <CircularProgress size={28} /> : undefined}
                onInputChange={(_, newValue) => setSearchTerm(newValue)}
                options={options}
                onChange={(_, newValue) => {
                    setSelectedId(newValue?.id);
                    setSearchTerm('');
                }}
                renderInput={(params) => (
                    <TextField
                        {...params}
                        label={label}
                        inputRef={ref}
                        error={!!errors}
                        helperText={errors}
                        onFocus={handleFocus}
                        size='small'
                    />
                )}
            />
        );
    }
);
