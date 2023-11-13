import React, { FC, FCX, useCallback } from 'react';
import { useRecoilCallback, useRecoilValue } from 'recoil';
import styled from '@emotion/styled';
import { useSnackbar } from 'notistack';
import { Button } from '@mui/material';
import SaveIcon from '@mui/icons-material/Save';
import SettingsBackupRestoreIcon from '@mui/icons-material/SettingsBackupRestore';

import { storeStorage } from '@/lib/plugin';
import { loadingState, storageState } from '../states/plugin';
import { produce } from 'immer';
import { VIEW_ROOT_ID } from '@/lib/static';
import { getViews, updateViews } from '@konomi-app/kintone-utilities';
import { getAppId } from '@lb-ribbit/kintone-xapp';
import { GUEST_SPACE_ID } from '@/lib/global';

type Props = {
  onSaveButtonClick: () => void;
  onBackButtonClick: () => void;
};

const Component: FCX<Props> = ({ className, onSaveButtonClick, onBackButtonClick }) => {
  const loading = useRecoilValue(loadingState);

  return (
    <div {...{ className }}>
      <Button
        variant='contained'
        color='primary'
        disabled={loading}
        onClick={onSaveButtonClick}
        startIcon={<SaveIcon />}
      >
        設定を保存
      </Button>
      <Button
        variant='contained'
        color='inherit'
        disabled={loading}
        onClick={onBackButtonClick}
        startIcon={<SettingsBackupRestoreIcon />}
      >
        プラグイン一覧へ戻る
      </Button>
    </div>
  );
};

const StyledComponent = styled(Component)`
  position: sticky;
  bottom: 0px;
  margin-top: 20px;
  background-color: #fff;
  border-top: 1px solid #eee;
  z-index: 10;

  button {
    margin: 8px;
  }
`;

const Container: FC = () => {
  const { enqueueSnackbar } = useSnackbar();

  const onBackButtonClick = useCallback(() => history.back(), []);

  const onSaveButtonClick = useRecoilCallback(
    ({ set, snapshot }) =>
      async () => {
        set(loadingState, true);
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
                  view.html = `<div id='${VIEW_ROOT_ID}'></div>`;
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
          set(loadingState, false);
        }
      },
    []
  );

  return <StyledComponent {...{ onSaveButtonClick, onBackButtonClick }} />;
};

export default Container;
