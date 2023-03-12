import { createTheme } from '@mui/material/styles';

export const LightTheme = createTheme({
    palette: {
        mode: 'light',
        primary: {
            main: '#2c83d4',
        },
        secondary: {
            main: '#f50057',
        },
        background: {
            default: '#f0f0f0',
        },
    },
});