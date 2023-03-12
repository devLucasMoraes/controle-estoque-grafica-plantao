import { Button } from '@mui/material';
import { useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useDrawerContext } from '../shared/contexts';

export const AppRoutes = () => {


    const { toggleDrawerOpen, setDrawerOptions } = useDrawerContext();

    useEffect(() => {
        setDrawerOptions([
            {
                label: 'Dashboard',
                icon: 'dashboard',
                path: '/dashboard'
            }
        ]);
    }, []);


    return (
        <Routes>
            <Route path="/dashboard" element={<Button variant='contained' color='primary' onClick={toggleDrawerOpen}>Teste</Button>} />
            <Route path="*" element={<Navigate to="/dashboard" />} />
        </Routes>
    );
};