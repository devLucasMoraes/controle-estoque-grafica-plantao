import dayjs, { Dayjs } from 'dayjs';
import 'dayjs/locale/pt-br';
import { DatePicker, DatePickerProps, DateValidationError, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { useField } from '@unform/core';
import { useEffect, useMemo, useState } from 'react';

interface IUDatePickerProps extends DatePickerProps<Dayjs> {
    name: string;
}

export const UDatePicker = ({ name, ...rest }: IUDatePickerProps) => {

    const { defaultValue, fieldName, registerField } = useField(name);

    const timeElapsed = Date.now();
    const today = new Date(timeElapsed);

    const [value, setValue] = useState<Dayjs | null>(dayjs(today) || '');
    const [error, setError] = useState<DateValidationError | null>(null);

    const errorMessage = useMemo(() => {
        switch (error) {
        case 'maxDate':
        case 'minDate': {
            return 'Please select a date in the first quarter of 2022';
        }
        case 'invalidDate': {
            return 'Digite uma data valida';
        }
        default: {
            return '';
        }
        }
    }, [error]);

    useEffect(() => {
        registerField({
            name: fieldName,
            getValue: () => value,
            setValue: (_, newValue) => setValue(dayjs(newValue))
        });
    }, [registerField, fieldName, value]);

    return (
        <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="pt-br">
            <DatePicker
                {...rest}
                onError={(newError) => setError(newError)}
                defaultValue={defaultValue}
                onChange={e => setValue(e)}
                value={value}

                slotProps={{
                    textField: {
                        helperText: errorMessage,
                    },
                }}
            />
        </LocalizationProvider>
    );
};