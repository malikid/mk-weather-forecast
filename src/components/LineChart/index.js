import React, {Component} from 'react';
import {observer} from 'mobx-react';
import {Line} from '@ant-design/charts';
import {Radio} from 'antd';
import {Card} from 'Styles/general';
import {Title, RadioContainer} from './styles';

@observer
class LineChart extends Component {
  render() {
    const {title, type, config, onTypeChange} = this.props;
    
    return (
      <Card>
        <Title>{title}</Title>
        <RadioContainer>
          <Radio.Group onChange={(e) => {onTypeChange(e.target.value)}} defaultValue="temp">
            <Radio.Button value="temp">Temperature</Radio.Button>
            <Radio.Button value="humidity">Humidity</Radio.Button>
            <Radio.Button value="clouds">Clouds</Radio.Button>
            <Radio.Button value="wind">Wind</Radio.Button>
          </Radio.Group>
        </RadioContainer>
        <Line {...config[type]} />
      </Card>
    );
  }
};

export default LineChart;

