import { Box, Icon, IconButton, Typography, useMediaQuery, useTheme } from '@mui/material';
import { ReactNode } from 'react';

interface ILayoutBaseDePaginaProps {
    children: React.ReactNode;
    titulo: string;
    tools?: ReactNode;
    mostrarBotaoVoltar?: boolean;
    aoClicaeEmVoltar?: () => void;
}

export const LayoutBaseDePagina: React.FC<ILayoutBaseDePaginaProps> = ({ children, titulo, tools, mostrarBotaoVoltar = false, aoClicaeEmVoltar }) => {

    const theme = useTheme();
    const smDown = useMediaQuery(theme.breakpoints.down('sm'));
    const mdDown = useMediaQuery(theme.breakpoints.down('md'));

    return (
        <Box display='flex' flexDirection='column' gap={1} padding={3}>
            <Box display='flex' alignItems='center' justifyContent='space-between' height={theme.spacing(smDown ? 6 : mdDown ? 8 : 12)} gap={1}>
                <Box display='flex' gap={2}>
                    {mostrarBotaoVoltar && (
                        <IconButton color='primary' size='small' sx={{ border: 1, p: 1 }} onClick={aoClicaeEmVoltar}>
                            <Icon>arrow_back</Icon>
                        </IconButton>
                    )}

                    <Typography
                        variant='h4'
                        overflow='hiden'
                        whiteSpace='nowrap'
                        textOverflow='ellipsis'
                    >
                        {titulo}
                    </Typography>
                </Box>

                {tools && (
                    <Box  overflow='hidden'>
                        {tools}
                    </Box>
                )}
            </Box >


            <Box  overflow='auto'>
                {children}
            </Box>
        </Box >
    );
};