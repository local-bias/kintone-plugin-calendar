import React, { FC } from 'react';
import { useRecoilValue, useRecoilCallback } from 'recoil';
import { MenuItem, TextField } from '@mui/material';
import { initialViewState } from '../../states/plugin';

const VIEW_LIST: { label: string; viewType: Plugin.Condition['initialView'] }[] = [
  { label: '日単位、１ヶ月のカレンダー', viewType: 'dayGridMonth' },
  { label: '時間単位、１週間のカレンダー', viewType: 'timeGridWeek' },
  { label: '時間単位、5日間のカレンダー', viewType: 'timeGridFiveDay' },
  { label: '時間単位、3日のカレンダー', viewType: 'timeGridThreeDay' },
  { label: '時間単位、１日のカレンダー', viewType: 'timeGridDay' },
];

const Container: FC = () => {
  const initialView = useRecoilValue(initialViewState);

  const onChange = useRecoilCallback(
    ({ set }) =>
      (e: React.ChangeEvent<HTMLInputElement>) => {
        set(initialViewState, e.target.value as Plugin.Condition['initialView']);
      },
    []
  );

  return (
    <TextField
      select
      label='カレンダーの種類'
      value={initialView}
      onChange={onChange}
      sx={{ width: '400px' }}
    >
      {VIEW_LIST.map(({ label, viewType }) => (
        <MenuItem key={viewType} value={viewType}>
          {label}
        </MenuItem>
      ))}
    </TextField>
  );
};

export default Container;
