import { useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { ToolsList } from '../../shared/components';
import { LayoutBaseDePagina } from '../../shared/layouts';

export const ListagemDeUsers: React.FC = () => {

    const [searchParams, setSearchParams] = useSearchParams();

    const busca = useMemo(() => {
        return searchParams.get('busca') || '';
    },[searchParams]);

    return (
        <LayoutBaseDePagina
            titulo= 'Listagem'
            tools={
                <ToolsList 
                    textoDaBusca={busca}
                    aoMudarTextDeBusca={texto => setSearchParams({ busca: texto }, { replace: true })}
                />
            }
        >
        </LayoutBaseDePagina>
    );
};