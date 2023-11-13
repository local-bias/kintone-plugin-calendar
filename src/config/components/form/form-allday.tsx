import { alldayOptionsState, checkboxFieldsState } from '@/config/states/kintone';
import { alldayOptionState, calendarAllDayState, enablesAllDayState } from '@/config/states/plugin';
import { RecoilFieldSelect } from '@konomi-app/kintone-utilities-react';
import React, { FC } from 'react';
import { useRecoilCallback, useRecoilValue } from 'recoil';
import { TextField, MenuItem } from '@mui/material';

const Component: FC = () => {
  const enablesAllday = useRecoilValue(enablesAllDayState);
  const alldayField = useRecoilValue(calendarAllDayState);
  const alldayOption = useRecoilValue(alldayOptionState);
  const alldayOptions = useRecoilValue(alldayOptionsState);

  const onFieldChange = useRecoilCallback(
    ({ set }) =>
      (code: string) => {
        set(calendarAllDayState, code);
      },
    []
  );

  const onAllDayOptionChange = useRecoilCallback(
    ({ set }) =>
      (e: React.ChangeEvent<HTMLInputElement>) => {
        set(alldayOptionState, e.target.value);
      },
    []
  );

  if (!enablesAllday) {
    return null;
  }

  return (
    <div className='mt-4 grid gap-4'>
      <RecoilFieldSelect
        state={checkboxFieldsState}
        onChange={onFieldChange}
        fieldCode={alldayField}
        placeholder='フィールドを選択してください'
      />
      <TextField
        label='終日とする値'
        select
        variant='outlined'
        color='primary'
        onChange={onAllDayOptionChange}
        sx={{ width: '350px' }}
        value={alldayOption}
      >
        {alldayOptions.map((code, i) => (
          <MenuItem key={`allDayOptions-${code}`} value={code}>
            {code}
          </MenuItem>
        ))}
      </TextField>
    </div>
  );
};

export default Component;
