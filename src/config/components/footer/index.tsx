import { getViews, storeStorage, updateViews } from '@konomi-app/kintone-utilities';
import SaveIcon from '@mui/icons-material/Save';
import SettingsBackupRestoreIcon from '@mui/icons-material/SettingsBackupRestore';
import { Button, CircularProgress } from '@mui/material';
import { useSnackbar } from 'notistack';
import React, { FC, useCallback } from 'react';
import { useRecoilCallback, useRecoilValue } from 'recoil';

import { PluginFooter } from '@konomi-app/kintone-utilities-react';
import { loadingCountState, loadingState, storageState } from '../../states/plugin';

import ExportButton from './export-button';
import ImportButton from './import-button';
import ResetButton from './reset-button';
import { getAppId } from '@lb-ribbit/kintone-xapp';
import { GUEST_SPACE_ID } from '@/lib/global';
import { produce } from 'immer';
import { VIEW_ROOT_ID } from '@/lib/static';

type Props = {
  onSaveButtonClick: () => void;
  onBackButtonClick: () => void;
};

const Component: FC<Props> = ({ onSaveButtonClick, onBackButtonClick }) => {
  const loading = useRecoilValue(loadingState);

  return (
    <PluginFooter className='py-2'>
      <div className='flex items-center gap-4'>
        <Button
          variant='contained'
          color='primary'
          disabled={loading}
          onClick={onSaveButtonClick}
          startIcon={loading ? <CircularProgress color='inherit' size={20} /> : <SaveIcon />}
        >
          設定を保存
        </Button>
        <Button
          variant='contained'
          color='inherit'
          disabled={loading}
          onClick={onBackButtonClick}
          startIcon={
            loading ? <CircularProgress color='inherit' size={20} /> : <SettingsBackupRestoreIcon />
          }
        >
          プラグイン一覧へ戻る
        </Button>
      </div>
      <div className='flex items-center gap-4'>
        <ExportButton />
        <ImportButton />
        <ResetButton />
      </div>
    </PluginFooter>
  );
};

const Container: FC = () => {
  const { enqueueSnackbar } = useSnackbar();

  const onBackButtonClick = useCallback(() => history.back(), []);

  const onSaveButtonClick = useRecoilCallback(
    ({ set, snapshot }) =>
      async () => {
        set(loadingCountState, (c) => c + 1);
        try {
          const storage = await snapshot.getPromise(storageState);

          const app = getAppId()!;
          const { views } = await getViews({
            app,
            preview: true,
            guestSpaceId: GUEST_SPACE_ID,
            debug: process.env.NODE_ENV === 'development',
          });

          const newViews = produce(views, (draft) => {
            for (const condition of storage?.conditions || []) {
              for (const view of Object.values(draft)) {
                if (view.id === condition.viewId && view.type === 'CUSTOM') {
                  view.html = `<div id='${VIEW_ROOT_ID}' class="🐸"></div>`;
                  view.pager = false;
                }
              }
            }
          });

          await updateViews({
            app,
            views: newViews,
            guestSpaceId: GUEST_SPACE_ID,
          });

          storeStorage(storage!, () => true);
          enqueueSnackbar('設定を保存しました', {
            variant: 'success',
            action: (
              <Button color='inherit' onClick={onBackButtonClick}>
                プラグイン一覧に戻る
              </Button>
            ),
          });
        } finally {
          set(loadingCountState, (c) => c - 1);
        }
      },
    []
  );

  return <Component {...{ onSaveButtonClick, onBackButtonClick }} />;
};

export default Container;
