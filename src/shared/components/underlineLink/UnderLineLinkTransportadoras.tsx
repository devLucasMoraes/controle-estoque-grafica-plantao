import { CircularProgress, Link } from '@mui/material';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { TransportadorasService } from '../../services/api/transportadoras/TransportadorasService';

interface IUnderlineLinkUserProps {
    id?: number;
}

export const UnderlineLinkTransportadoras = ({ id }: IUnderlineLinkUserProps) => {

    const navigate = useNavigate();

    const [isLoading, setIsLoading] = useState(false);
    const [name, setName] = useState('');

    useEffect(() => {
        setIsLoading(true);
        if (id) {
            TransportadorasService.getById(id)
                .then(result => {
                    setIsLoading(false);
                    if (result instanceof Error) {
                        alert(result.message);
                    } else {
                        setName(result.nomeFantasia);
                    }
                });
        }
    }, [id]);

    return (
        <Link
            sx={{ cursor: 'pointer' }}
            underline="hover"
            variant='body1'
            onClick={() => navigate(`/transportadoras/records/show/${id}`)}
        >
            {isLoading ? <CircularProgress size={28} /> : name}
        </Link>
    );
};