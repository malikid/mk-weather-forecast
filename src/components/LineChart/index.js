import React, { Component } from 'react';
import { observer } from 'mobx-react';
import { Line } from '@ant-design/charts';
import { Radio } from 'antd';
import { Card } from 'Styles/general';
import { RadioContainer } from './styles';

@observer
class LineChart extends Component {
  render() {
    const { type, config, onTypeChange } = this.props;

    return (
      <Card>
        <RadioContainer>
          <Radio.Group onChange={(e) => { onTypeChange(e.target.value) }} defaultValue="temp">
            <Radio.Button value="temp">Temperature (°C)</Radio.Button>
            <Radio.Button value="humidity">Humidity (%)</Radio.Button>
            <Radio.Button value="clouds">Clouds (%)</Radio.Button>
            <Radio.Button value="wind">Wind (m/s)</Radio.Button>
            <Radio.Button value="rain">Rain (mm)</Radio.Button>
            <Radio.Button value="rainChance">Rain chance (%)</Radio.Button>
          </Radio.Group>
        </RadioContainer>
        <Line {...config[type]} />
      </Card>
    );
  }
};

export default LineChart;

