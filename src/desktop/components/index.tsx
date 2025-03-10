import { PluginErrorBoundary } from '@/lib/components/error-boundary';
import styled from '@emotion/styled';
import React, { FC, FCX, Suspense } from 'react';
import { RecoilRoot } from 'recoil';
import Calendar from './calendar';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { jaJP } from '@mui/material/locale';
import { SnackbarProvider } from 'notistack';

import { pluginConditionState } from '../states/kintone';
import { useInitialize } from '../hooks/use-initialize';
import Dialog from './dialog';
import Fab from './fab';
import Sidebar from './sidebar';
import { LoaderWithLabel } from '@konomi-app/ui-react';

const Component: FCX = ({ className }) => {
  useInitialize();

  return (
    <>
      <Dialog />
      <div className={`🐸 ${className}`}>
        <Sidebar />
        <Calendar />
      </div>
      <Fab />
    </>
  );
};

const StyledComponent = styled(Component)`
  font-family: 'Noto Sans JP', 'Yu Gothic Medium', YuGothic, メイリオ;
  background-color: #fff;
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

  .fc-event-time,
  .fc-event-title-container {
    padding: 0.1rem 0.25rem;
  }
`;

const Container: FC<{ condition: Plugin.Condition }> = ({ condition }) => (
  <PluginErrorBoundary>
    <RecoilRoot
      initializeState={({ set }) => {
        set(pluginConditionState, condition);
      }}
    >
      <Suspense fallback={<LoaderWithLabel label='読み込み中' />}>
        <SnackbarProvider maxSnack={1}>
          <ThemeProvider theme={createTheme({}, jaJP)}>
            <StyledComponent />
          </ThemeProvider>
        </SnackbarProvider>
      </Suspense>
    </RecoilRoot>
  </PluginErrorBoundary>
);

export default Container;
