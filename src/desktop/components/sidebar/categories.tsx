import { FormControlLabel, Switch } from '@mui/material';
import { atom, useAtomValue, useSetAtom } from 'jotai';
import { FC, memo } from 'react';
import { calendarEventCategoryAtom, pluginConditionAtom } from '../../states/kintone';
import { displayingCategoriesAtom } from '../../states/sidebar';
import { DEFAULT_COLORS } from '../../static';

const handleCategoryChangeAtom = atom(
  null,
  async (get, set, category: string, checked: boolean) => {
    const categories = (await get(calendarEventCategoryAtom)) ?? [];
    set(displayingCategoriesAtom, (current) => {
      const newArray = current === null ? categories : [...current];

      if (checked) {
        return [...newArray, category];
      }
      return newArray.filter((c) => c !== category);
    });
  }
);

const Component: FC<{ categories: string[] }> = memo(({ categories }) => {
  const displayingCategories = useAtomValue(displayingCategoriesAtom);
  const onCategoryChange = useSetAtom(handleCategoryChangeAtom);
  const condition = useAtomValue(pluginConditionAtom);
  const colors = condition?.colors ?? DEFAULT_COLORS;

  return (
    <div className='grid gap-2 px-2'>
      <h3>表示するカテゴリー</h3>
      {categories.map((category, i) => (
        <FormControlLabel
          key={i}
          control={
            <Switch
              size='small'
              checked={displayingCategories === null || displayingCategories.includes(category)}
              onChange={(_, checked) => onCategoryChange(category, checked)}
            />
          }
          label={
            <div className='ml-2 flex items-center gap-1'>
              {category}
              <span
                style={{ backgroundColor: colors[i % colors.length] }}
                className='w-4 h-4 rounded-full'
              ></span>
            </div>
          }
        />
      ))}
    </div>
  );
});

const Container: FC = () => {
  const categories = useAtomValue(calendarEventCategoryAtom);

  if (!categories) {
    return null;
  }

  return <Component categories={categories} />;
};

export default Container;
