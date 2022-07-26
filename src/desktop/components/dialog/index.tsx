import styled from '@emotion/styled';
import { Dialog, DialogContent } from '@mui/material';
import React, { FCX } from 'react';
import { useRecoilCallback, useRecoilValue } from 'recoil';
import { dialogPropsState, dialogShownState } from '../../states/dialog';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { calendarEventsState } from '../../states/calendar';

import FooterActions from './dialog-actions';
import DialogInputs from './dialog-inputs';
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

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <Dialog open={open} onClose={onDialogClose} maxWidth='sm' fullWidth className={className}>
        <DialogContent className='content'>
          <FixedButtons new={props.new} />
          <DialogInputs />
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
`;

export default StyledComponent;
