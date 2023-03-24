import { useNavigate, useParams } from 'react-router-dom';
import { DetailTools } from '../../shared/components';
import { LayoutBaseDePagina } from '../../shared/layouts';
import { UsersService } from '../../shared/services/api/users/UsersService';


export const DetalharUser: React.FC = () => {

    const navigate = useNavigate();
    const { id } = useParams<'id'>();


    const handleDelete = (id: number) => {
        if (confirm('Realmente deseja apagar?')) {
            UsersService.deleteById(id)
                .then(result => {
                    if (result instanceof Error) {
                        alert(result.message);
                    } else {
                        alert('Registro apagado com sucesso!');
                        navigate('/users');
                    }
                });
        }
    };

    return (
        <LayoutBaseDePagina
            mostrarBotaoVoltar
            aoClicaeEmVoltar={() => navigate('/users')}
            titulo='Detalhar'
            tools={
                <DetailTools
                    mostrarBotaoApagar
                    mostrarBotaoEditar
                    aoClicaeEmApagar={() => handleDelete(Number(id))}
                    aoClicaeEmEditar={() => navigate(`/users/records/edit/${id}`)}
                />
            }
        >
            teste
        </LayoutBaseDePagina>
    );
};