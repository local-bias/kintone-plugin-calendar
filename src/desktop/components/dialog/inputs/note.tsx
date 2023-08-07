import { TextField } from '@mui/material';
import React, { FC, memo } from 'react';
import { useRecoilCallback, useRecoilValue } from 'recoil';
import { dialogPropsState } from '../../../states/dialog';
import { produce } from 'immer';
import { pluginConditionState } from '../../../states/kintone';

const Component: FC<{ value: string }> = memo((props) => {
  const onNoteChange: React.ChangeEventHandler<HTMLInputElement | HTMLTextAreaElement> =
    useRecoilCallback(
      ({ set }) =>
        (props) => {
          set(dialogPropsState, (current) =>
            produce(current, (draft) => {
              draft.event.note = props.target.value;
            })
          );
        },
      []
    );

  return (
    <div className='full'>
      <TextField label='説明' multiline rows={4} value={props.value} onChange={onNoteChange} />
    </div>
  );
});

const Container: FC = () => {
  const props = useRecoilValue(dialogPropsState);
  const condition = useRecoilValue(pluginConditionState);

  if (!condition?.enablesNote) {
    return null;
  }
  return <Component value={props.event.note || ''} />;
};

export default Container;
