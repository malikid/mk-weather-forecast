import React, {Component} from 'react';
import {observer} from 'mobx-react';
import {Line} from '@ant-design/charts';
import {Menu, Dropdown, message} from 'antd';
import {DownOutlined} from '@ant-design/icons';
import {Card} from 'Styles/general';

@observer
class LineChart extends Component {
  render() {
    const {type, config, onTypeChange} = this.props;
    
    console.log('config[', type, ']', config[type]);
    
    const menu = (
      <Menu onClick={({key}) => {onTypeChange(key);}}>
        <Menu.Item key="temp">Temperature</Menu.Item>
        <Menu.Item key="humidity">Humidity</Menu.Item>
        <Menu.Item key="clouds">Clouds</Menu.Item>
        <Menu.Item key="wind">Wind</Menu.Item>
      </Menu>
    );
    
    return (
      <Card>
        <Dropdown overlay={menu}>
          <a className="ant-dropdown-link" onClick={e => e.preventDefault()}>
            Temperature <DownOutlined />
          </a>
        </Dropdown>
        <Line {...config[type]} />
      </Card>
    );
  }
};

export default LineChart;

