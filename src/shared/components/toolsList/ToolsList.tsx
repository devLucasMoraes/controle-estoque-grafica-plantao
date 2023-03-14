import { Box, Button, Icon, TextField, useTheme } from '@mui/material';
import { Environment } from '../../environment';


interface IToolsListProps {
    textoDaBusca?: string;
    mostrarInputBusca?: boolean;
    textoBotaoNovo?: string;
    mostrarBotaoNovo?: boolean;
    aoMudarTextDeBusca?: (novoTexto: string) => void;
    aoClicarEmNovo?: () => void;
}

export const ToolsList: React.FC<IToolsListProps> = ({
    mostrarInputBusca = false,
    textoDaBusca = '',
    textoBotaoNovo = 'Criar novo',
    mostrarBotaoNovo = true,
    aoMudarTextDeBusca,
    aoClicarEmNovo
}) => {

    const theme = useTheme();

    return (
        <Box
            height={theme.spacing(5)}
            display='flex'
            gap={1}
            alignItems='center'
        >
            {mostrarInputBusca && (
                <TextField
                    sx={{ width: '50%' }}
                    size='small'
                    variant='standard'
                    placeholder={Environment.INPUT_DE_BUSCA}
                    value={textoDaBusca}
                    onChange={(e) => aoMudarTextDeBusca?.(e.target.value)}
                />
            )}

            <Box flex={1} display='flex' justifyContent='end'>
                {mostrarBotaoNovo && (
                    <Button
                        sx={{ px: 4 }}
                        color='primary'
                        variant='contained'
                        startIcon={<Icon>add</Icon>}
                        onClick={aoClicarEmNovo}
                    >{textoBotaoNovo}</Button>)}
            </Box>

        </Box>

    );
};