import { Box, Button, Divider, Icon, useTheme } from '@mui/material';

export const DetailTools: React.FC = () => {

    const theme = useTheme();

    return (
        <Box
            height={theme.spacing(5)}
            display='flex'
            gap={1}
            alignItems='center'
        >
            <Button
                color='primary'
                variant='contained'
                startIcon={<Icon>save</Icon>}
            >SALVAR</Button>

            <Button
                color='primary'
                variant='outlined'
                startIcon={<Icon>info</Icon>}
            >DETALHAR</Button>
            <Button
                color='primary'
                variant='outlined'
                startIcon={<Icon>edit</Icon>}
            >EDITAR</Button>

            <Button
                color='error'
                variant='contained'
                startIcon={<Icon>delete</Icon>}
            >APAGAR</Button>

            <Divider variant='middle' orientation='vertical' />

            <Button
                color='primary'
                variant='outlined'
                startIcon={<Icon>arrow_back</Icon>}
            >VOLTAR</Button>
        </Box>
    );
};