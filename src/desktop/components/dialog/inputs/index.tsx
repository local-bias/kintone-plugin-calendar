import React, { FCX } from 'react';
import styled from '@emotion/styled';

import Title from './title';
import StartEnd from './start-end';
import Note from './note';

const Component: FCX = ({ className }) => (
  <div className={className}>
    <Title />
    <StartEnd />
    <Note />
  </div>
);

const StyledComponent = styled(Component)`
  padding: 1rem;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;

  > div {
    display: flex;
    gap: 1rem;

    &.full {
      align-items: stretch;
      flex-direction: column;
    }
  }
`;

export default StyledComponent;
