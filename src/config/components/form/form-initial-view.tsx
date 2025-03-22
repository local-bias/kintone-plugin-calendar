import { PluginCondition } from '@/schema/plugin-config';
import { MenuItem, TextField } from '@mui/material';
import { atom, useAtomValue, useSetAtom } from 'jotai';
import React, { FC } from 'react';
import { initialViewState } from '../../states/plugin';

const VIEW_LIST: { label: string; viewType: PluginCondition['initialView'] }[] = [
  { label: '日単位、１ヶ月のカレンダー', viewType: 'dayGridMonth' },
  { label: '時間単位、１週間のカレンダー', viewType: 'timeGridWeek' },
  { label: '時間単位、5日間のカレンダー', viewType: 'timeGridFiveDay' },
  { label: '時間単位、3日のカレンダー', viewType: 'timeGridThreeDay' },
  { label: '時間単位、１日のカレンダー', viewType: 'timeGridDay' },
];

const handleViewChangeAtom = atom(null, (_, set, event: React.ChangeEvent<HTMLInputElement>) => {
  set(initialViewState, event.target.value as PluginCondition['initialView']);
});

const Container: FC = () => {
  const initialView = useAtomValue(initialViewState);
  const onChange = useSetAtom(handleViewChangeAtom);

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
