import React, { FC } from 'react';
import { useRecoilCallback, useRecoilValue } from 'recoil';
import { TextField } from '@mui/material';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import produce from 'immer';
import { dialogPropsState } from '../../../states/dialog';

const Component: FC = () => {
  const props = useRecoilValue(dialogPropsState);

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
        renderInput={(props) => <TextField {...props} />}
        label='開始日時'
        inputFormat='yyyy/MM/dd hh:mm a'
        value={props.event.start}
        onChange={onStartChange}
      />
      <DateTimePicker
        renderInput={(props) => <TextField {...props} />}
        label='終了日時'
        inputFormat='yyyy/MM/dd hh:mm a'
        value={props.event.end}
        onChange={onEndChange}
      />
    </div>
  );
};

export default Component;
