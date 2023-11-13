import { stringFieldsState } from '@/config/states/kintone';
import { calendarTitleState } from '@/config/states/plugin';
import { RecoilFieldSelect } from '@konomi-app/kintone-utilities-react';
import React, { FC } from 'react';
import { useRecoilCallback, useRecoilValue } from 'recoil';

const Component: FC = () => {
  const title = useRecoilValue(calendarTitleState);
  const onChange = useRecoilCallback(
    ({ set }) =>
      (code: string) => {
        set(calendarTitleState, code);
      },
    []
  );

  return (
    <RecoilFieldSelect
      state={stringFieldsState}
      onChange={onChange}
      fieldCode={title}
      placeholder='フィールドを選択してください'
    />
  );
};

export default Component;
