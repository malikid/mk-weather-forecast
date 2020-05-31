import React, {Component} from 'react';
import { Line } from '@ant-design/charts';
import {Card} from 'Styles/general';

class LineChart extends Component {
  render() {
    return (
      <Card>
        <Line {...this.props.config} />
      </Card>
    );
  }
};

export default LineChart;

