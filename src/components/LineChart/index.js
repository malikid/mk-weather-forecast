import React, {Component} from 'react';
import { Line } from '@ant-design/charts';
import {Container} from 'Styles/general';

class LineChart extends Component {
  render() {
    return (
      <Container>
        <Line {...this.props.config} />
      </Container>
    );
  }
};

export default LineChart;

