import React, { Component } from 'react';
import { Container, Title, Description, SubDescription } from './styles';

class Metric extends Component {
  render() {
    const { title, description, subDescription, subDescriptionAlign } = this.props;
    return (
      <Container>
        <Title>{title}</Title>
        <Description>{description}</Description>
        {subDescription && (
          <SubDescription align={subDescriptionAlign}>
            {subDescription}
          </SubDescription>
        )}
      </Container>
    );
  }
};

export default Metric;
