import { useEffect, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { ToolsList } from '../../shared/components';
import { LayoutBaseDePagina } from '../../shared/layouts';
import { UsersService } from '../../shared/services/api/users/UsersService';

export const ListagemDeUsers: React.FC = () => {

    const [searchParams, setSearchParams] = useSearchParams();

    const busca = useMemo(() => {
        return searchParams.get('busca') || '';
    }, [searchParams]);

    useEffect(() => {
        UsersService.getAll(1, busca)
            .then((result) => {
                if (result instanceof Error) {
                    alert(result.message);
                } else {
                    console.log(result);
                }
            });
    }, [busca]);


    return (
        <LayoutBaseDePagina
            titulo='Listagem'
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