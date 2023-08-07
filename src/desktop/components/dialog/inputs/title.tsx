import React, { FC, memo } from 'react';
import { useRecoilCallback, useRecoilValue } from 'recoil';
import { TextField } from '@mui/material';
import { produce } from 'immer';
import { dialogPropsState } from '../../../states/dialog';

const Component: FC<{ title?: string }> = memo(({ title }) => {
  const onTitleChange: React.ChangeEventHandler<HTMLInputElement | HTMLTextAreaElement> =
    useRecoilCallback(
      ({ set }) =>
        (props) => {
          set(dialogPropsState, (current) =>
            produce(current, (draft) => {
              draft.event.title = props.target.value;
            })
          );
        },
      []
    );

  return (
    <div>
      <TextField
        variant='outlined'
        color='primary'
        label='イベントのタイトル'
        value={title || ''}
        onChange={onTitleChange}
      />
    </div>
  );
});

const Container: FC = () => {
  const props = useRecoilValue(dialogPropsState);
  return <Component title={props.event.title} />;
};

export default Container;
