import { Box, Button, Typography, useMediaQuery, useTheme } from '@mui/material';
import { Delete, Edit, Info, Save } from '@mui/icons-material';

interface IDetailToolsProps {
    mostrarBotaoSalvar?: boolean;
    mostrarBotaoDetalhar?: boolean;
    mostrarBotaoEditar?: boolean;
    mostrarBotaoApagar?: boolean;
    aoClicaeEmSalvar?: () => void;
    aoClicaeEmDetalhar?: () => void;
    aoClicaeEmEditar?: () => void;
    aoClicaeEmApagar?: () => void;
}

export const DetailTools = ({
    mostrarBotaoSalvar = false,
    mostrarBotaoDetalhar = false,
    mostrarBotaoEditar = false,
    mostrarBotaoApagar = false,
    aoClicaeEmSalvar,
    aoClicaeEmDetalhar,
    aoClicaeEmEditar,
    aoClicaeEmApagar
}: IDetailToolsProps) => {

    const theme = useTheme();
    const smDown = useMediaQuery(theme.breakpoints.down('sm'));

    return (
        <Box
            height={theme.spacing(5)}
            display='flex'
            gap={1}
            alignItems='center'
        >
            {mostrarBotaoSalvar &&
                <Button
                    color='primary'
                    variant='contained'
                    startIcon={<Save />}
                    onClick={aoClicaeEmSalvar}
                >
                    <Typography variant='button' whiteSpace='nowrap' textOverflow='ellipsis' overflow='hidden'>
                        SALVAR
                    </Typography>
                </Button>
            }

            {mostrarBotaoDetalhar &&
                <Button
                    color='primary'
                    variant='outlined'
                    startIcon={!smDown ? <Info /> : ''}
                    onClick={aoClicaeEmDetalhar}
                >
                    {smDown &&
                        <Info />
                    }
                    {!smDown &&
                        <Typography variant='button' whiteSpace='nowrap' textOverflow='ellipsis' overflow='hidden'>
                            DETALHAR
                        </Typography>
                    }
                </Button>
            }

            {mostrarBotaoEditar &&
                <Button
                    color='primary'
                    variant='outlined'
                    startIcon={!smDown ? <Edit /> : ''}
                    onClick={aoClicaeEmEditar}
                >
                    {smDown &&
                        <Edit />
                    }
                    {!smDown &&
                        <Typography variant='button' whiteSpace='nowrap' textOverflow='ellipsis' overflow='hidden'>
                            EDITAR
                        </Typography>
                    }
                </Button>
            }

            {mostrarBotaoApagar &&
                <Button
                    color='error'
                    variant='contained'
                    startIcon={!smDown ? <Delete /> : ''}
                    onClick={aoClicaeEmApagar}
                >
                    {smDown &&
                        <Delete />
                    }
                    {!smDown &&
                        <Typography variant='button' whiteSpace='nowrap' textOverflow='ellipsis' overflow='hidden'>
                            APAGAR
                        </Typography>
                    }
                </Button>
            }
        </Box>
    );
};