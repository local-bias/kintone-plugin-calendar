import styled from '@emotion/styled';
import { TextField } from '@mui/material';
import React, { FCX } from 'react';
import { useRecoilCallback, useRecoilValue } from 'recoil';
import { dialogPropsState } from '../../states/dialog';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import produce from 'immer';
import { pluginConditionState } from '../../states/kintone';

const Component: FCX = ({ className }) => {
  const props = useRecoilValue(dialogPropsState);
  const condition = useRecoilValue(pluginConditionState);

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

  const onStartChange = useRecoilCallback(
    ({ set }) =>
      (date: any) => {
        set(dialogPropsState, (current) =>
          produce(current, (draft) => {
            draft.event.start = date;
          })
        );
      },
    []
  );

  const onEndChange = useRecoilCallback(
    ({ set }) =>
      (date: any) => {
        set(dialogPropsState, (current) =>
          produce(current, (draft) => {
            draft.event.end = date;
          })
        );
      },
    []
  );

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
    <div className={className}>
      <div>
        <TextField
          variant='outlined'
          color='primary'
          label='イベントのタイトル'
          value={props.event.title || ''}
          onChange={onTitleChange}
        />
      </div>
      <div>
        <DateTimePicker
          renderInput={(props) => <TextField {...props} />}
          label='開始日時'
          inputFormat='yyyy/MM/dd hh:mm a'
          value={props.event.start}
          onChange={onStartChange}
        />
        <DateTimePicker
          renderInput={(props) => <TextField {...props} />}
          label='終了日時'
          inputFormat='yyyy/MM/dd hh:mm a'
          value={props.event.end}
          onChange={onEndChange}
        />
      </div>
      {!!condition?.enablesNote && (
        <div className='full'>
          <TextField
            label='説明'
            multiline
            rows={4}
            value={props.event.note}
            onChange={onNoteChange}
          />
        </div>
      )}
    </div>
  );
};

const StyledComponent = styled(Component)`
  padding: 1rem;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;

  > div {
    display: flex;
    gap: 1rem;

    &.full {
      align-items: stretch;
      flex-direction: column;
    }
  }
`;

export default StyledComponent;
