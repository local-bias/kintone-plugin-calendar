import React, { FC } from 'react';
import { CircularProgress, Fab, Tooltip } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import HourglassEmptyIcon from '@mui/icons-material/HourglassEmpty';
import styled from '@emotion/styled';
import { useRecoilCallback, useRecoilValue } from 'recoil';
import { completeCalendarEvent, getDefaultEndDate, getDefaultStartDate } from '../../actions';
import { dialogPropsState, dialogShownState } from '../../states/dialog';
import { calendarEventsState } from '../../states/calendar';
import { produce } from 'immer';
import { loadingState } from '../../states/kintone';

const Component: FC = () => {
  const loading = useRecoilValue(loadingState);

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
    <div className='fixed right-8 bottom-4 z-10'>
      <Tooltip title='スケジュールを追加する'>
        <Fab
          variant='circular'
          size='large'
          color='primary'
          aria-label='add'
          onClick={onEventAdditionButtonClick}
        >
          {loading ? <HourglassEmptyIcon /> : <AddIcon />}
        </Fab>
      </Tooltip>
    </div>
  );
};

export default Component;
