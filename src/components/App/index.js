import React, {Component} from 'react';

import CurrentStatus from 'Components/currentStatus';
import Metric from 'Components/metric';

import {
  CurrentContainer,
  CurrentStatusContainer,
  CurrentInfoContainer,
  TodayContainer,
  NextContainer
} from './styles';

class App extends Component {
  return (
    <div className="App">
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
    </div>
  );
}

export default App;
