import { Add, Remove } from '@mui/icons-material';
import { Button, Typography, useMediaQuery, useTheme } from '@mui/material';

interface IItensListToolsProps {
    mostrarBotaoAdicionar?: boolean;
    mostrarBotaoRemover?: boolean;
    aoClicarEmAdicionar?: () => void;
    aoClicarEmRemover?: () => void;
}


export const ItensListTools = ({ mostrarBotaoAdicionar, aoClicarEmAdicionar, mostrarBotaoRemover, aoClicarEmRemover }: IItensListToolsProps) => {
    console.log('renderizou ItensListTools');

    const theme = useTheme();
    const smDown = useMediaQuery(theme.breakpoints.down('sm'));

    return (
        <>
            {mostrarBotaoAdicionar &&
                <Button
                    color='primary'
                    variant='outlined'
                    startIcon={smDown ? <Add /> : ''}
                    //sx={{ py: 1.75 }}
                    onClick={aoClicarEmAdicionar}
                >
                    {!smDown &&
                        <Add />
                    }
                    {smDown &&
                        <Typography variant='button' whiteSpace='nowrap' textOverflow='ellipsis' overflow='hidden'>
                            ADICIONAR
                        </Typography>
                    }
                </Button>
            }
            {mostrarBotaoRemover &&
                <Button
                    color='error'
                    variant='outlined'
                    startIcon={smDown ? <Remove /> : ''}
                    //sx={{ py: 1.75 }}
                    onClick={aoClicarEmRemover}
                >
                    {!smDown &&
                        <Remove />
                    }
                    {smDown &&
                        <Typography variant='button' whiteSpace='nowrap' textOverflow='ellipsis' overflow='hidden'>
                            REMOVER
                        </Typography>
                    }
                </Button>
            }
        </>

    );
};