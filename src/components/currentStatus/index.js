import React, {Component} from 'react';
import {inject, observer} from 'mobx-react';
import {Spin} from 'antd';
import {Container, WeatherIcon, WeatherDescription} from './styles';

@inject('store')
@observer
class CurrentStatus extends Component {
  render() {
    const {currentInfo} = this.props.store.weatherPage;
    
    if(!currentInfo) {
      return <Spin />;
    }
    
    const {main, description, icon} = currentInfo.weather[0];
    
    return (
      <Container>
        <WeatherIcon src={`https://openweathermap.org/img/wn/${icon}@2x.png`} />
        <WeatherDescription>{main}</WeatherDescription>
      </Container>
    );
  }
};

export default CurrentStatus;
