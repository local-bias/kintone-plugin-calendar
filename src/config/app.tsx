import React, { Suspense, FC } from 'react';
import { RecoilRoot } from 'recoil';
import { SnackbarProvider } from 'notistack';
import { PluginBanner, PluginContent, PluginLayout } from '@konomi-app/kintone-utilities-react';
import { PluginErrorBoundary } from '@/lib/components/error-boundary';
import Announcement from './components/announcement';
import Form from './components/form';
import Footer from './components/footer';
import Sidebar from './components/sidebar';
import { LoaderWithLabel } from '@konomi-app/ui-react';
import { URL_BANNER, URL_PROMOTION } from '@/lib/static';
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
  <div className='🐸'>
    <Suspense fallback={<LoaderWithLabel label='画面の描画を待機しています' />}>
      <RecoilRoot>
        <PluginErrorBoundary>
          <Announcement />
          <SnackbarProvider maxSnack={1}>
            <Suspense fallback={<LoaderWithLabel label='設定情報を取得しています' />}>
              <PluginLayout>
                <Component />
              </PluginLayout>
            </Suspense>
          </SnackbarProvider>
        </PluginErrorBoundary>
      </RecoilRoot>
      <iframe
        title='promotion'
        loading='lazy'
        src={URL_PROMOTION}
        className='border-0 w-full h-16'
      />
    </Suspense>
  </div>
);

export default Container;
