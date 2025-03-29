import { isTimeSupportedAtom } from '@/desktop/states/plugin';
import { FormControlLabel, Switch } from '@mui/material';
import { atom, useAtomValue, useSetAtom } from 'jotai';
import { FC } from 'react';
import { dialogAllDayAtom } from '../../../states/dialog';

const handleAllDayChangeAtom = atom(null, async (_, set, __: unknown, checked: boolean) => {
  set(dialogAllDayAtom, checked);
});

const DialogAllDayFormComponent: FC = () => {
  const allDay = useAtomValue(dialogAllDayAtom);
  const onChange = useSetAtom(handleAllDayChangeAtom);

  return (
    <div>
      <FormControlLabel
        control={<Switch size='small' checked={allDay} onChange={onChange} />}
        label='終日'
      />
    </div>
  );
};

export default function DialogAllDayForm() {
  const isTimeSupported = useAtomValue(isTimeSupportedAtom);
  return isTimeSupported ? <DialogAllDayFormComponent /> : null;
}
