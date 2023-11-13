import { dateTimeFieldsState } from '@/config/states/kintone';
import { calendarStartState } from '@/config/states/plugin';
import { RecoilFieldSelect } from '@konomi-app/kintone-utilities-react';
import React, { FC } from 'react';
import { useRecoilCallback, useRecoilValue } from 'recoil';

const Component: FC = () => {
  const title = useRecoilValue(calendarStartState);
  const onChange = useRecoilCallback(
    ({ set }) =>
      (code: string) => {
        set(calendarStartState, code);
      },
    []
  );

  return (
    <RecoilFieldSelect
      state={dateTimeFieldsState}
      onChange={onChange}
      fieldCode={title}
      placeholder='フィールドを選択してください'
    />
  );
};

export default Component;
