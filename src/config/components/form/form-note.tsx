import { stringFieldsState } from '@/config/states/kintone';
import { calendarNoteState, enablesNoteState } from '@/config/states/plugin';
import { RecoilFieldSelect } from '@konomi-app/kintone-utilities-react';
import React, { FC } from 'react';
import { useRecoilCallback, useRecoilValue } from 'recoil';

const Component: FC = () => {
  const enablesNote = useRecoilValue(enablesNoteState);
  const noteField = useRecoilValue(calendarNoteState);

  const onFieldChange = useRecoilCallback(
    ({ set }) =>
      (code: string) => {
        set(calendarNoteState, code);
      },
    []
  );

  if (!enablesNote) {
    return null;
  }

  return (
    <div className='mt-4 grid gap-4'>
      <RecoilFieldSelect
        state={stringFieldsState}
        onChange={onFieldChange}
        fieldCode={noteField}
        placeholder='フィールドを選択してください'
      />
    </div>
  );
};

export default Component;
