import { Autocomplete, CircularProgress, TextField, AutocompleteProps } from '@mui/material';
import { useEffect, useMemo, useState } from 'react';
import { useDebouce } from '../../hooks';
import { MateriaisService } from '../../services/api/materiais/MateriaisService';


type TAutoCompleteOption = {
    id: number;
    label: string;
}

interface IAutoCompleteCategoriaProps {
    isExternalLoading?: boolean;
    initialValue?: number;
    inputRef?: React.RefObject<HTMLInputElement>;
}

export const AutoCompleteMateriais = ({ isExternalLoading = false, initialValue, inputRef }: IAutoCompleteCategoriaProps) => {
    //console.log('renderizou AutoCompleteMateriais');

    const [selectedId, setSelectedId] = useState<number | undefined>(initialValue);

    const [opcoes, setOpcoes] = useState<TAutoCompleteOption[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [busca, setBusca] = useState('');
    const { debouce } = useDebouce();

    useEffect(() => {
        setIsLoading(true);
        if (selectedId) {
            MateriaisService.getById(selectedId)
                .then((result) => {
                    setIsLoading(false);
                    if (result instanceof Error) {
                        //alert(result.message);
                    } else {
                        const data = [];
                        data.push(result);
                        setOpcoes(data.map(opcao => ({ id: opcao.id, label: opcao.descricao })));
                    }
                });
        } else {
            debouce(() => {
                MateriaisService.getAll(1, busca)
                    .then((result) => {
                        setIsLoading(false);
                        if (result instanceof Error) {
                            //alert(result.message);
                        } else {
                            setOpcoes(result.data.content.map(opcao => ({ id: opcao.id, label: opcao.descricao })));
                        }
                    });
            });
        }

    }, [busca, selectedId]);



    const autoCompleteSelectedOption = useMemo(() => {
        if (!selectedId) return null;
        const selectedOption = opcoes.find(opcao => opcao.id === selectedId);
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
            onChange={(_, newValue) => { setSelectedId(newValue?.id); setBusca(''); }}
            renderInput={(params) => (
                <TextField
                    {...params}
                    inputRef={inputRef}
                    label="Material"
                />
            )}
        />
    );
};