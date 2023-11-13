import React, { FC } from 'react';
import { useRecoilCallback, useRecoilValue } from 'recoil';
import { produce } from 'immer';
import { Button, DialogActions } from '@mui/material';
import LoadingButton from '@mui/lab/LoadingButton';
import SaveIcon from '@mui/icons-material/Save';

import { dialogPropsState, dialogShownState } from '../../states/dialog';
import { appPropertiesState, loadingState, pluginConditionState } from '../../states/kintone';
import { calendarEventsState } from '../../states/calendar';
import { addNewRecord, reschedule } from '../../actions';

const Component: FC<{ onDialogClose: () => void }> = ({ onDialogClose }) => {
  const loading = useRecoilValue(loadingState);

  const onEnterButtonClick = useRecoilCallback(
    ({ reset, set, snapshot }) =>
      async () => {
        set(loadingState, true);
        try {
          const currentProps = await snapshot.getPromise(dialogPropsState);
          const condition = await snapshot.getPromise(pluginConditionState);
          const properties = await snapshot.getPromise(appPropertiesState);

          if (currentProps.new) {
            const newEvent = await addNewRecord({
              calendarEvent: currentProps.event,
              condition: condition!,
              properties,
            });
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
            await reschedule({
              calendarEvent: currentProps.event,
              condition: condition!,
              properties,
            });
            set(calendarEventsState, (current) =>
              produce(current, (draft) => {
                const index = draft.findIndex((event) => event.id === currentProps.event.id);
                draft[index] = currentProps.event;
              })
            );
          }

          reset(dialogShownState);
          reset(dialogPropsState);
        } catch (error) {
          console.error(error);
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
