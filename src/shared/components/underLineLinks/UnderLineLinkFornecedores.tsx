import { CircularProgress, Link } from '@mui/material';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FornecedorasService } from '../../services/api/fornecedoras/FornecedorasService';

interface IUnderlineLinkUserProps {
    id?: number;
}

export const UnderlineLinkFornecedores = ({ id = 1 }: IUnderlineLinkUserProps) => {
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();
    const [name, setName] = useState('');

    useEffect(() => {
        setIsLoading(true);
        FornecedorasService.getById(id)
            .then(result => {
                setIsLoading(false);
                if (result instanceof Error) {
                    alert(result.message);
                } else {
                    console.log(result);
                    setName(result.nome_fantasia);
                }
            });

    }, [id]);

    return (
        <Link
            sx={{ cursor: 'pointer' }}
            underline="hover"
            variant='body1'

            onClick={() => navigate(`/fornecedores/records/show/${id}`)}
        >
            {isLoading ? <CircularProgress size={28} /> : name}
        </Link>
    );
};