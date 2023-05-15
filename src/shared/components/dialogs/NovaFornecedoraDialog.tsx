import { Dialog, DialogTitle } from '@mui/material';
import { useState } from 'react';

export const NovaFornecedoraDialog = () => {
    const [open, setOpen] = useState(true);

    const hadleClose = (): void => {
        setOpen(false);
    };

    return (
        <Dialog open={open} onClose={hadleClose}>
            <DialogTitle>Fornecedora informada na NFe não esta cadastrada</DialogTitle>
        </Dialog>
    );
};