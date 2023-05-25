import { InputAdornment, MenuItem, TextField, TextFieldProps } from '@mui/material';
import { useField } from '@unform/core';
import { useEffect, useState } from 'react';
import { undDeMedidas } from '../data/undDeMedidas';

type TUTextField = TextFieldProps & {
    name: string;
    initialValue?: number | string;
    endAdornment?: string;
    select?: boolean;
}

export const UTextField = ({ select = false, initialValue = '', name, endAdornment, ...rest }: TUTextField) => {
    //console.log(`renderizou VTextField ${name}`);
    const { clearError, defaultValue, error, fieldName, registerField } = useField(name);

    const [value, setValue] = useState(defaultValue || initialValue);

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
            InputProps={{
                endAdornment: <InputAdornment position="end">{endAdornment}</InputAdornment>,
            }}
            size='small'
            select={select}
        >
            {select && undDeMedidas.map((option) => (
                <MenuItem key={option.value} value={option.value}>
                    {option.label}
                </MenuItem>
            ))}
        </TextField>
    );
};