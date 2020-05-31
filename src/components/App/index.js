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
  render() {
    const {loading, currentInfo} = this.props.store.weatherPage;
    
    if(loading) {
      return <Spin />;
    }
    
    const {
      main: {
        temp,
        humidity,
      },
      clouds,
      wind,
    } = currentInfo;
    
    return (
      <PageContainer>
        <CurrentContainer>
          <CurrentStatusContainer>
            <CurrentStatus />
          </CurrentStatusContainer>
          <CurrentInfoContainer>
            <Metric title={temp} />
            <Metric title={temp} />
            <Metric title={temp} />
            <Metric title={temp} />
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
