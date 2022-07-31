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

  --fc-button-bg-color: #1976d2;
  --fc-button-hover-bg-color: #1565c0;
  --fc-button-active-bg-color: #0d47a1;
  --fc-button-border-color: #fff;
  --fc-button-hover-border-color: #fff;
  --fc-button-active-border-color: #fff;

  .fc .fc-timegrid-slot-minor {
    border-style: none;
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
