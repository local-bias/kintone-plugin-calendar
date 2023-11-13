import React, { FC } from 'react';
import { useRecoilValue, useRecoilCallback } from 'recoil';
import { MenuItem, TextField } from '@mui/material';
import { customViewsState } from '../../states/kintone';
import { viewIdState } from '../../states/plugin';

const Container: FC = () => {
  const viewId = useRecoilValue(viewIdState);
  const views = useRecoilValue(customViewsState);

  const onViewIdChange = useRecoilCallback(
    ({ set }) =>
      (e: React.ChangeEvent<HTMLInputElement>) => {
        set(viewIdState, e.target.value);
      },
    []
  );

  return (
    <TextField
      select
      label='一覧の名前'
      value={viewId}
      onChange={onViewIdChange}
      sx={{ width: '250px' }}
    >
      {Object.entries(views).map(([name, { id }]) => (
        <MenuItem key={id} value={id}>
          {name}
        </MenuItem>
      ))}
    </TextField>
  );
};

export default Container;
