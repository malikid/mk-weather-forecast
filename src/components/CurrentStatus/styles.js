import React, {Component} from 'react';
import styled from 'styled-components';
import {Card} from 'Styles/general';

export const Container = styled(Card)`
  min-width: 200px;
  align-items: center;
  justify-content: center;
`;

export const  WeatherIcon = styled.img`
  object-fit: contain;
`;

export const  WeatherDescription = styled.div`
  font-size: xx-large;
`;

export const  WeatherDetail = styled.div`
  font-size: medium;
`;
