import { dateInputToDateTime, dateTimeToDateInput } from '@/desktop/actions';
import { hasEndTimeAtom, hasStartTimeAtom } from '@/desktop/states/plugin';
import { DatePicker } from '@/lib/components/date-picker';
import { DateTimePicker } from '@/lib/components/datetime-picker';
import { produce } from 'immer';
import { atom, useAtomValue, useSetAtom } from 'jotai';
import { DateTime } from 'luxon';
import { FC } from 'react';
import { dialogPropsAtom } from '../../../states/dialog';

const handleStartChangeAtom = atom(null, async (get, set, date: DateTime | null) => {
  set(dialogPropsAtom, (current) =>
    produce(current, (draft) => {
      if (date) {
        draft.event.start = dateTimeToDateInput(date);
      }
    })
  );
});

const handleEndChangeAtom = atom(null, async (get, set, date: DateTime | null) => {
  set(dialogPropsAtom, (current) =>
    produce(current, (draft) => {
      if (date) {
        draft.event.end = dateTimeToDateInput(date);
      }
    })
  );
});

const DateEnd: FC = () => {
  const props = useAtomValue(dialogPropsAtom);
  const hasEndTime = useAtomValue(hasEndTimeAtom);
  const onEndChange = useSetAtom(handleEndChangeAtom);

  return (
    <>
      {hasEndTime ? (
        <DateTimePicker
          ampm={false}
          label='終了日時'
          value={props.event.end ? dateInputToDateTime(props.event.end) : DateTime.local()}
          onChange={onEndChange}
        />
      ) : (
        <DatePicker
          label='終了日'
          value={props.event.end ? dateInputToDateTime(props.event.end) : DateTime.local()}
          onChange={onEndChange}
        />
      )}
    </>
  );
};

const DateStart: FC = () => {
  const { event } = useAtomValue(dialogPropsAtom);
  const hasStartTime = useAtomValue(hasStartTimeAtom);
  const onStartChange = useSetAtom(handleStartChangeAtom);

  return (
    <>
      {hasStartTime ? (
        <DateTimePicker
          ampm={false}
          label='開始日時'
          value={event.start ? dateInputToDateTime(event.start) : DateTime.local()}
          onChange={onStartChange}
        />
      ) : (
        <DatePicker
          label='開始日'
          value={event.start ? dateInputToDateTime(event.start) : DateTime.local()}
          onChange={onStartChange}
        />
      )}
    </>
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
