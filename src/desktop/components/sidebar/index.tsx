import styled from '@emotion/styled';
import { Button } from '@mui/material';
import produce from 'immer';
import React, { FC, FCX } from 'react';
import { useRecoilCallback } from 'recoil';
import { calendarEventsState } from '../../states/calendar';

const Component: FCX = ({ className }) => {
  const onEventAdditionButtonClick = useRecoilCallback(
    ({ set }) =>
      () => {
        set(calendarEventsState, (currentEvents) =>
          produce(currentEvents, (draft) => {
            draft.push({
              title: 'test',
              start: new Date(),
              end: new Date(),
            });
          })
        );
      },
    []
  );

  return (
    <div className={className}>
      <div className='container'>
        <Button
          variant='contained'
          color='primary'
          size='large'
          onClick={onEventAdditionButtonClick}
        >
          新規作成
        </Button>
      </div>
    </div>
  );
};

const StyledComponent = styled(Component)``;

export default Component;
