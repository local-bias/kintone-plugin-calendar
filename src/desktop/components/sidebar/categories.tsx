import React, { FC, memo } from 'react';
import { useRecoilCallback, useRecoilValue } from 'recoil';
import { FormControlLabel, Switch } from '@mui/material';
import { calendarEventCategoryState, pluginConditionState } from '../../states/kintone';
import { DEFAULT_COLORS } from '../../static';
import { displayingCategoriesState } from '../../states/sidebar';

const Component: FC<{ categories: string[] }> = memo(({ categories }) => {
  const displayingCategories = useRecoilValue(displayingCategoriesState);
  const condition = useRecoilValue(pluginConditionState);
  const colors = condition?.colors ?? DEFAULT_COLORS;

  const onCategoryChange = useRecoilCallback(
    ({ set }) =>
      async (category: string, checked: boolean) => {
        set(displayingCategoriesState, (current) => {
          const newArray = current === null ? categories : [...current];

          if (checked) {
            return [...newArray, category];
          }
          return newArray.filter((c) => c !== category);
        });
      },
    []
  );

  return (
    <div className='grid gap-2'>
      <h3>表示するカテゴリー</h3>
      {categories.map((category, i) => (
        <FormControlLabel
          key={i}
          control={
            <Switch
              checked={displayingCategories === null || displayingCategories.includes(category)}
              onChange={(_, checked) => onCategoryChange(category, checked)}
            />
          }
          label={
            <div className='flex items-center gap-3'>
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
  const categories = useRecoilValue(calendarEventCategoryState);

  if (!categories) {
    return null;
  }

  return <Component categories={categories} />;
};

export default Container;
