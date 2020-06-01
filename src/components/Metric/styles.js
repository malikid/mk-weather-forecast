import React from 'react';
import styled from 'styled-components';
import {Card} from 'Styles/general';

export const Container = styled(Card)`
  min-width: 100px;
  align-items: center;
  justify-content: center;
`;

export const Title = styled.div`
  position: absolute;
  top: 10px;
  left: 10px;
  font-size: x-small;;
  font-weight: bold;
`;

export const Description = styled.div`
  font-size: xx-large;
`;
