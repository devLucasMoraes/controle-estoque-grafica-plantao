import { Category, Factory, ImportExport, Inventory, LineAxis, LocalShipping, Man, Person, Place } from '@mui/icons-material';
import { useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { Dashboard, DetalharCategoria, DetalharDestinos, DetalharFornecedoras, DetalharMateriais, DetalharRequisitantes, DetalharTransacoesEntrada, DetalharTransacoesSaida, DetalharTransportadoras, DetalharUser, EditarCategoria, EditarDestinos, EditarFornecedoras, EditarMateriais, EditarRequisitantes, EditarTransacoesEntrada, EditarTransacoesSaida, EditarTransportadoras, EditarUser, ListagemDeCategorias, ListagemDeDestinos, ListagemDeFornecedoras, ListagemDeMateriais, ListagemDeRequisitantes, ListagemDeTransacoesEntrada, ListagemDeTransacoesSaida, ListagemDeTransportadoras, ListagemDeUsers } from '../pages';
import { useDrawerContext } from '../shared/contexts';


export const AppRoutes = () => {


    const { setDrawerOptions } = useDrawerContext();

    useEffect(() => {
        setDrawerOptions([
            {
                label: 'Dashboard',
                icon: <LineAxis />,
                path: '/dashboard',
                group: ''
            },
            {
                label: 'Usuarios',
                icon: <Person />,
                path: '/users',
                group:''
            },
            {
                label: 'Categorias',
                icon: <Category />,
                path: '/categorias',
                group: 'Cadastro de Materiais'
            },
            {
                label: 'Materiais',
                icon: <Inventory />,
                path: '/materiais',
                group: 'Cadastro de Materiais'
            },
            {
                label: 'Fornecedoras',
                icon: <Factory />,
                path: '/fornecedoras',
                group: 'Entrada de Materiais'
            },
            {
                label: 'Transportadoras',
                icon: <LocalShipping />,
                path: '/transportadoras',
                group: 'Entrada de Materiais'
            },
            {
                label: 'Requisitante',
                icon: <Man />,
                path: '/requisitantes',
                group: 'Saida de Materiais'
            },
            {
                label: 'Destinos',
                icon: <Place />,
                path: '/destinos',
                group: 'Saida de Materiais'
            },
            {
                label: 'Transações de entrada',
                icon: <ImportExport />,
                path: '/transacoes_entrada',
                group: 'Entrada de Materiais'
            },
            {
                label: 'Transações de saida',
                icon: <ImportExport />,
                path: '/transacoes_saida',
                group: 'Saida de Materiais'
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
            <Route path="/fornecedoras" element={<ListagemDeFornecedoras />} />
            <Route path='/fornecedoras/records/edit/:id' element={<EditarFornecedoras />} />
            <Route path='/fornecedoras/records/show/:id' element={<DetalharFornecedoras />} />
            <Route path='/fornecedoras/records/:id' element={<EditarFornecedoras />} />
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
            <Route path="/transacoes_entrada" element={<ListagemDeTransacoesEntrada />} />
            <Route path='/transacoes_entrada/records/edit/:id' element={<EditarTransacoesEntrada />} />
            <Route path='/transacoes_entrada/records/show/:id' element={<DetalharTransacoesEntrada />} />
            <Route path='/transacoes_entrada/records/:id' element={<EditarTransacoesEntrada />} />
            <Route path="/transacoes_saida" element={<ListagemDeTransacoesSaida />} />
            <Route path='/transacoes_saida/records/edit/:id' element={<EditarTransacoesSaida />} />
            <Route path='/transacoes_saida/records/show/:id' element={<DetalharTransacoesSaida />} />
            <Route path='/transacoes_saida/records/:id' element={<EditarTransacoesSaida />} />
            <Route path="*" element={<Navigate to="/dashboard" />} />
        </Routes>
    );
};