import { useField } from '@unform/core';
import { useEffect, useState } from 'react';

interface IUId {
    name: string;
    initialValue?: number;
}

export const UId = ({ initialValue, name }: IUId) => {
    //console.log(`renderizou VTextField ${name}`);

    const { fieldName, registerField } = useField(name);

    const [value, setValue] = useState(initialValue);

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