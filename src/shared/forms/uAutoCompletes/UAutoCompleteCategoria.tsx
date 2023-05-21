import { Autocomplete, CircularProgress, TextField } from '@mui/material';
import { useField } from '@unform/core';
import { useEffect, useMemo, useState } from 'react';
import { useDebouce } from '../../hooks';
import { CategoriasService } from '../../services/api/categorias/CategoriasService';


type TUAutoCompleteOption = {
    id: number;
    label: string;
}

interface IUAutoCompleteCategoria {
    isExternalLoading?: boolean;
    initialSelectedIdValue?: number;
    name: string;
}

export const UAutoCompleteCategoria = ({ isExternalLoading = false, name, initialSelectedIdValue }: IUAutoCompleteCategoria) => {
    console.log('renderizou UAutoCompleteCategoria');

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
        console.log('renderizou useEffect registerField UAutoCompleteCategoria');
        registerField({
            name: fieldName,
            getValue: () => selectedId,
            setValue: (_, newSelectedId) => setSelectedId(newSelectedId)
        });
        console.log(selectedId);
    }, [registerField, fieldName, selectedId]);
    
    useEffect(() => {
        console.log('renderizou useEffect CategoriasService UAutoCompleteCategoria');
        setIsLoading(true);
        if (selectedId) {
            CategoriasService.getById(selectedId)
                .then((result) => {
                    setIsLoading(false);
                    if (result instanceof Error) {
                        alert(result.message);
                    } else {
                        const data = [];
                        data.push(result);
                        setOpcoes(data.map(categoria => ({ id: categoria.id, label: categoria.nome })));  
                    }
                });
        } else {
            debouce(() => {
                CategoriasService.getAll(0, busca)
                    .then((result) => {
                        setIsLoading(false);
                        if (result instanceof Error) {
                            alert(result.message);
                        } else {
                            setOpcoes(result.data.content.map(categoria => ({ id: categoria.id, label: categoria.nome })));
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
                    label="Categoria"
                    error={!!error}
                    helperText={error}
                    size='small'
                />
            )}
        />
    );
};