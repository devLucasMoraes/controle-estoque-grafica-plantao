import { LinearProgress } from '@mui/material';
import { FormHandles } from '@unform/core';
import { Form } from '@unform/web';
import { useEffect, useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { DetailTools } from '../../shared/components';
import { VTextField } from '../../shared/forms';
import { LayoutBaseDePagina } from '../../shared/layouts';
import { UsersService } from '../../shared/services/api/users/UsersService';


interface IFormData {
    name: string;
    email: string;
    password_hash: string;
    role: string;
    status: string;
}

export const EditarUser: React.FC = () => {

    const { id = 'new' } = useParams<'id'>();
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(false);
    const formRef = useRef<FormHandles>(null);

    useEffect(() => {
        if (id !== 'new') {
            setIsLoading(true);
            UsersService.getById(Number(id))
                .then(result => {
                    setIsLoading(false);
                    if (result instanceof Error) {
                        alert(result.message);
                        navigate('/users');
                    } else {
                        console.log(result);
                        formRef.current?.setData(result);
                    }
                });
        }
    }, [id]);


    const handleSave = (dados: IFormData) => {
        setIsLoading(true);
        if (id === 'new') {
            UsersService
                .create(dados)
                .then(result => {
                    setIsLoading(false);
                    if (result instanceof Error) {
                        alert(result.message);
                    } else {
                        navigate(`/users/records/show/${result}`);
                    }
                });
        } else {
            UsersService
                .updateById(Number(id), { id: Number(id), ...dados })
                .then(result => {
                    setIsLoading(false);
                    if (result instanceof Error) {
                        alert(result.message);
                    } else {
                        navigate(`/users/records/show/${result}`);
                    }
                });
        }
    };
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
            titulo={id === 'new' ? 'Novo usuario' : 'Editar'}
            tools={
                <DetailTools
                    mostrarBotaoSalvar
                    mostrarBotaoApagar={id !== 'new'}
                    mostrarBotaoDetalhar={id !== 'new'}
                    aoClicaeEmApagar={() => handleDelete(Number(id))}
                    aoClicaeEmSalvar={() => formRef.current?.submitForm()}
                    aoClicaeEmDetalhar={() => navigate(`/users/records/show/${id}`)}
                />
            }
        >
            <Form ref={formRef} onSubmit={dados => handleSave(dados)}>
                <VTextField placeholder='Nome' name='name' />
                <VTextField placeholder='email' name='email' />
                <VTextField placeholder='senha' name='password_hash' />
                <VTextField placeholder='cargo' name='role' />
                <VTextField placeholder='status' name='status' />
                <button type='submit'>submit</button>
            </Form>

            {isLoading && (
                <LinearProgress variant='indeterminate' />
            )}


        </LayoutBaseDePagina>
    );
};