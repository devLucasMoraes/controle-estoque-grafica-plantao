import { useNavigate } from 'react-router-dom';
import { DetailTools } from '../../shared/components';
import { LayoutBaseDePagina } from '../../shared/layouts';


export const DetalharUser: React.FC = () => {

    const navigate = useNavigate();

    return (
        <LayoutBaseDePagina
            mostrarBotaoVoltar
            aoClicaeEmVoltar={() => navigate('/users')}
            titulo='Detalhar'
            tools={
                <DetailTools 
                    mostrarBotaoApagar
                    mostrarBotaoEditar
                />
            }
        >
            teste
        </LayoutBaseDePagina>
    );
};