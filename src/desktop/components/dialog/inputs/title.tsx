import React, { FCX } from 'react';
import { useRecoilCallback, useRecoilValue } from 'recoil';
import { TextField } from '@mui/material';
import produce from 'immer';
import { dialogPropsState } from '../../../states/dialog';

const Component: FCX = ({ className }) => {
  const props = useRecoilValue(dialogPropsState);

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
        value={props.event.title || ''}
        onChange={onTitleChange}
      />
    </div>
  );
};

export default Component;
