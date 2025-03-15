import styled from '@emotion/styled';
import { Dialog, DialogContent } from '@mui/material';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { atom, useAtomValue, useSetAtom } from 'jotai';
import { FCX, Suspense } from 'react';
import { calendarEventsAtom } from '../../states/calendar';
import { dialogPropsAtom, dialogShownAtom } from '../../states/dialog';
import FooterActions from './dialog-actions';
import FixedButtons from './fixed-buttons';
import DialogInputs from './inputs';

const handleDialogCloseAtom = atom(null, async (get, set) => {
  const currentProps = await get(dialogPropsAtom);

  if (currentProps.new) {
    set(calendarEventsAtom, (current) => current.filter(({ id }) => id !== currentProps.event.id));
  }
  set(dialogShownAtom, false);
  set(dialogPropsAtom, { new: false, event: {} });
});

const Component: FCX = ({ className }) => {
  const open = useAtomValue(dialogShownAtom);
  const onDialogClose = useSetAtom(handleDialogCloseAtom);

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <Dialog open={open} onClose={onDialogClose} maxWidth='sm' fullWidth className={className}>
        <DialogContent className='🐸 content'>
          <Suspense>
            <FixedButtons />
            <DialogInputs />
          </Suspense>
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
