import React, {Component} from 'react';
import {Title, Description} from './styles';
import {Container} from 'Styles/general';

class Metric extends Component {
  render() {
    const {title, description, subDescription} = this.props;
    return (
      <Container>
        <Title>{title}</Title>
        <Description>{description}</Description>
        {subDescription && <Description>{subDescription}</Description>}
      </Container>
    );
  }
};

export default Metric;
