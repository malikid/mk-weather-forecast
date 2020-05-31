import React, {Component} from 'react';
import {Line} from '@ant-design/charts';
import {Menu, Dropdown, message} from 'antd';
import {DownOutlined} from '@ant-design/icons';
import {Card} from 'Styles/general';

class LineChart extends Component {
  render() {
    const menu = (
      <Menu onClick={() => {}}>
        <Menu.Item key="1">Temperature</Menu.Item>
        <Menu.Item key="2">Humidity</Menu.Item>
        <Menu.Item key="3">Clouds</Menu.Item>
        <Menu.Item key="4">Wind</Menu.Item>
      </Menu>
    );
    
    return (
      <Card>
        <Dropdown overlay={menu}>
          <a className="ant-dropdown-link" onClick={e => e.preventDefault()}>
            Choose a type <DownOutlined />
          </a>
        </Dropdown>
        <Line {...this.props.config} />
      </Card>
    );
  }
};

export default LineChart;

