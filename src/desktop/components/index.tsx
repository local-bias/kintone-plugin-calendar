import { ErrorBoundary } from '@common/components/error-boundary';
import styled from '@emotion/styled';
import React, { FC, FCX, Suspense } from 'react';
import { RecoilRoot } from 'recoil';
import Calendar from './calendar';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { jaJP } from '@mui/material/locale';
import { SnackbarProvider } from 'notistack';

import { pluginConditionState } from '../states/kintone';
import Observer from './observer';
import Dialog from './dialog';
import Fab from './fab';
import Sidebar from './sidebar';

const Component: FCX<{ condition: kintone.plugin.Condition }> = ({ className, condition }) => (
  <ErrorBoundary>
    <RecoilRoot
      initializeState={({ set }) => {
        set(pluginConditionState, condition);
      }}
    >
      <SnackbarProvider maxSnack={1}>
        <ThemeProvider theme={createTheme({}, jaJP)}>
          <Suspense fallback={null}>
            <Observer />
          </Suspense>
          <Dialog />
          <div className={className}>
            <Sidebar />
            <div className='calendar'>
              <Calendar />
            </div>
          </div>
          <Fab />
        </ThemeProvider>
      </SnackbarProvider>
    </RecoilRoot>
  </ErrorBoundary>
);

const StyledComponent = styled(Component)`
  font-family: 'Noto Sans JP', 'Yu Gothic Medium', YuGothic, メイリオ;
  color: #41525c;

  --fc-button-bg-color: #fff;
  --fc-button-hover-bg-color: #d2e3fc;
  --fc-button-active-bg-color: #d2e3fc;
  --fc-button-border-color: transparent;
  --fc-button-hover-border-color: transparent;
  --fc-button-active-border-color: transparent;
  --fc-button-text-color: #41525c;

  .fc .fc-scrollgrid,
  .fc .fc-timegrid-slot-minor {
    border-style: none;
  }

  .fc-button {
    transition: all 250ms ease;
  }

  .fc .fc-button:focus {
    box-shadow: none !important;
  }

  .fc-today-button {
    border: 1px solid #0004;
    background-color: #fff;
    color: #41525c;

    &:disabled {
      border: 1px solid #0002;
      color: #0006;
      background-color: #fff;
    }
  }

  padding: 1rem;
  display: flex;
  gap: 1rem;

  .calendar {
    flex: 1;
  }

  .fc-event-time,
  .fc-event-title-container {
    padding: 0.1rem 0.25rem;
  }
`;

export default StyledComponent;
