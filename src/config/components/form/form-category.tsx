import { selectableFieldsState } from '@/config/states/kintone';
import { calendarCategoryState } from '@/config/states/plugin';
import { RecoilFieldSelect } from '@konomi-app/kintone-utilities-react';
import React, { FC } from 'react';
import { useRecoilCallback, useRecoilValue } from 'recoil';

const Component: FC = () => {
  const categoryField = useRecoilValue(calendarCategoryState);

  const onFieldChange = useRecoilCallback(
    ({ set }) =>
      (code: string) => {
        set(calendarCategoryState, code);
      },
    []
  );

  return (
    <div className='mt-4 grid gap-4'>
      <RecoilFieldSelect
        state={selectableFieldsState}
        onChange={onFieldChange}
        fieldCode={categoryField}
        placeholder='フィールドを選択してください'
      />
    </div>
  );
};

export default Component;
