import React, {Component} from 'react';
import { Line } from '@ant-design/charts';

class LineChart extends Component {
  render() {
    return (
      <Line {...this.props.config} />
    );
  }
};

export default LineChart;

