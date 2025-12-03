import { dateInputToDateTime, dateTimeToDateInput } from '@/desktop/actions';
import { isTimeSupportedAtom } from '@/desktop/states/plugin';
import { DatePicker } from '@/lib/components/date-picker';
import { DateTimePicker } from '@/lib/components/datetime-picker';
import { produce } from 'immer';
import { atom, useAtomValue, useSetAtom } from 'jotai';
import { DateTime } from 'luxon';
import { FC } from 'react';
import { dialogAllDayAtom, dialogPropsAtom } from '../../../states/dialog';
import { PickerValue } from '@mui/x-date-pickers/internals';

const handleStartChangeAtom = atom(null, async (get, set, date: PickerValue) => {
  set(dialogPropsAtom, (current) =>
    produce(current, (draft) => {
      if (date instanceof DateTime) {
        draft.event.start = dateTimeToDateInput(date);
      } else {
        draft.event.start = undefined;
      }
    })
  );
});

const handleEndChangeAtom = atom(null, async (get, set, date: PickerValue) => {
  set(dialogPropsAtom, (current) =>
    produce(current, (draft) => {
      if (date instanceof DateTime) {
        draft.event.end = dateTimeToDateInput(date);
      } else {
        draft.event.end = undefined;
      }
    })
  );
});

const DateEnd: FC = () => {
  const props = useAtomValue(dialogPropsAtom);
  const allDay = useAtomValue(dialogAllDayAtom);
  const isTimeSupported = useAtomValue(isTimeSupportedAtom);
  const onEndChange = useSetAtom(handleEndChangeAtom);

  if (!isTimeSupported || allDay) {
    return (
      <DatePicker
        label='終了日'
        value={props.event.end ? dateInputToDateTime(props.event.end) : DateTime.local()}
        onChange={onEndChange}
      />
    );
  }

  return (
    <DateTimePicker
      ampm={false}
      label='終了日時'
      value={props.event.end ? dateInputToDateTime(props.event.end) : DateTime.local()}
      onChange={onEndChange}
    />
  );
};

const DateStart: FC = () => {
  const { event } = useAtomValue(dialogPropsAtom);
  const allDay = useAtomValue(dialogAllDayAtom);
  const isTimeSupported = useAtomValue(isTimeSupportedAtom);
  const onStartChange = useSetAtom(handleStartChangeAtom);

  if (!isTimeSupported || allDay) {
    return (
      <DatePicker
        label='開始日'
        value={event.start ? dateInputToDateTime(event.start) : DateTime.local()}
        onChange={onStartChange}
      />
    );
  }

  return (
    <DateTimePicker
      ampm={false}
      label='開始日時'
      value={event.start ? dateInputToDateTime(event.start) : DateTime.local()}
      onChange={onStartChange}
    />
  );
};

const Container: FC = () => {
  return (
    <div>
      <DateStart />
      <DateEnd />
    </div>
  );
};

export default Container;
