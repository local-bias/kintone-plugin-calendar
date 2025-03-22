import { useArray } from '@/config/hooks/use-array';
import { colorsAtom } from '@/config/states/plugin';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import { IconButton, TextField, Tooltip } from '@mui/material';
import { useAtomValue } from 'jotai';
import { FC } from 'react';

const Component: FC = () => {
  const colors = useAtomValue(colorsAtom);
  const { addItem, deleteItem, updateItem } = useArray(colorsAtom);

  return (
    <div className='mt-4 grid gap-4'>
      {colors.map((color, i) => (
        <div key={i} className='flex items-center gap-4'>
          <TextField
            sx={{ width: '120px' }}
            label={`色${i + 1}`}
            value={color}
            type='color'
            onChange={(e) => updateItem({ index: i, newItem: e.target.value })}
          />
          <Tooltip title='色設定を追加する'>
            <IconButton size='small' onClick={() => addItem({ newItem: '#ffffff', index: i + 1 })}>
              <AddIcon fontSize='small' />
            </IconButton>
          </Tooltip>
          {colors.length > 1 && (
            <Tooltip title='この色設定を削除する'>
              <IconButton size='small' onClick={() => deleteItem(i)}>
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
