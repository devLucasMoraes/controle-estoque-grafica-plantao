import { CircularProgress, Link } from '@mui/material';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { DestinosService } from '../../services/api/destinos/DestinosService';

interface IUnderlineLinkUserProps {
    id: number;
}

export const UnderlineLinkDestinos = ({ id }: IUnderlineLinkUserProps) => {

    const navigate = useNavigate();

    const [isLoading, setIsLoading] = useState(false);
    const [name, setName] = useState('');

    useEffect(() => {
        setIsLoading(true);
        DestinosService.getById(id)
            .then(result => {
                setIsLoading(false);
                if (result instanceof Error) {
                    alert(result.message);
                } else {
                    setName(result.nome);
                }
            });
    }, [id]);

    return (
        <Link
            sx={{ cursor: 'pointer' }}
            underline="hover"
            variant='body1'
            onClick={() => navigate(`/destinos/records/show/${id}`)}
        >
            {isLoading ? <CircularProgress size={28} /> : name}
        </Link>
    );
};