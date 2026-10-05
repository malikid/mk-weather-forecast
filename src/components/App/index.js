import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import { Spin } from 'antd';
import { EnvironmentOutlined } from '@ant-design/icons';
import isEmpty from 'lodash/isEmpty';

import CurrentStatus from 'Components/CurrentStatus';
import Metric from 'Components/Metric';
import LineChart from 'Components/LineChart';

import {
  SpinnerErrorContainer,
  PageContainer,
  WeatherNowRow,
  WeatherNowTitle,
  LocationLabel,
  LocationAttribution,
  SectionHeader,
  CurrentContainer,
  CurrentStatusContainer,
  CurrentInfoContainer,
  Column,
  TodayContainer,
  NextContainer,
} from './styles';

@inject('store')
@observer
class App extends Component {
  componentDidMount(prevProps) {
    this.props.store.weatherPage.fetchWeatherData();
  }

  render() {
    const {
      loading,
      error,
      currentCity,
      currentInfo,
      todayInfo,
      nextInfo,
      todayLineChartType,
      nextLineChartType,
      setTodayLineChartType,
      setNextLineChartType
    } = this.props.store.weatherPage;

    if (error) {
      return (
        <SpinnerErrorContainer>
          <div>Something went wrong...</div>
        </SpinnerErrorContainer>
      );
    }

    if (loading || isEmpty(currentInfo)) {
      return (
        <SpinnerErrorContainer>
          <Spin />
        </SpinnerErrorContainer>
      );
    }

    const {
      mainDescription,
      detailDescription,
      icon,
      temp,
      feelsLike,
      humidity,
      clouds,
      wind,
      rain,
    } = currentInfo;

    return (
      <PageContainer>
        <WeatherNowRow>
          <WeatherNowTitle>WEATHER NOW</WeatherNowTitle>
          <LocationLabel>
            <EnvironmentOutlined aria-hidden="true" />
            <span>{currentCity || 'Your location'}</span>
          </LocationLabel>
        </WeatherNowRow>
        <CurrentContainer>
          <Column>
            <CurrentStatus mainDescription={mainDescription} detailDescription={detailDescription} icon={icon} />
          </Column>
          <Column>
            <Metric
              title={'Temperature'}
              description={temp}
              subDescription={feelsLike}
              subDescriptionAlign="right"
            />
            <Metric title={'Humidity'} description={humidity} />
            {rain && (
              <Metric
                title={'Rain today'}
                description={rain.total || rain.chance}
                subDescription={rain.total ? rain.chance : ''}
                subDescriptionAlign="right"
              />
            )}
          </Column>
          <Column>
            <Metric title={'Clouds'} description={clouds} />
            <Metric
              title={'Wind'}
              description={wind.speed}
              subDescription={wind.degree}
              arrowDegrees={wind.arrowDegrees}
            />
          </Column>
        </CurrentContainer>
        <SectionHeader>WEATHER TODAY</SectionHeader>
        <TodayContainer>
          <LineChart
            type={todayLineChartType}
            config={todayInfo}
            onTypeChange={setTodayLineChartType}
          />
        </TodayContainer>
        <SectionHeader>WEATHER IN 3 DAYS</SectionHeader>
        <NextContainer>
          <LineChart
            type={nextLineChartType}
            config={nextInfo}
            onTypeChange={setNextLineChartType}
          />
        </NextContainer>
        <LocationAttribution>Place names © OpenStreetMap contributors</LocationAttribution>
      </PageContainer>
    );
  }
};

export default App;
