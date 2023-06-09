import { Autocomplete, CircularProgress, TextField } from '@mui/material';
import { useField } from '@unform/core';
import { useEffect, useMemo, useState } from 'react';
import { useDebouce } from '../../../shared/hooks';
import { UsersService } from '../../../shared/services/api/users/UsersService';


type TAutoCompleteOption = {
    id: number;
    label: string;
}

interface IAutoCompleteUserProps {
    isExternalLoading?: boolean;
}

export const AutoCompleteUser = ({ isExternalLoading = false }: IAutoCompleteUserProps) => {

    const { fieldName, clearError, defaultValue, error, registerField } = useField('user_id');
    console.log(`defaultValue: ${defaultValue}`);
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

        debouce(() => {
            console.log(`busca: ${busca}`);
            UsersService.getAll(1, busca)
                .then((result) => {
                    setIsLoading(false);
                    if (result instanceof Error) {
                        //alert(result.message);
                    } else {
                        console.log(result);
                        setOpcoes(result.data.map(user => ({ id: user.id, label: user.name })));
                    }
                });

        });

    }, [busca]);



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
                    label="Usuario"
                    error={!!error}
                    helperText={error}
                />
            )}
        />
    );
};