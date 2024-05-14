import { getConditionPropertyState } from '@/config/states/plugin';
import { useRecoilRow } from '@konomi-app/kintone-utilities-react';
import { IconButton, TextField, Tooltip } from '@mui/material';
import React, { FC } from 'react';
import { useRecoilValue } from 'recoil';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';

const state = getConditionPropertyState('colors');

const Component: FC = () => {
  const colors = useRecoilValue(state);
  const { addRow, deleteRow, changeRow } = useRecoilRow({ state, getNewRow: () => '#ffffff' });

  return (
    <div className='mt-4 grid gap-4'>
      {colors.map((color, i) => (
        <div key={i} className='flex items-center gap-4'>
          <TextField
            sx={{ width: '120px' }}
            label={`色${i + 1}`}
            value={color}
            type='color'
            onChange={(e) => changeRow(i, e.target.value)}
          />
          <Tooltip title='色設定を追加する'>
            <IconButton size='small' onClick={() => addRow(i)}>
              <AddIcon fontSize='small' />
            </IconButton>
          </Tooltip>
          {colors.length > 1 && (
            <Tooltip title='この色設定を削除する'>
              <IconButton size='small' onClick={() => deleteRow(i)}>
                <DeleteIcon fontSize='small' />
              </IconButton>
            </Tooltip>
          )}
        </div>
      ))}
    </div>
  );
};

export default Component;
