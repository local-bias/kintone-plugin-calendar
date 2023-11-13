import React, { FCX } from 'react';
import { AdapterLuxon } from '@mui/x-date-pickers/AdapterLuxon';
import {
  DatePicker as MUIDatePicker,
  DatePickerProps,
  LocalizationProvider,
} from '@mui/x-date-pickers';
import { DateTime } from 'luxon';

type Props = Omit<DatePickerProps<DateTime>, 'renderInput' | 'mask'>;

const Component: FCX<Props> = ({ className, ...others }) => (
  <LocalizationProvider dateAdapter={AdapterLuxon} adapterLocale={'ja'}>
    <div {...{ className }}>
      <MUIDatePicker {...others} />
    </div>
  </LocalizationProvider>
);

export const DatePicker = Component;
