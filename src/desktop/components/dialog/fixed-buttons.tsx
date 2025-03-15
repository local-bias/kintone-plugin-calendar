import styled from '@emotion/styled';
import { isMobile } from '@konomi-app/kintone-utilities';
import DeleteIcon from '@mui/icons-material/Delete';
import InsertDriveFileIcon from '@mui/icons-material/InsertDriveFile';
import { IconButton, Tooltip } from '@mui/material';
import { useAtomValue, useSetAtom } from 'jotai';
import { FCX } from 'react';
import { handleCalendarEventDeleteAtom } from '../../states/calendar';
import { dialogPropsAtom } from '../../states/dialog';

const Component: FCX = ({ className }) => {
  const props = useAtomValue(dialogPropsAtom);
  const handleEventDelete = useSetAtom(handleCalendarEventDeleteAtom);

  return (
    <div className={className}>
      {!props.new && (
        <>
          <Tooltip title='このイベントの詳細'>
            <a href={`${location.pathname}show${isMobile() ? '?' : '#'}record=${props.event.id}`}>
              <IconButton className='icon' color='inherit' size='small'>
                <InsertDriveFileIcon />
              </IconButton>
            </a>
          </Tooltip>
          <Tooltip title='このイベントを削除する'>
            <IconButton className='icon' color='inherit' size='small' onClick={handleEventDelete}>
              <DeleteIcon />
            </IconButton>
          </Tooltip>
        </>
      )}
    </div>
  );
};

const StyledComponent = styled(Component)`
  position: absolute;
  right: 1rem;
  top: 1rem;

  display: flex;
  align-items: center;
  gap: 8px;

  color: #0009;
  a {
    color: #0009;
  }

  .icon {
    box-shadow: none;
  }
`;

export default StyledComponent;
