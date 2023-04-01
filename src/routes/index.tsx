import { Category, Factory, Inventory, LineAxis, Person } from '@mui/icons-material';
import { useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { Dashboard, DetalharCategoria, DetalharFornecedores, DetalharMaterial, DetalharUser, EditarCategoria, EditarFornecedores, EditarMaterial, EditarUser, ListagemDeCategorias, ListagemDeFornecedores, ListagemDeMateriais, ListagemDeUsers } from '../pages';
import { useDrawerContext } from '../shared/contexts';


export const AppRoutes = () => {


    const { setDrawerOptions } = useDrawerContext();

    useEffect(() => {
        setDrawerOptions([
            {
                label: 'Dashboard',
                icon: <LineAxis />,
                path: '/dashboard'
            },
            {
                label: 'Usuarios',
                icon: <Person />,
                path: '/users'
            },
            {
                label: 'Categorias',
                icon: <Category />,
                path: '/categorias'
            },
            {
                label: 'Materiais',
                icon: <Inventory />,
                path: '/materiais'
            },
            {
                label: 'Fornecedores',
                icon: <Factory />,
                path: '/fornecedores'
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
            <Route path="/materiais" element={<ListagemDeMateriais />} />
            <Route path='/materiais/records/edit/:id' element={<EditarMaterial />} />
            <Route path='/materiais/records/show/:id' element={<DetalharMaterial />} />
            <Route path='/materiais/records/:id' element={<EditarMaterial />} />
            <Route path="/fornecedores" element={<ListagemDeFornecedores />} />
            <Route path='/fornecedores/records/edit/:id' element={<EditarFornecedores />} />
            <Route path='/fornecedores/records/show/:id' element={<DetalharFornecedores />} />
            <Route path='/fornecedores/records/:id' element={<EditarFornecedores />} />
            <Route path="*" element={<Navigate to="/dashboard" />} />
        </Routes>
    );
};