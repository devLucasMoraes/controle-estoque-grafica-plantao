import { Add, PriorityHigh, Remove } from '@mui/icons-material';
import { Button, Typography, useMediaQuery, useTheme } from '@mui/material';

interface IItensListToolsProps {
    mostrarBotaoAdicionar?: boolean;
    mostrarBotaoRemover?: boolean;
    mostrarBotaoVincular?: boolean;
    aoClicarEmAdicionar?: () => void;
    aoClicarEmRemover?: () => void;
    aoClicarEmVincular?: () => void;
}

export const ItensListTools = ({
    mostrarBotaoAdicionar,
    mostrarBotaoRemover,
    mostrarBotaoVincular,
    aoClicarEmAdicionar,
    aoClicarEmRemover,
    aoClicarEmVincular
}: IItensListToolsProps) => {
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
            {mostrarBotaoVincular &&
                <Button
                    color='error'
                    variant='outlined'
                    startIcon={smDown ? <PriorityHigh /> : ''}
                    //sx={{ py: 1.75 }}
                    onClick={aoClicarEmRemover}
                >
                    {!smDown &&
                        <PriorityHigh />
                    }
                    {smDown &&
                        <Typography variant='button' whiteSpace='nowrap' textOverflow='ellipsis' overflow='hidden'>
                            VINCULAR
                        </Typography>
                    }
                </Button>
            }
        </>

    );
};