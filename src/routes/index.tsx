import { Routes, Route, Navigate } from 'react-router-dom';

export const AppRoutes = () => {
    return (
        <Routes>
            <Route path="/dashboard" element={<p>Dashboard</p>}/>
            <Route path="*" element={<Navigate to="/dashboard"/>}/>
        </Routes>
    );
};