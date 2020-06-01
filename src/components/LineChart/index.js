import React, {Component} from 'react';
import {observer} from 'mobx-react';
import {Line} from '@ant-design/charts';
import {Menu, Dropdown, message} from 'antd';
import {DownOutlined} from '@ant-design/icons';
import {Card} from 'Styles/general';
import {Title} from './styles';

@observer
class LineChart extends Component {
  render() {
    const {title, type, config, onTypeChange} = this.props;
    
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
        <Title>{title}</Title>
        {false && <Dropdown overlay={menu}>
          <a className="ant-dropdown-link" onClick={e => e.preventDefault()}>
            Temperature <DownOutlined />
          </a>
        </Dropdown>}
        <Radio.Group onChange={onTypeChange} defaultValue="temp">
          <Radio.Button value="temp">Temperature</Radio.Button>
          <Radio.Button value="humidity">Humidity</Radio.Button>
          <Radio.Button value="clouds">Clouds</Radio.Button>
          <Radio.Button value="d">Chengdu</Radio.Button>
        </Radio.Group>
        <Line {...config[type]} />
      </Card>
    );
  }
};

export default LineChart;

