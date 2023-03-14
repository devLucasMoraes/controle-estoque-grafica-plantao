import { useParams } from 'react-router-dom';
import { DetailTools } from '../../shared/components';
import { LayoutBaseDePagina } from '../../shared/layouts';

export const EditarUser: React.FC = () => {

    const { id = 'new' } = useParams<'id'>();


    const handleSave = () => {
        console.log('Save');
    };
    const handleDelete = () => {
        console.log('delete');
    };

    return (
        <LayoutBaseDePagina
            titulo='Editar'
            tools={
                <DetailTools
                    mostrarBotaoSalvar
                    mostrarBotaoApagar={id !== 'new'}
                    aoClicaeEmApagar={handleDelete}
                    aoClicaeEmSalvar={handleSave}
                />
            }
        >
            <p>Nova {id}</p>
        </LayoutBaseDePagina>
    );
};