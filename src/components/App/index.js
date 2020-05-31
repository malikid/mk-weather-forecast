import React, {Component} from 'react';
import {inject, observer} from 'mobx-react';
import {Spin} from 'antd';

import CurrentStatus from 'Components/currentStatus';
import Metric from 'Components/metric';

import {
  PageContainer,
  CurrentContainer,
  CurrentStatusContainer,
  CurrentInfoContainer,
  TodayContainer,
  NextContainer
} from './styles';

@inject('store')
@observer
class App extends Component {
  componentDidMount(prevProps) {
    this.props.store.weather.page.fetchWeatherData();
  }

  render() {
    const {loading, currentInfo} = this.props.store.weatherPage;
    
    if(loading) {
      return <Spin />;
    }
    
    return (
      <PageContainer>
        <CurrentContainer>
          <CurrentStatusContainer>
            <CurrentStatus />
          </CurrentStatusContainer>
          <CurrentInfoContainer>
          </CurrentInfoContainer>
        </CurrentContainer>
        <TodayContainer>
        </TodayContainer>
        <NextContainer>
        </NextContainer>
      </PageContainer>
    );
  }
};

export default App;
