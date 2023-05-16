import { Box, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Grid, Paper, Button, Typography } from '@mui/material';
import { Close, Save } from '@mui/icons-material';
import { Form } from '@unform/web';
import { useRef, useState } from 'react';
import { VTextField } from '../../forms';
import { FormHandles } from '@unform/core';

interface INovaFornecedoraDialogProps {
    aoFechar: (value: React.SetStateAction<boolean>) => void;
}

export const NovaFornecedoraDialog = ({ aoFechar }: INovaFornecedoraDialogProps) => {
    console.log('renderizou NovaFornecedoraDialog');

    const formRef = useRef<FormHandles>(null);

    const [open, setOpen] = useState(true);

    const hadleClose = (): void => {
        setOpen(false);
        aoFechar(false);
    };

    function handleSave(dados: any): void {
        console.log(dados);
    }

    return (
        <Dialog open={open} onClose={hadleClose}>
            <DialogTitle>Fornecedora informada na NFe não encontrada</DialogTitle>
            <DialogContent>
                <DialogContentText>
                    Deseja cadastrar uma nova fornecedora com os seguintes dados encontrados na nota fiscal?
                </DialogContentText>
                <Form ref={formRef} onSubmit={dados => handleSave(dados)}>
                    <Box component={Paper} display='flex' flexDirection='column' variant='outlined' alignItems='center' justifyContent='center'>
                        <Grid container direction='column' spacing={2} padding={4}>
                            <Grid item marginBottom={2}>
                                <VTextField
                                    label='Nome'
                                    fullWidth
                                    placeholder='Nome'
                                    name='nome_fantasia'
                                />
                            </Grid>

                            <Grid item marginBottom={2}>
                                <VTextField
                                    label='Razão social'
                                    fullWidth
                                    placeholder='razão social'
                                    name='razao_social'
                                />
                            </Grid>

                            <Grid item marginBottom={2}>
                                <VTextField
                                    label='CNPJ'
                                    fullWidth
                                    placeholder='CNPJ'
                                    name='cnpj'
                                />
                            </Grid>

                            <Grid item marginBottom={2}>
                                <VTextField
                                    label='Telefone'
                                    fullWidth
                                    placeholder='telefone'
                                    name='fone'
                                />
                            </Grid>

                        </Grid>
                    </Box>
                </Form>
            </DialogContent>
            <DialogActions>
                <Button
                    color='error'
                    startIcon={<Close />}
                    onClick={hadleClose}
                >
                    <Typography variant='button' whiteSpace='nowrap' textOverflow='ellipsis' overflow='hidden'>
                        CANCELAR
                    </Typography>
                </Button>
                <Button
                    startIcon={<Save />}
                    onClick={() => formRef.current?.submitForm()}
                >
                    <Typography variant='button' whiteSpace='nowrap' textOverflow='ellipsis' overflow='hidden'>
                        SALVAR
                    </Typography>
                </Button>
            </DialogActions>
        </Dialog>
    );
};