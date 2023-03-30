import { Box, Button, TextField, Typography, useMediaQuery, useTheme } from '@mui/material';
import { Add } from '@mui/icons-material';
import { Environment } from '../../environment';


interface IToolsListProps {
    textoDaBusca?: string;
    mostrarInputBusca?: boolean;
    textoBotaoNovo?: string;
    mostrarBotaoNovo?: boolean;
    aoMudarTextDeBusca?: (novoTexto: string) => void;
    aoClicarEmNovo?: () => void;
}

export const ToolsList = ({
    mostrarInputBusca = false,
    textoDaBusca = '',
    textoBotaoNovo = 'Criar novo',
    mostrarBotaoNovo = true,
    aoMudarTextDeBusca,
    aoClicarEmNovo
}: IToolsListProps) => {

    const theme = useTheme();
    const smDown = useMediaQuery(theme.breakpoints.down('sm'));


    return (
        <Box
            height={theme.spacing(5)}
            display='flex'
            gap={1}
            alignItems='center'
        >
            {mostrarInputBusca && !smDown && (
                <TextField
                    sx={{ width: '50%' }}
                    size='small'
                    variant='standard'
                    placeholder={Environment.INPUT_DE_BUSCA}
                    value={textoDaBusca}
                    onChange={(e) => aoMudarTextDeBusca?.(e.target.value)}
                />
            )}

            <Box display='flex' justifyContent='end' overflow='hidden'>
                {mostrarBotaoNovo && (
                    <Button
                        sx={{ px: 4 }}
                        color='primary'
                        variant='contained'
                        startIcon={!smDown ? <Add /> : ''}
                        onClick={aoClicarEmNovo}
                    >
                        {smDown &&
                            <Add />
                        }
                        {!smDown &&
                            <Typography variant='button' noWrap overflow='hidden'>
                                {textoBotaoNovo}
                            </Typography>
                        }
                    </Button>
                )}
            </Box>

        </Box>

    );
};