import React, {Component} from 'react';
import {inject, observer} from 'mobx-react';
import {Spin} from 'antd';
import isEmpty from 'lodash/isEmpty';

import CurrentStatus from 'Components/CurrentStatus';
import Metric from 'Components/Metric';
import LineChart from 'Components/LineChart';

import {
  SpinnerContainer,
  PageContainer,
  CurrentContainer,
  CurrentStatusContainer,
  CurrentInfoContainer,
  Column,
  TodayContainer,
  NextContainer
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
      currentInfo,
      todayInfo,
      nextInfo,
      todayLineChartType,
      nextLineChartType,
      setTodayLineChartType,
      setNextLineChartType
    } = this.props.store.weatherPage;
    
    if(loading || isEmpty(currentInfo)) {
      return (
        <SpinnerContainer>
          <Spin />
        </SpinnerContainer>
      );
    }
    
    const {
      mainDescription,
      detailDescription,
      icon,
      temp,
      humidity,
      clouds,
      wind
    } = currentInfo;
    
    return (
      <PageContainer>
        <CurrentContainer>
          <Column>
            <CurrentStatus mainDescription={mainDescription} detailDescription={detailDescription} icon={icon}/>
          </Column>
          <Column>
            <Metric title={'Temperature'} description={temp} />
            <Metric title={'Humidity'} description={humidity} />
          </Column>
          <Column>
            <Metric title={'Clouds'} description={clouds} />
            <Metric title={'Wind'} description={wind.speed} subDescription={wind.deg} />
          </Column>
        </CurrentContainer>
        <TodayContainer>
          <LineChart type={todayLineChartType} config={todayInfo} onTypeChange={setTodayLineChartType} />
        </TodayContainer>
        <NextContainer>
          <LineChart type={nextLineChartType} config={nextInfo} onTypeChange={setNextLineChartType} />
        </NextContainer>
      </PageContainer>
    );
  }
};

export default App;
