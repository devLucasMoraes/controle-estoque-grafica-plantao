import { BrowserRouter } from 'react-router-dom';
import './shared/forms/TraducoesYup';
import { AppRoutes } from './routes';
import { ResponsiveAppBar, MenuLateral } from './shared/components';
import { AppThemeProvider, DrawerProvider } from './shared/contexts';



export const App = () => {
    return (
        <AppThemeProvider>
            <DrawerProvider>
                <BrowserRouter>
                    <MenuLateral>
                        <ResponsiveAppBar />
                        <AppRoutes></AppRoutes>
                    </MenuLateral>
                </BrowserRouter>
            </DrawerProvider>
        </AppThemeProvider>
    );
};
