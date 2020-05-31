import React, {Component} from 'react';
import {Line} from '@ant-design/charts';
import {Menu, Dropdown, message} from 'antd';
import {DownOutlined} from '@ant-design/icons';
import {Card} from 'Styles/general';

class LineChart extends Component {
  render() {
    const menu = (
      <Menu onClick={() => {}}>
        <Menu.Item key="1">1st menu item</Menu.Item>
        <Menu.Item key="2">2nd memu item</Menu.Item>
        <Menu.Item key="3">3rd menu item</Menu.Item>
      </Menu>
    );
    
    return (
      <Card>
        <Dropdown overlay={menu}>
          <a className="ant-dropdown-link" onClick={e => e.preventDefault()}>
            Hover me, Click menu item <DownOutlined />
          </a>
        </Dropdown>
        <Line {...this.props.config} />
      </Card>
    );
  }
};

export default LineChart;

