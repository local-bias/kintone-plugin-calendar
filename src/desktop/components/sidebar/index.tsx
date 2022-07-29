import styled from '@emotion/styled';
import { Button } from '@mui/material';
import produce from 'immer';
import React, { FC, FCX } from 'react';
import { useRecoilCallback, useRecoilValue } from 'recoil';
import { calendarEventsState } from '../../states/calendar';
import { sidebarExpandedState } from '../../states/sidebar';
import { Squash as Hamburger } from 'hamburger-react';

const Component: FCX<{ expanded: boolean }> = ({ className, expanded }) => {
  const onToggleHamburger = useRecoilCallback(
    ({ set }) =>
      (toggled: boolean) => {
        set(sidebarExpandedState, toggled);
      },
    []
  );

  return (
    <div className={className}>
      <div className='container'>
        <Hamburger toggled={expanded} onToggle={onToggleHamburger} color='#1976d2' />
        <div className='content'>
          {expanded && (
            <>
              <img src='https://loosedrawing.com/wp/wp-content/uploads/2022/01/b1166.png' />
              <div>
                ラジオボタンやチェックボックスに基づき、色分けされた複数カテゴリーのスケジュールを表示・非表示にできる機能をここに実装する予定です。
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

const StyledComponent = styled(Component)`
  transition: all 250ms ease;
  width: ${({ expanded }) => (expanded ? 250 : 40)}px;

  .container {
    position: sticky;
    top: 3rem;
    height: calc(100vh - 3rem);
  }

  .content {
    padding: 2rem 0.5rem;
    color: #61717a;
  }

  img {
    width: 100%;
    height: auto;
    opacity: 0.7;
  }
`;

const Container: FC = () => {
  const expanded = useRecoilValue(sidebarExpandedState);

  return <StyledComponent expanded={expanded} />;
};

export default Container;
