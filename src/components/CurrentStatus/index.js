import React, {Component} from 'react';
import {inject, observer} from 'mobx-react';
import {Spin} from 'antd';
import {Container, WeatherIcon, WeatherDescription, WeatherDetail} from './styles';

@inject('store')
@observer
class CurrentStatus extends Component {
  render() {
    const {mainDescription, detailDescription, icon} = this.props;
    
    if(!mainDescription) {
      return null;
    }
    
    return (
      <Container>
        <WeatherIcon src={`https://openweathermap.org/img/wn/${icon}@2x.png`} />
        <WeatherDescription>{mainDescription}</WeatherDescription>
        {detailDescription && <WeatherDetail>{detailDescription}</WeatherDetail>}
      </Container>
    );
  }
};

export default CurrentStatus;
