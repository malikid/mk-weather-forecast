import React, {Component} from 'react';
import {
  Container,
  Title,
  Description
} from './styles';

class Metric extends Component {
  render() {
    const {title, description} = this.props;
    return (
      <Container>
        <Title>{title}</Title>
        {description && <Description>{description}</Description>}
      </Container>
    );
  }
};

export default Metric;
