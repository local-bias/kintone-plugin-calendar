import { allAppViewsState } from '@/config/states/kintone';
import { loadingCountState, loadingState, viewIdState } from '@/config/states/plugin';
import { GUEST_SPACE_ID } from '@/lib/global';
import { VIEW_ROOT_ID } from '@/lib/static';
import { getAppId, getViews, kintoneAPI, updateViews } from '@konomi-app/kintone-utilities';
import { LoadingButton } from '@mui/lab';
import { useSnackbar } from 'notistack';
import React, { FC } from 'react';
import { useRecoilCallback, useRecoilValue } from 'recoil';

const Component: FC = () => {
  const loading = useRecoilValue(loadingState);
  const { enqueueSnackbar } = useSnackbar();

  const onClick = useRecoilCallback(
    ({ snapshot, set }) =>
      async () => {
        try {
          set(loadingCountState, (c) => c + 1);
          const allViews = await snapshot.getPromise(allAppViewsState);

          const views = Object.entries(allViews);

          let viewName = '📆 カレンダー';
          let counter = 1;
          while (views.some(([key, value]) => key === viewName)) {
            viewName = `📆 カレンダー (${counter})`;
            counter++;
          }

          const newViews: Record<string, kintoneAPI.view.Parameter> = {
            ...allViews,
            [viewName]: {
              type: 'CUSTOM',
              device: 'ANY',
              pager: false,
              name: viewName,
              html: `<div id='${VIEW_ROOT_ID}' class="🐸"></div>`,
              index: views.length,
            },
          };

          await updateViews({
            app: getAppId()!,
            views: newViews,
            debug: process.env.NODE_ENV === 'development',
            guestSpaceId: GUEST_SPACE_ID,
          });

          const latestViews = await getViews({
            app: getAppId()!,
            preview: true,
            guestSpaceId: GUEST_SPACE_ID,
            debug: process.env.NODE_ENV === 'development',
          });

          const viewId = latestViews.views[viewName].id;

          set(allAppViewsState, latestViews.views);
          set(viewIdState, viewId);
          enqueueSnackbar('一覧を作成しました', { variant: 'success' });
        } catch (error) {
          process.env.NODE_ENV === 'development' && console.error(error);
          enqueueSnackbar('一覧の作成に失敗しました', { variant: 'error' });
        } finally {
          set(loadingCountState, (c) => c - 1);
        }
      },
    []
  );

  return (
    <LoadingButton
      variant='outlined'
      color='primary'
      size='large'
      onClick={onClick}
      loading={loading}
    >
      一覧を新規作成
    </LoadingButton>
  );
};

export default Component;
