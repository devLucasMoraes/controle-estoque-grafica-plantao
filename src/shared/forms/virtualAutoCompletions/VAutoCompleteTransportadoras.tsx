import { Autocomplete, CircularProgress, TextField } from '@mui/material';
import { useField } from '@unform/core';
import { useEffect, useMemo, useState } from 'react';
import { useDebouce } from '../../hooks';
import { TransportadorasService } from '../../services/api/transportadoras/TransportadorasService';


type TAutoCompleteOption = {
    id: number;
    label: string;
}

interface IAutoCompleteCategoriaProps {
    isExternalLoading?: boolean;
}

export const VAutoCompleteTransportadoras = ({ isExternalLoading = false }: IAutoCompleteCategoriaProps) => {
    console.log('renderizou AutoCompleteTransportadoras');

    const { fieldName, clearError, error, registerField } = useField('transportadora_id');

    const [selectedId, setSelectedId] = useState<number | undefined>();
    const [opcoes, setOpcoes] = useState<TAutoCompleteOption[]>([]);
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
            TransportadorasService.getById(selectedId)
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
                console.log(busca);
                TransportadorasService.getAll(0, busca)
                    .then((result) => {
                        setIsLoading(false);
                        console.log(result);
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
                    label="Transportadora"
                    error={!!error}
                    helperText={error}
                />
            )}
        />
    );
};