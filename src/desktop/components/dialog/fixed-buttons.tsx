import React, { FCX } from 'react';
import { useRecoilCallback } from 'recoil';
import { Fab, Tooltip } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import { getAppId } from '@lb-ribbit/kintone-xapp';
import { dialogPropsState, dialogShownState } from '../../states/dialog';
import { calendarEventsState } from '../../states/calendar';
import { loadingState } from '../../states/kintone';
import { kintoneClient } from '@common/kintone-api';
import { useSnackbar } from 'notistack';
import styled from '@emotion/styled';

const Component: FCX<{ new: boolean }> = (props) => {
  const { enqueueSnackbar } = useSnackbar();

  const onRemoveButtonClick = useRecoilCallback(
    ({ reset, set, snapshot }) =>
      async () => {
        set(loadingState, true);
        try {
          const currentProps = await snapshot.getPromise(dialogPropsState);
          const eventId = currentProps.event.id;
          if (!eventId) {
            throw '対象イベントに紐づくレコード情報の取得に失敗しました、一覧を再表示した上で再度お試しください';
          }

          set(calendarEventsState, (current) => current.filter((event) => event.id !== eventId));
          reset(dialogShownState);
          reset(dialogPropsState);
          const app = getAppId()!;
          await kintoneClient.record.deleteRecords({ app, ids: [eventId] });
          enqueueSnackbar('レコードの削除が完了しました', { variant: 'success' });
        } finally {
          set(loadingState, false);
        }
      },
    []
  );

  return (
    <div className={props.className}>
      {!props.new && (
        <Tooltip title='このイベントを削除する'>
          <Fab className='icon' color='inherit' size='small' onClick={onRemoveButtonClick}>
            <DeleteIcon />
          </Fab>
        </Tooltip>
      )}
    </div>
  );
};

const StyledComponent = styled(Component)`
  position: absolute;
  right: 1rem;
  top: 1rem;

  .icon {
    box-shadow: none;
  }
`;

export default StyledComponent;
