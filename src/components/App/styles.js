import React from 'react';
import styled from 'styled-components';

export const SpinnerErrorContainer = styled.div`
  height: 100%;
  padding: 50px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;

export const PageContainer = styled.div`
  padding: 50px;
  display: flex;
  flex-direction: column;
  flex-wrap: wrap;
`;

export const WeatherNowRow = styled.div`
  display: grid;
  grid-template-columns: minmax(0, 1fr) auto minmax(0, 1fr);
  align-items: center;
  margin-top: 20px;

  @media (max-width: 700px) {
    grid-template-columns: minmax(0, 1fr);
  }
`;

export const LocationLabel = styled.div`
  grid-column: 3;
  justify-self: end;
  align-self: end;
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 6px;
  margin: 15px 10px;
  color: #555;
  text-align: right;
  font-size: medium;
  font-weight: 600;

  @media (max-width: 700px) {
    grid-column: 1;
  }
`;

export const LocationAttribution = styled.div`
  margin-top: 2px;
  color: #777;
  text-align: center;
  font-size: x-small;
`;

export const SectionHeader = styled.div`
  margin-top: 20px;
  text-align: center;
  font-size: xxx-large;
`;

export const WeatherNowTitle = styled(SectionHeader)`
  grid-column: 2;
  margin-top: 0;

  @media (max-width: 700px) {
    grid-column: 1;
  }
`;

export const CurrentContainer = styled.div`
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
`;

export const Column = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  flex-wrap: wrap;
`;

export const TodayContainer = styled.div``;

export const NextContainer = styled.div``;
