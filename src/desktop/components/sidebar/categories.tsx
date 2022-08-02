import React, { FC, FCX, memo } from 'react';
import { useRecoilCallback, useRecoilValue } from 'recoil';
import { FormControlLabel, Switch } from '@mui/material';
import { calendarEventCategoryState } from '../../states/kintone';
import styled from '@emotion/styled';
import { COLORS } from '../../static';
import { displayingCategoriesState } from '../../states/sidebar';

const Component: FCX<{ categories: string[] }> = memo(({ categories, className }) => {
  const displayingCategories = useRecoilValue(displayingCategoriesState);

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
    <div className={className}>
      <h3>表示するカレンダー</h3>
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
            <div className='switch-label'>
              {category}
              <span style={{ backgroundColor: COLORS[i % COLORS.length] }}></span>
            </div>
          }
        />
      ))}
    </div>
  );
});

const StyledComponent = styled(Component)`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;

  .switch-label {
    display: flex;
    align-items: center;
    gap: 1rem;

    > span {
      width: 1em;
      height: 1em;
      border-radius: 9999px;
    }
  }
`;

const Container: FC = () => {
  const categories = useRecoilValue(calendarEventCategoryState);

  if (!categories) {
    return null;
  }

  return <StyledComponent categories={categories} />;
};

export default Container;
