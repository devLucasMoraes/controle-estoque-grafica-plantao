import { DragHandle } from '@mui/icons-material';
import { Grid, TextField } from '@mui/material';
import { ItensListTools } from '../../../shared/components';

export const ListaUnidadesConvertidas = () => {

    function handleAdicionar(): void {
        throw new Error('Function not implemented.');
    }

    return (
        <Grid container spacing={2} alignItems={'center'}>
            <Grid item xs={2}>
                <TextField
                    fullWidth
                    label='Quantidade'
                    placeholder='quantidade'
                />
            </Grid>

            <Grid item xs={2}>
                <TextField
                    fullWidth
                    label='Unidade XML/NFe'
                    placeholder='unidade XML/NFe'
                />
            </Grid>

            <Grid item >
                <DragHandle color='primary' />
            </Grid>

            <Grid item>
                <TextField
                    fullWidth
                    label='Quantidade'
                    placeholder='quantidade'
                />
            </Grid>

            <Grid item xs={2}>
                <TextField
                    fullWidth
                    label='Unidade da Categoria'
                    placeholder='unidade da categoria'
                />
            </Grid>
            
            <Grid item >
                <ItensListTools
                    mostrarBotaoAdicionar
                    aoClicarEmAdicionar={() => handleAdicionar()}
                />
            </Grid>
        </Grid>
    );
};