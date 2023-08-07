import React, { FC } from 'react';
import { useRecoilCallback, useRecoilValue } from 'recoil';
import { produce } from 'immer';
import { Button, DialogActions } from '@mui/material';
import LoadingButton from '@mui/lab/LoadingButton';
import SaveIcon from '@mui/icons-material/Save';

import { dialogPropsState, dialogShownState } from '../../states/dialog';
import { loadingState, pluginConditionState } from '../../states/kintone';
import { calendarEventsState } from '../../states/calendar';
import { addNewRecord, updateRecord } from '../../actions';

const Component: FC<{ onDialogClose: () => void }> = ({ onDialogClose }) => {
  const loading = useRecoilValue(loadingState);

  const onEnterButtonClick = useRecoilCallback(
    ({ reset, set, snapshot }) =>
      async () => {
        set(loadingState, true);
        try {
          const currentProps = await snapshot.getPromise(dialogPropsState);
          const condition = await snapshot.getPromise(pluginConditionState);

          if (currentProps.new) {
            const newEvent = await addNewRecord(currentProps.event, condition!);
            set(dialogPropsState, (current) =>
              produce(current, (draft) => {
                draft.event = newEvent;
              })
            );
            set(calendarEventsState, (current) =>
              produce(current, (draft) => {
                const index = draft.findIndex((event) => event.id === currentProps.event.id);
                draft[index] = newEvent;
              })
            );
          } else {
            await updateRecord(currentProps.event, condition!);
            set(calendarEventsState, (current) =>
              produce(current, (draft) => {
                const index = draft.findIndex((event) => event.id === currentProps.event.id);
                draft[index] = currentProps.event;
              })
            );
          }

          reset(dialogShownState);
          reset(dialogPropsState);
        } finally {
          set(loadingState, false);
        }
      },
    []
  );

  return (
    <DialogActions>
      <Button color='inherit' variant='contained' onClick={onDialogClose}>
        キャンセル
      </Button>
      <LoadingButton
        loading={loading}
        loadingPosition='start'
        startIcon={<SaveIcon />}
        onClick={onEnterButtonClick}
        variant='contained'
      >
        決定
      </LoadingButton>
    </DialogActions>
  );
};

export default Component;
