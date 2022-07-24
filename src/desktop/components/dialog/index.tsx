import styled from '@emotion/styled';
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
} from '@mui/material';
import React, { FCX } from 'react';
import { useRecoilCallback, useRecoilValue } from 'recoil';
import { dialogPropsState, dialogShownState } from '../../states/dialog';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import produce from 'immer';
import { calendarEventsState } from '../../states/calendar';
import { addNewRecord, updateRecord } from '../../actions';
import { pluginConditionState } from '../../states/kintone';

const Component: FCX = ({ className }) => {
  const open = useRecoilValue(dialogShownState);
  const props = useRecoilValue(dialogPropsState);

  const onDialogClose = useRecoilCallback(
    ({ reset, set, snapshot }) =>
      async () => {
        const currentProps = await snapshot.getPromise(dialogPropsState);

        if (currentProps.new) {
          set(calendarEventsState, (current) =>
            current.filter(({ id }) => id !== currentProps.event.id)
          );
        }
        reset(dialogShownState);
        reset(dialogPropsState);
      },
    []
  );

  const onTitleChange: React.ChangeEventHandler<HTMLInputElement | HTMLTextAreaElement> =
    useRecoilCallback(
      ({ set }) =>
        (props) => {
          set(dialogPropsState, (current) =>
            produce(current, (draft) => {
              draft.event.title = props.target.value;
            })
          );
        },
      []
    );

  const onStartChange = useRecoilCallback(
    ({ set }) =>
      (date: any) => {
        set(dialogPropsState, (current) =>
          produce(current, (draft) => {
            draft.event.start = date;
          })
        );
      },
    []
  );

  const onEndChange = useRecoilCallback(
    ({ set }) =>
      (date: any) => {
        set(dialogPropsState, (current) =>
          produce(current, (draft) => {
            draft.event.end = date;
          })
        );
      },
    []
  );

  const onEnterButtonClick = useRecoilCallback(
    ({ reset, set, snapshot }) =>
      async () => {
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
      },
    []
  );

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <Dialog open={open} onClose={onDialogClose} maxWidth='sm' fullWidth className={className}>
        <DialogContent>
          <div className='inputs'>
            <div>
              <TextField
                variant='outlined'
                color='primary'
                label='イベントのタイトル'
                value={props.event.title || ''}
                onChange={onTitleChange}
              />
            </div>
            <div>
              <DateTimePicker
                renderInput={(props) => <TextField {...props} />}
                label='開始日時'
                inputFormat='yyyy/MM/dd hh:mm a'
                value={props.event.start}
                onChange={onStartChange}
              />
              <DateTimePicker
                renderInput={(props) => <TextField {...props} />}
                label='終了日時'
                inputFormat='yyyy/MM/dd hh:mm a'
                value={props.event.end}
                onChange={onEndChange}
              />
            </div>
          </div>
        </DialogContent>
        <DialogActions>
          <Button color='inherit' variant='contained' onClick={onDialogClose}>
            キャンセル
          </Button>
          <Button color='primary' variant='contained' onClick={onEnterButtonClick}>
            決定
          </Button>
        </DialogActions>
      </Dialog>
    </LocalizationProvider>
  );
};

const StyledComponent = styled(Component)`
  .inputs {
    padding: 1rem;
    display: flex;
    flex-direction: column;
    gap: 1.5rem;

    > div {
      display: flex;
      gap: 1rem;
    }
  }
`;

export default StyledComponent;
