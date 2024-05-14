import React, { FC, memo } from 'react';
import { useRecoilCallback, useRecoilValue } from 'recoil';
import { produce } from 'immer';
import { dialogPropsState } from '../../../states/dialog';
import { PluginCalendarEvent } from '../../../states/calendar';
import { DateTimePicker } from '@/lib/components/datetime-picker';
import { DateTime } from 'luxon';
import { dateInputToDateTime, dateTimeToDateInput } from '@/desktop/actions';
import { hasEndTimeState, hasStartTimeState } from '@/desktop/states/plugin';
import { DatePicker } from '@/lib/components/date-picker';

const Component: FC<{ start: PluginCalendarEvent['start']; end: PluginCalendarEvent['end'] }> =
  memo((props) => {
    const hasStartTime = useRecoilValue(hasStartTimeState);
    const hasEndTime = useRecoilValue(hasEndTimeState);

    const onStartChange = useRecoilCallback(
      ({ set }) =>
        (date: DateTime | null) => {
          set(dialogPropsState, (current) =>
            produce(current, (draft) => {
              if (date) {
                draft.event.start = dateTimeToDateInput(date);
              }
            })
          );
        },
      []
    );

    const onEndChange = useRecoilCallback(
      ({ set }) =>
        (date: DateTime | null) => {
          set(dialogPropsState, (current) =>
            produce(current, (draft) => {
              if (date) {
                draft.event.end = dateTimeToDateInput(date);
              }
            })
          );
        },
      []
    );

    return (
      <div>
        {hasStartTime ? (
          <DateTimePicker
            ampm={false}
            label='開始日時'
            value={props.start ? dateInputToDateTime(props.start) : DateTime.local()}
            onChange={onStartChange}
          />
        ) : (
          <DatePicker
            label='開始日'
            value={props.start ? dateInputToDateTime(props.start) : DateTime.local()}
            onChange={onStartChange}
          />
        )}
        {hasEndTime ? (
          <DateTimePicker
            ampm={false}
            label='終了日時'
            value={props.end ? dateInputToDateTime(props.end) : DateTime.local()}
            onChange={onEndChange}
          />
        ) : (
          <DatePicker
            label='終了日'
            value={props.end ? dateInputToDateTime(props.end) : DateTime.local()}
            onChange={onEndChange}
          />
        )}
      </div>
    );
  });

const Container: FC = () => {
  const props = useRecoilValue(dialogPropsState);
  return <Component start={props.event.start} end={props.event.end} />;
};

export default Container;
