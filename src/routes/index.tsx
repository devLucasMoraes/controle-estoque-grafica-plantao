import { useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { Dashboard, DetalharUser, EditarUser, ListagemDeUsers } from '../pages';
import { DetalharCategoria } from '../pages/categorias/DetalharCategorias';
import { EditarCategoria } from '../pages/categorias/EditarCategorias';
import { ListagemDeCategorias } from '../pages/categorias/ListagemDeCategorias';
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
            },
            {
                label: 'Categorias',
                icon: 'category',
                path: '/categorias'
            }
        ]);
    }, []);


    return (
        <Routes>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/users" element={<ListagemDeUsers />} />
            <Route path='/users/records/edit/:id' element={<EditarUser />} />
            <Route path='/users/records/show/:id' element={<DetalharUser />} />
            <Route path='/users/records/:id' element={<EditarUser />} />
            <Route path="/categorias" element={<ListagemDeCategorias />} />
            <Route path='/categorias/records/edit/:id' element={<EditarCategoria />} />
            <Route path='/categorias/records/show/:id' element={<DetalharCategoria />} />
            <Route path='/categorias/records/:id' element={<EditarCategoria />} />
            <Route path="*" element={<Navigate to="/dashboard" />} />
        </Routes>
    );
};