import React from 'react';
import styled from 'styled-components';

export const Card = styled.div`
  flex: 1 0 calc(25% - 10px);
  margin: 10px;
  padding: 20px;
  box-shadow: 0 10px 16px 0 rgba(0,0,0,0.2),0 6px 20px 0 rgba(0,0,0,0.19);

  display: flex;
  flex-direction: column;

  position: relative;

  &:after {
    content: '';
    display: block;
  }

  &:hover {
    transform: translate(-10px, -10px);
  }
`;
