import React, { Component } from 'react';
import styled from 'styled-components';
import { Card } from 'Styles/general';

export const Container = styled(Card)`
  min-width: 200px;
  align-items: center;
  justify-content: center;
`;

export const WeatherIcon = styled.span`
  font-size: 64px;
  line-height: 1;
`;

export const WeatherDescription = styled.div`
  font-size: xx-large;
`;

export const WeatherDetail = styled.div`
  font-size: medium;
`;
