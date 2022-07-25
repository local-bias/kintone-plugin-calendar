import React, { FCX } from 'react';
import { Fab, Tooltip } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import styled from '@emotion/styled';
import { useRecoilCallback } from 'recoil';
import { completeCalendarEvent, getDefaultEndDate, getDefaultStartDate } from '../../actions';
import { dialogPropsState, dialogShownState } from '../../states/dialog';
import { calendarEventsState } from '../../states/calendar';
import produce from 'immer';

const Component: FCX = ({ className }) => {
  const onEventAdditionButtonClick = useRecoilCallback(
    ({ set }) =>
      () => {
        const temporaryKey = Math.random().toString();

        const completed = completeCalendarEvent({
          id: temporaryKey,
          allDay: false,
          title: '',
          start: getDefaultStartDate(),
          end: getDefaultEndDate(),
        });

        set(calendarEventsState, (current) => produce(current, (draft) => [...draft, completed]));
        set(dialogPropsState, {
          new: true,
          event: completed,
        });
        set(dialogShownState, true);
      },
    []
  );

  return (
    <div className={className}>
      <Tooltip title='スケジュールを追加する'>
        <Fab
          variant='circular'
          size='large'
          color='primary'
          aria-label='add'
          onClick={onEventAdditionButtonClick}
        >
          <AddIcon />
        </Fab>
      </Tooltip>
    </div>
  );
};

const StyledComponent = styled(Component)`
  position: fixed;
  right: 2rem;
  bottom: 1rem;
  z-index: 10;
`;

export default StyledComponent;
