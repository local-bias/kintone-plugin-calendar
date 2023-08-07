import React, { FC, memo } from 'react';
import { useRecoilCallback, useRecoilValue } from 'recoil';
import { TextField } from '@mui/material';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import { produce } from 'immer';
import { dialogPropsState } from '../../../states/dialog';
import { PluginCalendarEvent } from '../../../states/calendar';

const Component: FC<{ start: PluginCalendarEvent['start']; end: PluginCalendarEvent['end'] }> =
  memo((props) => {
    const onStartChange = useRecoilCallback(
      ({ set }) =>
        (date: any) => {
          set(dialogPropsState, (current) =>
            produce(current, (draft) => {
              draft.event.start = date;
            })
          );
        },
      []
    );

    const onEndChange = useRecoilCallback(
      ({ set }) =>
        (date: any) => {
          set(dialogPropsState, (current) =>
            produce(current, (draft) => {
              draft.event.end = date;
            })
          );
        },
      []
    );

    return (
      <div>
        <DateTimePicker
          ampm={false}
          renderInput={(props) => <TextField {...props} />}
          label='開始日時'
          inputFormat='yyyy/MM/dd HH:mm'
          value={props.start}
          onChange={onStartChange}
        />
        <DateTimePicker
          ampm={false}
          renderInput={(props) => <TextField {...props} />}
          label='終了日時'
          inputFormat='yyyy/MM/dd HH:mm'
          value={props.end}
          onChange={onEndChange}
        />
      </div>
    );
  });

const Container: FC = () => {
  const props = useRecoilValue(dialogPropsState);
  return <Component start={props.event.start} end={props.event.end} />;
};

export default Container;
