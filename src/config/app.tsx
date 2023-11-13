import React, { Suspense, FC } from 'react';
import { RecoilRoot } from 'recoil';
import { SnackbarProvider } from 'notistack';

import { PluginErrorBoundary } from '@/lib/components/error-boundary';
import Announcement from './components/announcement';
import Form from './components/form';
import Footer from './components/footer';
import { LoaderWithLabel } from '@konomi-app/ui-react';
import { URL_PROMOTION } from '@/lib/static';

const Component: FC = () => (
  <Suspense fallback={<LoaderWithLabel label='画面の描画を待機しています' />}>
    <RecoilRoot>
      <PluginErrorBoundary>
        <Announcement />
        <SnackbarProvider maxSnack={1}>
          <Suspense fallback={<LoaderWithLabel label='設定情報を取得しています' />}>
            <PluginErrorBoundary>
              <Form />
            </PluginErrorBoundary>
            <Footer />
          </Suspense>
        </SnackbarProvider>
      </PluginErrorBoundary>
    </RecoilRoot>
    <iframe
      title='promotion'
      loading='lazy'
      src={URL_PROMOTION}
      style={{ border: '0', width: '100%', height: '64px' }}
    />
  </Suspense>
);

export default Component;
