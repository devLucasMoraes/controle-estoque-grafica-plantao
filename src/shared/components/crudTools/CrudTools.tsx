import { Box, Button, Input, Typography, useMediaQuery, useTheme } from '@mui/material';
import { Delete, Download, Edit, Info, Save } from '@mui/icons-material';

interface IDetailToolsProps {
    mostrarBotaoSalvar?: boolean;
    mostrarBotaoDetalhar?: boolean;
    mostrarBotaoEditar?: boolean;
    mostrarBotaoApagar?: boolean;
    mostrarBotaoImportarXML?: boolean;
    aoClicaeEmSalvar?: () => void;
    aoClicaeEmDetalhar?: () => void;
    aoClicaeEmEditar?: () => void;
    aoClicaeEmApagar?: () => void;
    aoAlternarArquivo?: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export const CrudTools = ({
    mostrarBotaoSalvar = false,
    mostrarBotaoDetalhar = false,
    mostrarBotaoEditar = false,
    mostrarBotaoApagar = false,
    mostrarBotaoImportarXML = false,
    aoClicaeEmSalvar,
    aoClicaeEmDetalhar,
    aoClicaeEmEditar,
    aoClicaeEmApagar,
    aoAlternarArquivo
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

            {mostrarBotaoImportarXML &&
                <Button
                    color='primary'
                    variant='outlined'
                    component='label'
                    startIcon={!smDown ? <Download /> : ''}
                >
                    {smDown &&
                        <Download />
                    }
                    {!smDown &&
                        <Typography variant='button' whiteSpace='nowrap' textOverflow='ellipsis' overflow='hidden'>
                            IMPORTAR XML
                        </Typography>
                    }
                    <Input 
                        inputProps={{ accept: '.xml' }} 
                        type='file' 
                        sx={{ display: 'none' }} 
                        onChange={aoAlternarArquivo}
                    />
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