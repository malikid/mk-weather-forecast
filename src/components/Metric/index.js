import React, { Component } from 'react';
import { Container, Title, Description, SubDescription, DirectionArrow } from './styles';

class Metric extends Component {
  render() {
    const {
      title,
      description,
      subDescription,
      subDescriptionAlign,
      arrowDegrees,
    } = this.props;
    return (
      <Container>
        <Title>{title}</Title>
        <Description>
          {arrowDegrees != null && (
            <DirectionArrow
              aria-hidden="true"
              style={{ transform: `rotate(${arrowDegrees}deg)` }}
            >
              ↑
            </DirectionArrow>
          )}
          {description}
        </Description>
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
