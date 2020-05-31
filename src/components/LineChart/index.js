import React, {Component} from 'react';
import { Line } from '@ant-design/charts';

class LineChart extends Component {
  render() {
    const config = {
      data,
      title: {
        visible: true,
        text: 'LineChart',
      },
      xField: 'year',
      yField: 'value',
    };
    return (
      <Line {...config} />
    );
  }
};

export default LineChart;

