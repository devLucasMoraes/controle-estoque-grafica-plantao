import { Category, Factory, Inventory, LineAxis, LocalShipping, Man, Person, Place } from '@mui/icons-material';
import { useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { Dashboard, DetalharCategoria, DetalharDestinos, DetalharFornecedores, DetalharMateriais, DetalharRequisitantes, DetalharTransportadoras, DetalharUser, EditarCategoria, EditarDestinos, EditarFornecedores, EditarMateriais, EditarRequisitantes, EditarTransportadoras, EditarUser, ListagemDeCategorias, ListagemDeDestinos, ListagemDeFornecedores, ListagemDeMateriais, ListagemDeRequisitantes, ListagemDeTransportadoras, ListagemDeUsers } from '../pages';
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
            },
            {
                label: 'Transportadoras',
                icon: <LocalShipping />,
                path: '/transportadoras'
            },
            {
                label: 'Requisitante',
                icon: <Man />,
                path: '/requisitantes'
            },
            {
                label: 'Destinos',
                icon: <Place />,
                path: '/destinos'
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
            <Route path='/materiais/records/edit/:id' element={<EditarMateriais />} />
            <Route path='/materiais/records/show/:id' element={<DetalharMateriais />} />
            <Route path='/materiais/records/:id' element={<EditarMateriais />} />
            <Route path="/fornecedores" element={<ListagemDeFornecedores />} />
            <Route path='/fornecedores/records/edit/:id' element={<EditarFornecedores />} />
            <Route path='/fornecedores/records/show/:id' element={<DetalharFornecedores />} />
            <Route path='/fornecedores/records/:id' element={<EditarFornecedores />} />
            <Route path="/transportadoras" element={<ListagemDeTransportadoras />} />
            <Route path='/transportadoras/records/edit/:id' element={<EditarTransportadoras />} />
            <Route path='/transportadoras/records/show/:id' element={<DetalharTransportadoras />} />
            <Route path='/transportadoras/records/:id' element={<EditarTransportadoras />} />
            <Route path="/requisitantes" element={<ListagemDeRequisitantes />} />
            <Route path='/requisitantes/records/edit/:id' element={<EditarRequisitantes />} />
            <Route path='/requisitantes/records/show/:id' element={<DetalharRequisitantes />} />
            <Route path='/requisitantes/records/:id' element={<EditarRequisitantes />} />
            <Route path="/destinos" element={<ListagemDeDestinos />} />
            <Route path='/destinos/records/edit/:id' element={<EditarDestinos />} />
            <Route path='/destinos/records/show/:id' element={<DetalharDestinos />} />
            <Route path='/destinos/records/:id' element={<EditarDestinos />} />
            <Route path="*" element={<Navigate to="/dashboard" />} />
        </Routes>
    );
};