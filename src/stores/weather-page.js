import {observable, action, computed} from 'mobx';
import axios from 'axios';
import {reduce, isEmpty, slice, cloneDeep, map} from 'lodash';
import moment from 'moment';

import {API_KEY} from 'Config';

class WeatherPage {
  defaultLineChartConfig = {
    title: {
      visible: false,
      text: 'Line Chart',
    },
    description: {
      visible: false,
      text: '',
    },
    padding: 'auto',
    forceFit: true,
    data: [],
    xField: 'datetime',
    yField: 'value',
    responsive: true,
  };

  @observable loading = false;
  @observable error;
  @observable currentCity;
  @observable hourlyInfoList = [];
  @observable todayLineChartType = 'temp';
  @observable nextLineChartType = 'temp';

  @computed
  get currentInfo() {
    if(isEmpty(this.hourlyInfoList)) {
      return {};
    }
    
    const {
      main: {
        temp,
        humidity,
      },
      weather,
      clouds,
      wind,
    } = this.hourlyInfoList[0];
    const {main, description, icon} = weather[0];
    
    const hasCloudsInfo = !isEmpty(clouds);
    const hasWindInfo = !isEmpty(wind);
    const wordingForNoInfo = 'No Info';
    
    return {
      mainDescription: main,
      detailDescription: description,
      icon,
      temp: `${temp}°C`,
      humidity: `${humidity}%`,
      clouds: hasCloudsInfo ? `${clouds.all}%` : wordingForNoInfo,
      wind: {
        speed: hasWindInfo ? `${wind.speed} meter/sec` : wordingForNoInfo,
        degree: hasWindInfo ? `${wind.degree} degrees` : wordingForNoInfo
      }
    };
  }

  generateBaseConfig = (type) => {
    let config = cloneDeep(this.defaultLineChartConfig);
    config.yField = type;
    return config;
  };

  transformInfoListToLineChartConfigs = (infoList) => {
    return reduce(infoList, (result, hourlyInfo) => {
      const datetime = moment(hourlyInfo.dt, 'X').format('MMM D HH[h]');
      
      result.temp.data.push({
        datetime,
        temp: hourlyInfo.main.temp
      });
      result.humidity.data.push({
        datetime,
        humidity: hourlyInfo.main.humidity
      });
      result.clouds.data.push({
        datetime,
        clouds: hourlyInfo.clouds.all
      });
      result.wind.data.push({
        datetime,
        wind: hourlyInfo.wind.speed
      });
      return result;
    }, {
      temp: this.generateBaseConfig('temp'),
      humidity: this.generateBaseConfig('humidity'),
      clouds: this.generateBaseConfig('clouds'),
      wind: this.generateBaseConfig('wind')
    });
  };

  @computed
  get todayInfo() {
    if(isEmpty(this.hourlyInfoList)) {
      return {};
    }

    const todayHourlyInfoList = slice(this.hourlyInfoList, 0, 12);
    return this.transformInfoListToLineChartConfigs(todayHourlyInfoList);
  }

  @computed
  get nextInfo() {
    if(isEmpty(this.hourlyInfoList)) {
      return {};
    }

    const nextHourlyInfoList = slice(this.hourlyInfoList, 12, 96);
    return this.transformInfoListToLineChartConfigs(nextHourlyInfoList);
  }

  @action
  setLoading = (value) => (this.loading = value);

  @action
  setError = (value) => (this.error = value);

  @action
  setCurrentCity = (value) => (this.currentCity = value);

  @action
  setCurrentInfo = (value) => (this.currentInfo = value);

  @action
  setHourlyInfoList = (list) => {
    this.hourlyInfoList = map(list, item => {
      const temp = parseInt(item.main.temp);
      item.main.temp = temp > 200 ? Math.trunc(parseInt(item.main.temp) - 273.15) : temp;
      return item;
    });
  };

  @action
  setTodayLineChartType = (type) => (this.todayLineChartType = type);

  @action
  setNextLineChartType = (type) => (this.nextLineChartType = type);

  getCurrentLocation = (options = []) => {
    navigator.geolocation.getCurrentPosition((position) => {
      const {coords: {latitude, longitude}} = position;
      const locationQueryString = `lat=${latitude}&lon=${longitude}`;
      this.fetchData(locationQueryString);
    }, (error) => {
      console.error(error);
    }, options);
  };

  fetchData = async (locationQueryString) => {
    try {
      const response = await axios.get(`https://openweathermap.org/data/2.5/forecast/hourly?${locationQueryString}&appid=${API_KEY}`);
      const data = response.data;
      this.setCurrentCity(data.city.name);
      this.setHourlyInfoList(data.list);
    } catch(e) {
      console.error(e);
      this.setError(e);
    }
  };

  fetchWeatherData = async () => {
    this.setLoading(true);
    if('geolocation' in navigator) {
      // geolocation is available
      this.getCurrentLocation();
    }
    const locationQueryString = 'q=London';
    await this.fetchData(locationQueryString);
    this.setLoading(false);
  };
};

export default WeatherPage;
