import { Box, Button, Icon, useTheme } from '@mui/material';

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

export const DetailTools: React.FC<IDetailToolsProps> = ({
    mostrarBotaoSalvar = false,
    mostrarBotaoDetalhar = false,
    mostrarBotaoEditar = false,
    mostrarBotaoApagar = false,
    aoClicaeEmSalvar,
    aoClicaeEmDetalhar,
    aoClicaeEmEditar,
    aoClicaeEmApagar
}) => {

    const theme = useTheme();

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
                >SALVAR</Button>
            }

            {mostrarBotaoDetalhar &&
                <Button
                    color='primary'
                    variant='outlined'
                    startIcon={<Icon>info</Icon>}
                    onClick={aoClicaeEmDetalhar}
                >DETALHAR</Button>
            }

            {mostrarBotaoEditar &&
                <Button
                    color='primary'
                    variant='outlined'
                    startIcon={<Icon>edit</Icon>}
                    onClick={aoClicaeEmEditar}
                >EDITAR</Button>
            }

            {mostrarBotaoApagar &&
                <Button
                    color='error'
                    variant='contained'
                    startIcon={<Icon>delete</Icon>}
                    onClick={aoClicaeEmApagar}
                >APAGAR</Button>
            }
        </Box>
    );
};