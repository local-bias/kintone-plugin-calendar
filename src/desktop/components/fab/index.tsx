import React, { FCX } from 'react';
import { Fab, Tooltip } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import styled from '@emotion/styled';
import { useRecoilCallback } from 'recoil';
import { getDefaultEndDate, getDefaultStartDate } from '../../actions';
import { dialogPropsState, dialogShownState } from '../../states/dialog';

const Component: FCX = ({ className }) => {
  const onEventAdditionButtonClick = useRecoilCallback(
    ({ set }) =>
      () => {
        set(dialogPropsState, {
          new: true,
          event: {
            id: Math.random().toString(),
            title: '',
            start: getDefaultStartDate(),
            end: getDefaultEndDate(),
          },
        });
        set(dialogShownState, true);
      },
    []
  );

  return (
    <div className={className}>
      <Tooltip title='スケジュールを追加する'>
        <Fab
          variant='circular'
          size='large'
          color='primary'
          aria-label='add'
          onClick={onEventAdditionButtonClick}
        >
          <AddIcon />
        </Fab>
      </Tooltip>
    </div>
  );
};

const StyledComponent = styled(Component)`
  position: fixed;
  right: 2rem;
  bottom: 1rem;
  z-index: 10;
`;

export default StyledComponent;
