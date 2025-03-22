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

  .fc-toolbar-title {
    font-size: 1.5rem;
    font-weight: 600;
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
