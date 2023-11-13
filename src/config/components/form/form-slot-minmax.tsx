import React, { FC } from 'react';
import { TextField, MenuItem } from '@mui/material';
import { useRecoilCallback, useRecoilValue } from 'recoil';
import { slotMaxTimeState, slotMinTimeState } from '@/config/states/plugin';

const Component: FC = () => {
  const slotMinTime = useRecoilValue(slotMinTimeState);
  const slotMaxTime = useRecoilValue(slotMaxTimeState);

  const onSlotMinTimeChange = useRecoilCallback(
    ({ set }) =>
      (e: React.ChangeEvent<HTMLInputElement>) => {
        set(slotMinTimeState, `${e.target.value}:00:00`);
      },
    []
  );

  const onSlotMaxTimeChange = useRecoilCallback(
    ({ set }) =>
      (e: React.ChangeEvent<HTMLInputElement>) => {
        set(slotMaxTimeState, `${e.target.value}:00:00`);
      },
    []
  );

  return (
    <div>
      <h3>表示時間帯の設定</h3>
      <TextField
        label='開始'
        select
        variant='outlined'
        color='primary'
        onChange={onSlotMinTimeChange}
        sx={{ width: '150px', marginRight: '1rem' }}
        value={(slotMinTime || '0:').split(':')[0]}
      >
        {[
          '0',
          '1',
          '2',
          '3',
          '4',
          '5',
          '6',
          '7',
          '8',
          '9',
          '10',
          '11',
          '12',
          '13',
          '14',
          '15',
          '16',
          '17',
          '18',
          '19',
          '20',
          '21',
          '22',
          '23',
          '24',
        ].map((hour, i) => (
          <MenuItem key={`slotMinTime-${hour}`} value={hour}>
            {hour}時
          </MenuItem>
        ))}
      </TextField>
      <TextField
        label='終了'
        select
        variant='outlined'
        color='primary'
        onChange={onSlotMaxTimeChange}
        sx={{ width: '150px' }}
        value={(slotMaxTime || '24:').split(':')[0]}
      >
        {[
          '0',
          '1',
          '2',
          '3',
          '4',
          '5',
          '6',
          '7',
          '8',
          '9',
          '10',
          '11',
          '12',
          '13',
          '14',
          '15',
          '16',
          '17',
          '18',
          '19',
          '20',
          '21',
          '22',
          '23',
          '24',
        ].map((hour, i) => (
          <MenuItem key={i} value={hour}>
            {hour}時
          </MenuItem>
        ))}
      </TextField>
    </div>
  );
};

export default Component;
