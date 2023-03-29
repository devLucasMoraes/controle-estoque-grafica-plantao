import { Box, Button, Icon, Typography, useMediaQuery, useTheme } from '@mui/material';

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
                    startIcon={<Icon>save</Icon>}
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
                    startIcon={!smDown ? <Icon>info</Icon> : ''}
                    onClick={aoClicaeEmDetalhar}
                >
                    {smDown &&
                        <Icon>info</Icon>
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
                    startIcon={!smDown ? <Icon>edit</Icon> : ''}
                    onClick={aoClicaeEmEditar}
                >
                    {smDown &&
                        <Icon>edit</Icon>
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
                    startIcon={!smDown ? <Icon>delete</Icon> : ''}
                    onClick={aoClicaeEmApagar}
                >
                    {smDown &&
                        <Icon>delete</Icon>
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