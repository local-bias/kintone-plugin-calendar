import { JotaiFieldSelect } from '@/components/jotai/field-select';
import { selectableFieldsAtom } from '@/config/states/kintone';
import { calendarCategoryState } from '@/config/states/plugin';
import { atom, useAtomValue, useSetAtom } from 'jotai';
import { FC } from 'react';

const handleFieldCodeChangeAtom = atom(null, (_, set, code: string) => {
  set(calendarCategoryState, code);
});

const Component: FC = () => {
  const categoryField = useAtomValue(calendarCategoryState);
  const onFieldChange = useSetAtom(handleFieldCodeChangeAtom);

  return (
    <div className='mt-4 grid gap-4'>
      <JotaiFieldSelect
        // @ts-expect-error 型定義不足
        fieldPropertiesAtom={selectableFieldsAtom}
        onChange={onFieldChange}
        fieldCode={categoryField}
        placeholder='フィールドを選択してください'
      />
    </div>
  );
};

export default Component;
