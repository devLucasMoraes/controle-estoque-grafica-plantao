import { BrowserRouter } from 'react-router-dom';
import './shared/forms/TraducoesYup';
import { AppRoutes } from './routes';
import { ResponsiveAppBar, MenuLateral } from './shared/components';
import { AppThemeProvider, DrawerProvider, FileHandlerProvider } from './shared/contexts';



export const App = () => {
    return (
        <AppThemeProvider>
            <DrawerProvider>
                <BrowserRouter>
                    <MenuLateral>
                        <ResponsiveAppBar />
                        <FileHandlerProvider>
                            <AppRoutes></AppRoutes>
                        </FileHandlerProvider>
                    </MenuLateral>
                </BrowserRouter>
            </DrawerProvider>
        </AppThemeProvider>
    );
};
