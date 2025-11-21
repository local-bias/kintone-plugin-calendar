import { PluginErrorBoundary } from '@/lib/components/error-boundary';
import { URL_BANNER, URL_PROMOTION } from '@/lib/static';
import { store } from '@/lib/store';
import { PluginBanner, PluginContent, PluginLayout } from '@konomi-app/kintone-utilities-react';
import { LoaderWithLabel } from '@konomi-app/ui-react';
import { Provider } from 'jotai';
import { SnackbarProvider } from 'notistack';
import { FC, Suspense } from 'react';
import Announcement from './components/announcement';
import Footer from './components/footer';
import Form from './components/form';
import Sidebar from './components/sidebar';
import { useInitialize } from './hooks/use-initialize';

const Component: FC = () => {
  useInitialize();
  return (
    <>
      <Sidebar />
      <PluginContent>
        <PluginErrorBoundary>
          <Form />
        </PluginErrorBoundary>
      </PluginContent>
      <PluginBanner url={URL_BANNER} />
      <Footer />
    </>
  );
};

const Container: FC = () => (
  <Provider store={store}>
    <div className='🐸'>
      <Suspense fallback={<LoaderWithLabel label='画面の描画を待機しています' />}>
        <PluginErrorBoundary>
          <Announcement />
          <SnackbarProvider maxSnack={1} anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}>
            <Suspense fallback={<LoaderWithLabel label='設定情報を取得しています' />}>
              <PluginLayout>
                <Component />
              </PluginLayout>
            </Suspense>
          </SnackbarProvider>
        </PluginErrorBoundary>
        <iframe
          title='promotion'
          loading='lazy'
          src={URL_PROMOTION}
          className='border-0 w-full h-16'
        />
      </Suspense>
    </div>
  </Provider>
);

export default Container;
