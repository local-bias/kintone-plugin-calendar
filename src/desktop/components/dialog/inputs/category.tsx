import React, { FC, memo } from 'react';
import { useRecoilCallback, useRecoilValue } from 'recoil';
import { MenuItem, TextField } from '@mui/material';
import { produce } from 'immer';
import { dialogPropsState } from '../../../states/dialog';
import {
  appPropertiesState,
  calendarEventCategoryState,
  pluginConditionState,
} from '../../../states/kintone';
import { getEventBackgroundColor } from '../../../actions';
import { DEFAULT_COLORS } from '../../../static';

const Component: FC<{ category?: string; categories: string[] }> = memo(
  ({ category, categories }) => {
    const condition = useRecoilValue(pluginConditionState);
    const colors = condition?.colors ?? DEFAULT_COLORS;

    const onCategoryChange: React.ChangeEventHandler<HTMLInputElement | HTMLTextAreaElement> =
      useRecoilCallback(
        ({ set, snapshot }) =>
          async (props) => {
            const condition = (await snapshot.getPromise(pluginConditionState))!;
            const properties = await snapshot.getPromise(appPropertiesState);

            set(dialogPropsState, (current) =>
              produce(current, (draft) => {
                draft.event.category = props.target.value;
                draft.event.backgroundColor = getEventBackgroundColor(
                  props.target.value,
                  condition,
                  properties
                );
              })
            );
          },
        []
      );

    return (
      <div>
        <TextField
          variant='outlined'
          size='small'
          sx={{ width: '200px' }}
          color='primary'
          select
          label='カテゴリー'
          value={category || ''}
          onChange={onCategoryChange}
        >
          {categories.map((category, i) => (
            <MenuItem key={category} value={category}>
              <span
                style={{
                  width: '1em',
                  height: '1em',
                  marginRight: '0.5em',
                  borderRadius: '9999px',
                  backgroundColor: colors[i % colors.length],
                }}
              ></span>
              {category}
            </MenuItem>
          ))}
        </TextField>
      </div>
    );
  }
);

const Container: FC = () => {
  const props = useRecoilValue(dialogPropsState);
  const categories = useRecoilValue(calendarEventCategoryState);

  if (!categories) {
    return null;
  }

  return <Component category={props.event.category} categories={categories} />;
};

export default Container;
