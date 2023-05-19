import { Box, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Grid, Paper, Button, Typography } from '@mui/material';
import { Close, Save } from '@mui/icons-material';
import { Form } from '@unform/web';
import { useRef, useState } from 'react';
import * as yup from 'yup';
import { IUFormErros, UTextField } from '../../forms';
import { FormHandles } from '@unform/core';
import { ITransportadoraFormData, TransportadorasService } from '../../services/api/transportadoras/TransportadorasService';

const formValidationSchema: yup.ObjectSchema<Omit<ITransportadoraFormData, 'id'>> = yup.object().shape({
    nome_fantasia: yup.string().required(),
    razao_social: yup.string().required(),
    cnpj: yup.string().required(),
    fone: yup.string().required(),
});
interface INovaTransportadoraDialog {
    aoFecharOuSalvar: (fieldName: string, id?: number) => void;
    initialTransportadoraFileData?: Omit<ITransportadoraFormData, 'id'>;
}

export const NovaTransportadoraDialog = ({ aoFecharOuSalvar, initialTransportadoraFileData }: INovaTransportadoraDialog) => {
    console.log('renderizou NovaTransportadoraDialog');

    const formRef = useRef<FormHandles>(null);

    const [open, setOpen] = useState(true);

    const hadleClose = (id?: number): void => {
        setOpen(false);
        aoFecharOuSalvar('transportadora_id', id);
    };

    const handleSave = (dados: Omit<ITransportadoraFormData, 'id'>) => {
        formValidationSchema
            .validate(dados, { abortEarly: false })
            .then(dadosValidados => {
                TransportadorasService
                    .create(dadosValidados)
                    .then(result => {
                        if (result instanceof Error) {
                            alert(result.message);
                        } else {
                            hadleClose(result);
                        }
                    });
            })
            .catch((erros: yup.ValidationError) => {
                const validationErrors: IUFormErros = {};
                erros.inner.forEach(error => {
                    if (!error.path) return;
                    validationErrors[error.path] = error.message;
                });
                formRef.current?.setErrors(validationErrors);
            });
    };

    return (
        <Dialog open={open} onClose={() => hadleClose()}>
            <DialogTitle>Transportadora informada na NFe não encontrada</DialogTitle>
            <DialogContent>
                <DialogContentText>
                    Deseja cadastrar uma nova transportadora com os seguintes dados encontrados na nota fiscal?
                </DialogContentText>
                <Form ref={formRef} onSubmit={dados => handleSave(dados)} initialData={initialTransportadoraFileData}>
                    <Box component={Paper} display='flex' flexDirection='column' variant='outlined' alignItems='center' justifyContent='center'>
                        <Grid container direction='column' spacing={2} padding={4}>
                            <Grid item marginBottom={2}>
                                <UTextField
                                    label='Nome'
                                    fullWidth
                                    placeholder='Nome'
                                    name='nome_fantasia'
                                />
                            </Grid>

                            <Grid item marginBottom={2}>
                                <UTextField
                                    label='Razão social'
                                    fullWidth
                                    placeholder='razão social'
                                    name='razao_social'
                                />
                            </Grid>

                            <Grid item marginBottom={2}>
                                <UTextField
                                    label='CNPJ'
                                    fullWidth
                                    placeholder='CNPJ'
                                    name='cnpj'
                                />
                            </Grid>

                            <Grid item marginBottom={2}>
                                <UTextField
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
                    onClick={() => hadleClose()}
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