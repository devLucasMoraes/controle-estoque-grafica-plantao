import { Category, Factory, ImportExport, Inventory, LineAxis, LocalShipping, Man, Person, Place } from '@mui/icons-material';
import { useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { Dashboard, DetalhamentoDeCategoria, DetalharDestinos, DetalhamentoDeFornecedora, DetalhamentoDeMaterial, DetalharRequisitantes, DetalhamentoDeTransacoesEntrada, DetalharTransacoesSaida, DetalhamentoDeTransportadora, DetalharUser, EdicaoOuCriacaoDeCategoria, EditarDestinos, EdicaoOuCriacaoDeFornecedora, EdicaoOuCriacaoDeMaterial, EditarRequisitantes, EdicaoOuCriacaoDeTransacoesEntrada, EditarTransacoesSaida, EdicaoOuCriacaoDeTransportadora, EditarUser, ListagemDeCategorias, ListagemDeDestinos, ListagemDeFornecedoras, ListagemDeMateriais, ListagemDeRequisitantes, ListagemDeTransacoesEntrada, ListagemDeTransacoesSaida, ListagemDeTransportadoras, ListagemDeUsers } from '../pages';
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
            <Route path='/categorias/records/edit/:id' element={<EdicaoOuCriacaoDeCategoria />} />
            <Route path='/categorias/records/show/:id' element={<DetalhamentoDeCategoria />} />
            <Route path='/categorias/records/:id' element={<EdicaoOuCriacaoDeCategoria />} />
            <Route path="/materiais" element={<ListagemDeMateriais />} />
            <Route path='/materiais/records/edit/:id' element={<EdicaoOuCriacaoDeMaterial />} />
            <Route path='/materiais/records/show/:id' element={<DetalhamentoDeMaterial />} />
            <Route path='/materiais/records/:id' element={<EdicaoOuCriacaoDeMaterial />} />
            <Route path="/fornecedoras" element={<ListagemDeFornecedoras />} />
            <Route path='/fornecedoras/records/edit/:id' element={<EdicaoOuCriacaoDeFornecedora />} />
            <Route path='/fornecedoras/records/show/:id' element={<DetalhamentoDeFornecedora />} />
            <Route path='/fornecedoras/records/:id' element={<EdicaoOuCriacaoDeFornecedora />} />
            <Route path="/transportadoras" element={<ListagemDeTransportadoras />} />
            <Route path='/transportadoras/records/edit/:id' element={<EdicaoOuCriacaoDeTransportadora />} />
            <Route path='/transportadoras/records/show/:id' element={<DetalhamentoDeTransportadora />} />
            <Route path='/transportadoras/records/:id' element={<EdicaoOuCriacaoDeTransportadora />} />
            <Route path="/requisitantes" element={<ListagemDeRequisitantes />} />
            <Route path='/requisitantes/records/edit/:id' element={<EditarRequisitantes />} />
            <Route path='/requisitantes/records/show/:id' element={<DetalharRequisitantes />} />
            <Route path='/requisitantes/records/:id' element={<EditarRequisitantes />} />
            <Route path="/destinos" element={<ListagemDeDestinos />} />
            <Route path='/destinos/records/edit/:id' element={<EditarDestinos />} />
            <Route path='/destinos/records/show/:id' element={<DetalharDestinos />} />
            <Route path='/destinos/records/:id' element={<EditarDestinos />} />
            <Route path="/transacoes_entrada" element={<ListagemDeTransacoesEntrada />} />
            <Route path='/transacoes_entrada/records/edit/:id' element={<EdicaoOuCriacaoDeTransacoesEntrada />} />
            <Route path='/transacoes_entrada/records/show/:id' element={<DetalhamentoDeTransacoesEntrada />} />
            <Route path='/transacoes_entrada/records/:id' element={<EdicaoOuCriacaoDeTransacoesEntrada />} />
            <Route path="/transacoes_saida" element={<ListagemDeTransacoesSaida />} />
            <Route path='/transacoes_saida/records/edit/:id' element={<EditarTransacoesSaida />} />
            <Route path='/transacoes_saida/records/show/:id' element={<DetalharTransacoesSaida />} />
            <Route path='/transacoes_saida/records/:id' element={<EditarTransacoesSaida />} />
            <Route path="*" element={<Navigate to="/dashboard" />} />
        </Routes>
    );
};