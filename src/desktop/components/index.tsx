import { PluginErrorBoundary } from '@/lib/components/error-boundary';
import { store } from '@/lib/store';
import styled from '@emotion/styled';
import { LoaderWithLabel } from '@konomi-app/ui-react';
import { jaJP } from '@mui/material/locale';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { Provider } from 'jotai';
import { SnackbarProvider } from 'notistack';
import { FC, FCX, Suspense } from 'react';
import { useInitialize } from '../hooks/use-initialize';
import Calendar from './calendar';
import Dialog from './dialog';
import Fab from './fab';
import Sidebar from './sidebar';
import { useIsMobile } from '../hooks/use-mobile';
import { cn } from '@/lib/utils';

const Component: FCX = ({ className }) => {
  useInitialize();
  const isMobile = useIsMobile();

  return (
    <>
      <Dialog />
      <div className='🐸'>
        <div
          className={cn(`grid grid-cols-[auto_1fr] ${className}`, {
            'grid-cols-1': isMobile,
          })}
        >
          <Sidebar />
          <Calendar />
        </div>
      </div>
      <Fab />
    </>
  );
};

const StyledComponent = styled(Component)`
  font-family: 'Yu Gothic Medium', YuGothic, 'Noto Sans JP', メイリオ;
  background-color: #fff;
  color: hsl(var(--ribbit-foreground));
  border-color: hsl(var(--ribbit-border) / 0.7);
  --fc-border-color: hsl(var(--ribbit-border) / 0.7);

  --fc-button-bg-color: #fff;
  --fc-button-hover-bg-color: #d2e3fc;
  --fc-button-active-bg-color: #d2e3fc;
  --fc-button-border-color: transparent;
  --fc-button-hover-border-color: transparent;
  --fc-button-active-border-color: transparent;
  --fc-button-text-color: hsl(var(--ribbit-foreground));
  --fc-non-business-color: #6b728011;

  --fc-event-bg-color: #dbeafe;
  --fc-event-border-color: #dbeafe;
  --fc-event-text-color: #075985;
  --fc-event-hover-bg-color: #93c5fd;
  --fc-event-hover-border-color: #93c5fd;
  --fc-event-hover-text-color: #075985;
  --fc-event-active-bg-color: #93c5fd;
  --fc-event-active-border-color: #93c5fd;
  --fc-event-active-text-color: #075985;

  .fc .fc-scrollgrid,
  .fc .fc-timegrid-slot-minor {
    border-style: none;
  }

  .fc-toolbar-title {
    font-size: 1.125rem !important;
    font-weight: 500 !important;
  }

  .fc-button {
    transition: all 250ms ease !important;
  }

  .fc .fc-button:focus {
    box-shadow: none !important;
  }

  .fc {
    .fc-col-header-cell-cushion,
    .fc-daygrid-day-number {
      color: hsl(var(--ribbit-foreground) / 0.7) !important;
      font-weight: 500 !important;
      font-size: 14px !important;
    }
    .fc-timegrid-slot-label-cushion,
    .fc-timegrid-axis-cushion {
      color: hsl(var(--ribbit-foreground) / 0.5) !important;
      font-weight: 500 !important;
      font-size: 12px !important;
      line-height: 1.5 !important;
    }
    .fc-day.fc-day-sat {
      background-color: #f1f8ff88 !important;
    }
    .fc-day.fc-day-sun {
      background-color: #fff1f288 !important;
    }
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

  .fc-event-time,
  .fc-event-title-container {
    padding: 0.1rem 0.25rem;
  }
`;

const Container: FC = () => (
  <Provider store={store}>
    <PluginErrorBoundary>
      <Suspense fallback={<LoaderWithLabel label='読み込み中' />}>
        <SnackbarProvider maxSnack={1}>
          <ThemeProvider theme={createTheme({}, jaJP)}>
            <StyledComponent />
          </ThemeProvider>
        </SnackbarProvider>
      </Suspense>
    </PluginErrorBoundary>
  </Provider>
);

export default Container;
