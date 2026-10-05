import React, {Component} from 'react';
import {inject, observer} from 'mobx-react';
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
        <WeatherIcon aria-hidden="true">{icon}</WeatherIcon>
        <WeatherDescription>{mainDescription}</WeatherDescription>
        {detailDescription && <WeatherDetail>{detailDescription}</WeatherDetail>}
      </Container>
    );
  }
};

export default CurrentStatus;
