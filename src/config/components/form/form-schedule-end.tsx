import { JotaiFieldSelect } from '@/components/jotai/field-select';
import { dateTimeFieldsAtom } from '@/config/states/kintone';
import { calendarEndState } from '@/config/states/plugin';
import { atom, useAtomValue, useSetAtom } from 'jotai';
import { FC } from 'react';

const handleFieldCodeChangeAtom = atom(null, (_, set, code: string) => {
  set(calendarEndState, code);
});

const Component: FC = () => {
  const fieldCode = useAtomValue(calendarEndState);
  const onChange = useSetAtom(handleFieldCodeChangeAtom);

  return (
    <JotaiFieldSelect
      //@ts-expect-error 型定義不足
      fieldPropertiesAtom={dateTimeFieldsAtom}
      onChange={onChange}
      fieldCode={fieldCode}
      placeholder='フィールドを選択してください'
    />
  );
};

export default Component;
