import React, { Suspense, FC } from 'react';
import { RecoilRoot } from 'recoil';
import { SnackbarProvider } from 'notistack';

import { restoreStorage } from '@/common/plugin';
import { ErrorBoundary } from '@/common/components/error-boundary';

import Form from './components/form';
import Footer from './components/footer';
import SocialIcons from './components/social-icons';
import { pluginIdState, storageState } from './states/plugin';
import { LoaderWithLabel } from '@konomi-app/ui-react';
import { URL_PROMOTION } from '@/common/static';

const Component: FC<{ pluginId: string }> = ({ pluginId }) => (
  <Suspense fallback={<LoaderWithLabel label='画面の描画を待機しています' />}>
    <RecoilRoot
      initializeState={({ set }) => {
        set(pluginIdState, pluginId);
        set(storageState, restoreStorage(pluginId));
      }}
    >
      <ErrorBoundary>
        <SnackbarProvider maxSnack={1}>
          <Suspense fallback={<LoaderWithLabel label='設定情報を取得しています' />}>
            <Form />
            <Footer />
          </Suspense>
        </SnackbarProvider>
      </ErrorBoundary>
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
