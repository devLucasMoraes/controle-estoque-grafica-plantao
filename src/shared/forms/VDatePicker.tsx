import dayjs, { Dayjs } from 'dayjs';
import 'dayjs/locale/pt-br';
import { DatePicker, DatePickerProps, DateValidationError, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { useField } from '@unform/core';
import { useEffect, useMemo, useState } from 'react';

type TVDatePickerProps = DatePickerProps<Dayjs> & {
    name: string;
}



export const VDatePicker = ({ name, ...rest }: TVDatePickerProps) => {
    const timeElapsed = Date.now();
    const today = new Date(timeElapsed);
    const { clearError, defaultValue, fieldName, registerField } = useField(name);
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
            setValue: (_, newValue) => setValue(newValue)
        });
    }, [registerField, fieldName, value]);


    return (
        <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="pt-br">
            <DatePicker
                {...rest}
                onError={(newError) => setError(newError)}
                defaultValue={defaultValue}
                onChange={e => setValue(e) }
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