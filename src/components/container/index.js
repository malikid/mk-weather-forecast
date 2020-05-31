import React from 'react';
import {Container} from './style';

function ResposiveContainer() {
  return (
    <Container>{this.props.children}</Container>
  );
};

export default ResposiveContainer;