import { CircularProgress, Link } from '@mui/material';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

interface IUnderlineLinkGenericProps {
    id: number;
    service: { getById: (id: number) => Promise<Error | any>;}
    nameProperty: string;
    linkPath: string;
}

export const UnderlineLink = ({ id, service, nameProperty, linkPath }: IUnderlineLinkGenericProps) => {
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(false);
    const [name, setName] = useState('');

    useEffect(() => {
        setIsLoading(true);
        service.getById(id)
            .then((result) => {
                setIsLoading(false);
                if (result instanceof Error) {
                    alert(result.message);
                } else {
                    setName(result[nameProperty]);
                }
            });
    }, [id, service, nameProperty]);

    return (
        <Link
            sx={{ cursor: 'pointer' }}
            underline="hover"
            variant='body1'
            onClick={() => navigate(linkPath.replace(':id', id.toString()))}
        >
            {isLoading ? <CircularProgress size={28} /> : name}
        </Link>
    );
};

