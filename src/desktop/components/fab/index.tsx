import AddIcon from '@mui/icons-material/Add';
import HourglassEmptyIcon from '@mui/icons-material/HourglassEmpty';
import { Fab, Tooltip } from '@mui/material';
import { useAtomValue, useSetAtom } from 'jotai';
import { FC } from 'react';
import { handleTemporaryEventAddAtom } from '../../states/calendar';
import { loadingAtom } from '../../states/kintone';

const Component: FC = () => {
  const loading = useAtomValue(loadingAtom);
  const handleEventAdd = useSetAtom(handleTemporaryEventAddAtom);

  return (
    <div className='!fixed right-4 md:right-8 bottom-4 z-10'>
      <Tooltip title='スケジュールを追加する'>
        <Fab
          variant='circular'
          size='large'
          color='primary'
          aria-label='add'
          onClick={handleEventAdd}
        >
          {loading ? <HourglassEmptyIcon /> : <AddIcon />}
        </Fab>
      </Tooltip>
    </div>
  );
};

export default Component;
