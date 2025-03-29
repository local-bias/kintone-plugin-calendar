import {
  DateTimePickerProps,
  LocalizationProvider,
  DateTimePicker as MUIDateTimePicker,
} from '@mui/x-date-pickers';
import { AdapterLuxon } from '@mui/x-date-pickers/AdapterLuxon';
import { DateTime } from 'luxon';
import { FCX } from 'react';

type Props = Omit<DateTimePickerProps<DateTime>, 'renderInput' | 'mask'>;

const Component: FCX<Props> = ({ className, ...others }) => (
  <LocalizationProvider dateAdapter={AdapterLuxon} adapterLocale={'ja'}>
    <div {...{ className }}>
      <MUIDateTimePicker {...others} />
    </div>
  </LocalizationProvider>
);

export const DateTimePicker = Component;
