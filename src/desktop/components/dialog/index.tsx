import styled from '@emotion/styled';
import { Dialog, DialogContent, TextField } from '@mui/material';
import React, { FCX } from 'react';
import { useRecoilCallback, useRecoilValue } from 'recoil';
import { dialogPropsState, dialogShownState } from '../../states/dialog';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import produce from 'immer';
import { calendarEventsState } from '../../states/calendar';

import FooterActions from './dialog-actions';
import FixedButtons from './fixed-buttons';

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

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <Dialog open={open} onClose={onDialogClose} maxWidth='sm' fullWidth className={className}>
        <DialogContent className='content'>
          <FixedButtons new={props.new} />
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
        <FooterActions onDialogClose={onDialogClose} />
      </Dialog>
    </LocalizationProvider>
  );
};

const StyledComponent = styled(Component)`
  .content {
    position: relative;
  }

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
