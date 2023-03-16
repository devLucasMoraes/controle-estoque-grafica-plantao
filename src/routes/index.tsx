import { useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { Dashboard, DetalharUser, EditarUser, ListagemDeUsers } from '../pages';
import { useDrawerContext } from '../shared/contexts';

export const AppRoutes = () => {


    const { setDrawerOptions } = useDrawerContext();

    useEffect(() => {
        setDrawerOptions([
            {
                label: 'Dashboard',
                icon: 'dashboard',
                path: '/dashboard'
            },
            {
                label: 'Usuarios',
                icon: 'person',
                path: '/users'
            }
        ]);
    }, []);


    return (
        <Routes>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/users" element={<ListagemDeUsers />} />
            <Route path='/users/records/edit/:id' element={<EditarUser />} />
            <Route path='/users/records/show/:id' element={<DetalharUser />} />
            <Route path="*" element={<Navigate to="/dashboard" />} />
        </Routes>
    );
};