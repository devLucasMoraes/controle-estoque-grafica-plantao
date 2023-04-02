import { CircularProgress, Link } from '@mui/material';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MateriaisService } from '../../services/api/materiais/MateriaisService';

interface IUnderlineLinkUserProps {
    id?: number;
}

export const UnderlineLinkMateriais = ({ id = 1 }: IUnderlineLinkUserProps) => {
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();
    const [name, setName] = useState('');

    useEffect(() => {
        setIsLoading(true);
        MateriaisService.getById(id)
            .then(result => {
                setIsLoading(false);
                if (result instanceof Error) {
                    alert(result.message);
                } else {
                    console.log(result);
                    setName(result.name);
                }
            });

    }, [id]);

    return (
        <Link
            sx={{ cursor: 'pointer' }}
            underline="hover"
            variant='body1'

            onClick={() => navigate(`/materiais/records/show/${id}`)}
        >
            {isLoading ? <CircularProgress size={28} /> : name}
        </Link>
    );
};