import { Category, Factory, ImportExport, Inventory, LineAxis, LocalShipping, Man, Person, Place } from '@mui/icons-material';
import { Suspense, lazy, useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useDrawerContext } from '../shared/contexts';
import { LinearProgress } from '@mui/material';


const LazyDashboard = lazy(() =>
    import('../pages/dashboard/Dashboard').then((module) => ({
        default: module.Dashboard
    }))
);
const LazyListagemDeUsers = lazy(() =>
    import('../pages/users/ListagemDeUsers').then((module) => ({
        default: module.ListagemDeUsers
    }))
);
const LazyEditarUser = lazy(() =>
    import('../pages/users/EditarUser').then((module) => ({
        default: module.EditarUser
    }))
);
const LazyDetalharUser = lazy(() =>
    import('../pages/users/DetalharUser').then((module) => ({
        default: module.DetalharUser
    }))
);
const LazyListagemDeCategorias = lazy(() =>
    import('../pages/categorias/ListagemDeCategorias').then((module) => ({
        default: module.ListagemDeCategorias
    }))
);
const LazyEdicaoOuCriacaoDeCategoria = lazy(() =>
    import('../pages/categorias/EdicaoOuCriacaoDeCategoria').then((module) => ({
        default: module.EdicaoOuCriacaoDeCategoria
    }))
);
const LazyDetalhamentoDeCategoria = lazy(() =>
    import('../pages/categorias/DetalhamentoDeCategoria').then((module) => ({
        default: module.DetalhamentoDeCategoria
    }))
);
const LazyListagemDeMateriais = lazy(() =>
    import('../pages/materiais/ListagemDeMateriais').then((module) => ({
        default: module.ListagemDeMateriais
    }))
);
const LazyEdicaoOuCriacaoDeMaterial = lazy(() =>
    import('../pages/materiais/EdicaoOuCriacaoDeMaterial').then((module) => ({
        default: module.EdicaoOuCriacaoDeMaterial
    }))
);
const LazyDetalhamentoDeMaterial = lazy(() =>
    import('../pages/materiais/DetalhamentoDeMaterial').then((module) => ({
        default: module.DetalhamentoDeMaterial
    }))
);
const LazyListagemDeFornecedoras = lazy(() =>
    import('../pages/fornecedoras/ListagemDeFornecedoras').then((module) => ({
        default: module.ListagemDeFornecedoras
    }))
);
const LazyEdicaoOuCriacaoDeFornecedora = lazy(() =>
    import('../pages/fornecedoras/EdicaoOuCriacaoDeFornecedora').then((module) => ({
        default: module.EdicaoOuCriacaoDeFornecedora
    }))
);
const LazyDetalhamentoDeFornecedora = lazy(() =>
    import('../pages/fornecedoras/DetalhamentoDeFornecedora').then((module) => ({
        default: module.DetalhamentoDeFornecedora
    }))
);
const LazyListagemDeTransportadoras = lazy(() =>
    import('../pages/transportadoras/ListagemDeTransportadoras').then((module) => ({
        default: module.ListagemDeTransportadoras
    }))
);
const LazyEdicaoOuCriacaoDeTransportadora = lazy(() =>
    import('../pages/fornecedoras/EdicaoOuCriacaoDeFornecedora').then((module) => ({
        default: module.EdicaoOuCriacaoDeFornecedora
    }))
);
const LazyDetalhamentoDeTransportadora = lazy(() =>
    import('../pages/fornecedoras/DetalhamentoDeFornecedora').then((module) => ({
        default: module.DetalhamentoDeFornecedora
    }))
);
const LazyListagemDeRequisitantes = lazy(() =>
    import('../pages/requisitantes/ListagemDeRequisitantes').then((module) => ({
        default: module.ListagemDeRequisitantes
    }))
);
const LazyEditarRequisitantes = lazy(() =>
    import('../pages/requisitantes/EditarRequisitantes').then((module) => ({
        default: module.EditarRequisitantes
    }))
);
const LazyDetalharRequisitantes = lazy(() =>
    import('../pages/requisitantes/DetalharRequisitantes').then((module) => ({
        default: module.DetalharRequisitantes
    }))
);
const LazyListagemDeDestinos = lazy(() =>
    import('../pages/destinos/ListagemDeDestinos').then((module) => ({
        default: module.ListagemDeDestinos
    }))
);
const LazyEditarDestinos = lazy(() =>
    import('../pages/destinos/EditarDestinos').then((module) => ({
        default: module.EditarDestinos
    }))
);
const LazyDetalharDestinos = lazy(() =>
    import('../pages/destinos/DetalharDestinos').then((module) => ({
        default: module.DetalharDestinos
    }))
);
const LazyListagemDeTransacoesEntrada = lazy(() =>
    import('../pages/transacoesEntrada/ListagemDeTransacoesEntrada').then((module) => ({
        default: module.ListagemDeTransacoesEntrada
    }))
);
const LazyEdicaoOuCriacaoDeTransacoesEntrada = lazy(() =>
    import('../pages/transacoesEntrada/EdicaoOuCriacaoDeTransacoesEntrada').then((module) => ({
        default: module.EdicaoOuCriacaoDeTransacoesEntrada
    }))
);
const LazyDetalhamentoDeTransacoesEntrada = lazy(() =>
    import('../pages/transacoesEntrada/DetalhamentoDeTransacoesEntrada').then((module) => ({
        default: module.DetalhamentoDeTransacoesEntrada
    }))
);
const LazyListagemDeTransacoesSaida = lazy(() =>
    import('../pages/transacoesSaida/ListagemDeTransacoesSaida').then((module) => ({
        default: module.ListagemDeTransacoesSaida
    }))
);
const LazyEditarTransacoesSaida = lazy(() =>
    import('../pages/transacoesSaida/EditarTransacoesSaida').then((module) => ({
        default: module.EditarTransacoesSaida
    }))
);
const LazyDetalharTransacoesSaida = lazy(() =>
    import('../pages/transacoesSaida/DetalharTransacoesSaida').then((module) => ({
        default: module.DetalharTransacoesSaida
    }))
);



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
                group: ''
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
        <Suspense fallback={<LinearProgress />}>
            <Routes>
                <Route path="/dashboard" element={<LazyDashboard />} />

                <Route path="/users" element={<LazyListagemDeUsers />} />
                <Route path='/users/records/edit/:id' element={<LazyEditarUser />} />
                <Route path='/users/records/show/:id' element={<LazyDetalharUser />} />
                <Route path='/users/records/:id' element={<LazyEditarUser />} />

                <Route path="/categorias" element={<LazyListagemDeCategorias />} />
                <Route path='/categorias/records/edit/:id' element={<LazyEdicaoOuCriacaoDeCategoria />} />
                <Route path='/categorias/records/show/:id' element={<LazyDetalhamentoDeCategoria />} />
                <Route path='/categorias/records/:id' element={<LazyEdicaoOuCriacaoDeCategoria />} />

                <Route path="/materiais" element={<LazyListagemDeMateriais />} />
                <Route path='/materiais/records/edit/:id' element={<LazyEdicaoOuCriacaoDeMaterial />} />
                <Route path='/materiais/records/show/:id' element={<LazyDetalhamentoDeMaterial />} />
                <Route path='/materiais/records/:id' element={<LazyEdicaoOuCriacaoDeMaterial />} />

                <Route path="/fornecedoras" element={<LazyListagemDeFornecedoras />} />
                <Route path='/fornecedoras/records/edit/:id' element={<LazyEdicaoOuCriacaoDeFornecedora />} />
                <Route path='/fornecedoras/records/show/:id' element={<LazyDetalhamentoDeFornecedora />} />
                <Route path='/fornecedoras/records/:id' element={<LazyEdicaoOuCriacaoDeFornecedora />} />

                <Route path="/transportadoras" element={<LazyListagemDeTransportadoras />} />
                <Route path='/transportadoras/records/edit/:id' element={<LazyEdicaoOuCriacaoDeTransportadora />} />
                <Route path='/transportadoras/records/show/:id' element={<LazyDetalhamentoDeTransportadora />} />
                <Route path='/transportadoras/records/:id' element={<LazyEdicaoOuCriacaoDeTransportadora />} />

                <Route path="/requisitantes" element={<LazyListagemDeRequisitantes />} />
                <Route path='/requisitantes/records/edit/:id' element={<LazyEditarRequisitantes />} />
                <Route path='/requisitantes/records/show/:id' element={<LazyDetalharRequisitantes />} />
                <Route path='/requisitantes/records/:id' element={<LazyEditarRequisitantes />} />

                <Route path="/destinos" element={<LazyListagemDeDestinos />} />
                <Route path='/destinos/records/edit/:id' element={<LazyEditarDestinos />} />
                <Route path='/destinos/records/show/:id' element={<LazyDetalharDestinos />} />
                <Route path='/destinos/records/:id' element={<LazyEditarDestinos />} />

                <Route path="/transacoes_entrada" element={<LazyListagemDeTransacoesEntrada />} />
                <Route path='/transacoes_entrada/records/edit/:id' element={<LazyEdicaoOuCriacaoDeTransacoesEntrada />} />
                <Route path='/transacoes_entrada/records/show/:id' element={<LazyDetalhamentoDeTransacoesEntrada />} />
                <Route path='/transacoes_entrada/records/:id' element={<LazyEdicaoOuCriacaoDeTransacoesEntrada />} />

                <Route path="/transacoes_saida" element={<LazyListagemDeTransacoesSaida />} />
                <Route path='/transacoes_saida/records/edit/:id' element={<LazyEditarTransacoesSaida />} />
                <Route path='/transacoes_saida/records/show/:id' element={<LazyDetalharTransacoesSaida />} />
                <Route path='/transacoes_saida/records/:id' element={<LazyEditarTransacoesSaida />} />

                <Route path="*" element={<Navigate to="/dashboard" />} />
            </Routes>

        </Suspense>
    );
};