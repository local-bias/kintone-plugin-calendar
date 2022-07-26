import { TextField } from '@mui/material';
import React, { FC } from 'react';
import { useRecoilCallback, useRecoilValue } from 'recoil';
import { dialogPropsState } from '../../../states/dialog';
import produce from 'immer';
import { pluginConditionState } from '../../../states/kintone';

const Component: FC = () => {
  const props = useRecoilValue(dialogPropsState);
  const condition = useRecoilValue(pluginConditionState);

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

  if (!condition?.enablesNote) {
    return null;
  }

  return (
    <div className='full'>
      <TextField label='説明' multiline rows={4} value={props.event.note} onChange={onNoteChange} />
    </div>
  );
};

export default Component;
