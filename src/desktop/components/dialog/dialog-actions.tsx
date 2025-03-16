import SaveIcon from '@mui/icons-material/Save';
import LoadingButton from '@mui/lab/LoadingButton';
import { Button, DialogActions } from '@mui/material';
import { useAtomValue, useSetAtom } from 'jotai';
import { FC } from 'react';
import { handleDialogSubmitAtom } from '../../states/dialog';
import { loadingAtom } from '../../states/kintone';

const Component: FC<{ onDialogClose: () => void }> = ({ onDialogClose }) => {
  const loading = useAtomValue(loadingAtom);
  const handleDialogSubmit = useSetAtom(handleDialogSubmitAtom);

  return (
    <DialogActions>
      <Button color='inherit' variant='contained' onClick={onDialogClose}>
        キャンセル
      </Button>
      <LoadingButton
        loading={loading}
        loadingPosition='start'
        startIcon={<SaveIcon />}
        onClick={handleDialogSubmit}
        variant='contained'
      >
        決定
      </LoadingButton>
    </DialogActions>
  );
};

export default Component;
