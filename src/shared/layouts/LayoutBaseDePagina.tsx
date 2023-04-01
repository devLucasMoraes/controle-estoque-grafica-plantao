import { ChevronLeft } from '@mui/icons-material';
import { Box, IconButton, Typography, useMediaQuery, useTheme } from '@mui/material';
import { memo, ReactNode } from 'react';

interface ILayoutBaseDePaginaProps {
    children: React.ReactNode;
    titulo: string;
    tools?: ReactNode;
    mostrarBotaoVoltar?: boolean;
    totalCount?: number;
    aoClicaeEmVoltar?: () => void;
}

const LayoutBaseDePaginaMemo = ({ children, titulo, tools, mostrarBotaoVoltar = false, totalCount, aoClicaeEmVoltar }: ILayoutBaseDePaginaProps) => {

    const theme = useTheme();
    const smDown = useMediaQuery(theme.breakpoints.down('sm'));
    const mdDown = useMediaQuery(theme.breakpoints.down('md'));

    return (
        <Box display='flex' flexDirection='column' gap={1} padding={smDown ? 1 : 3}>
            <Box display='flex' alignItems='center' justifyContent='space-between' height={theme.spacing(smDown ? 6 : mdDown ? 8 : 12)} gap={1}>
                <Box display='flex' gap={1} justifyContent='center' alignItems='center'>
                    {mostrarBotaoVoltar && (
                        <IconButton color='primary' size='small' onClick={aoClicaeEmVoltar}>
                            <ChevronLeft fontSize='large' />
                        </IconButton>
                    )}

                    <Typography
                        variant='h4'
                        overflow='hiden'
                        noWrap
                    >
                        {titulo}
                    </Typography>
                    <Box
                        fontSize={theme.spacing(3)}
                        color='primary.main'
                    >
                        {totalCount}
                    </Box>
                </Box>

                {tools && (
                    <Box overflow='hidden'>
                        {tools}
                    </Box>
                )}
            </Box >


            <Box
                overflow='auto'
                width='100%'
                height='75vh'
            >
                {children}
            </Box>
        </Box >
    );
};

export const LayoutBaseDePagina = memo(LayoutBaseDePaginaMemo);