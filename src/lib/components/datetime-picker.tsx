import React, { FCX } from 'react';
import { AdapterLuxon } from '@mui/x-date-pickers/AdapterLuxon';
import {
  DateTimePicker as MUIDateTimePicker,
  DateTimePickerProps,
  LocalizationProvider,
} from '@mui/x-date-pickers';
import { DateTime } from 'luxon';

type Props = Omit<DateTimePickerProps<DateTime>, 'renderInput' | 'mask'>;

const Component: FCX<Props> = ({ className, ...others }) => (
  <LocalizationProvider dateAdapter={AdapterLuxon} adapterLocale={'ja'}>
    <div {...{ className }}>
      <MUIDateTimePicker {...others} />
    </div>
  </LocalizationProvider>
);

export const DateTimePicker = Component;
