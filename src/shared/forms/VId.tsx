import { TextField, TextFieldProps } from '@mui/material';
import { useField } from '@unform/core';
import { useEffect, useState } from 'react';

interface IVId {
    name: string;
    initialValue?: any;
}

export const VId = ({ initialValue, name }: IVId) => {
    //console.log(`renderizou VTextField ${name}`);

    const { fieldName, registerField } = useField(name);
    const [value, setValue] = useState(initialValue || '');

    useEffect(() => {
        registerField({
            name: fieldName,
            getValue: () => value,
            setValue: (_, newValue) => setValue(newValue)
        });
    }, [registerField, fieldName, value]);

    return (
        <></>
    );
};