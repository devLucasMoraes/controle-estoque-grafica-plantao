import { createTheme } from '@mui/material/styles';

export const DarkTheme = createTheme({
    palette: {
        mode: 'dark',
        primary: {
            main: '#2c83d4',
        },
        secondary: {
            main: '#f50057',
        },
        background: {
            paper: '#1f1f1f',
            default: '#3c3c3c',
        }
    },
    typography: {
        h1: {
            color: 'white'
        },
        h2: {
            color: 'white'
        },
        h3: {
            color: 'white'
        },
        h4: {
            color: 'white'
        },
        h5: {
            color: 'white'
        },
        h6: {
            color: 'white'
        }
    }
});