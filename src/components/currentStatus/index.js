import React, {Component} from 'react';
import {Spin} from 'antd';

@inject('store')
@observer
class CurrentStatus extends Component {
  render() {
    const {currentInfo} = this.props.store.weatherPage;
    
    if(!currentInfo) {
      return <Spin />;
    }
    
    const {description, icon} = currentInfo.weather[0]
    
    return (
      <Container>
        
      </Container>
    );
  }
};

export default CurrentStatus;
