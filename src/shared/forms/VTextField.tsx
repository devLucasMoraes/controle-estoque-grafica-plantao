import { TextField, TextFieldProps } from '@mui/material';
import { useField } from '@unform/core';
import { useEffect, useState } from 'react';

type TVTextFieldProps = TextFieldProps & {
    name: string;
}

export const VTextField = ({ name, ...rest }: TVTextFieldProps) => {

    const { clearError, defaultValue, error, fieldName, registerField } = useField(name);
    const [value, setValue] = useState(defaultValue || '');

    useEffect(() => {
        registerField({
            name: fieldName,
            getValue: () => value,
            setValue: (_, newValue) => setValue(newValue)
        });
    }, [registerField, fieldName, value]);


    return (
        <TextField
            {...rest}
            error={!!error}
            helperText={error}
            defaultValue={defaultValue}
            onKeyDown={(e) => { error ? clearError() : undefined; rest.onKeyDown?.(e); }}
            value={value}
            onChange={e => { setValue(e.target.value); rest.onChange?.(e); }}
        />
    );
};