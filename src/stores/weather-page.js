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
    point: { visible: true },
    label: {
      visible: true,
      type: 'point',
    },
  };

  @observable loading = false;
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
  setCurrentCity = (value) => (this.currentCity = value);

  @action
  setCurrentInfo = (value) => (this.currentInfo = value);

  @action
  setHourlyInfoList = (list) => {
    this.hourlyInfoList = map(list, item => {
      item.main.temp = Math.truncate(parseInt(item.main.temp) - 273.15);
      return item;
    });
  };

  @action
  setTodayLineChartType = (type) => (this.todayLineChartType = type);

  @action
  setNextLineChartType = (type) => (this.nextLineChartType = type);

  fetchWeatherData = async () => {
    this.setLoading(true);
    // TODO get the location from browser
    const cityState = 'Berlin,us';
    try {
      // const response = await axios.get(`https://samples.openweathermap.org/data/2.5/forecast/hourly?q=${cityState}&appid=${API_KEY}`);
      const response = {
"cod": "200",
"message": 0.0151,
"cnt": 96,
"list": [
{
"dt": 1553709600,
"main": {
"temp": 278.76,
"temp_min": 278.76,
"temp_max": 279.558,
"pressure": 1031.934,
"sea_level": 1031.934,
"grnd_level": 971.745,
"humidity": 100,
"temp_kf": -0.8
},
"weather": [
{
"id": 803,
"main": "Clouds",
"description": "broken clouds",
"icon": "04n"
}
],
"clouds": {},
"wind": {},
"sys": {},
"dt_txt": "2019-03-27 18:00:00"
},
{
"dt": 1553713200,
"main": {
"temp": 278.4,
"temp_min": 278.4,
"temp_max": 279,
"pressure": 1033.061,
"sea_level": 1033.061,
"grnd_level": 972.411,
"humidity": 100,
"temp_kf": -0.6
},
"weather": [
{
"id": 801,
"main": "Clouds",
"description": "few clouds",
"icon": "02n"
}
],
"clouds": {
"all": 24
},
"wind": {
"speed": 1.49,
"deg": 46.416
},
"sys": {
"pod": "n"
},
"dt_txt": "2019-03-27 19:00:00"
},
{
"dt": 1553716800,
"main": {
"temp": 277.71,
"temp_min": 277.71,
"temp_max": 278.107,
"pressure": 1033.968,
"sea_level": 1033.968,
"grnd_level": 972.984,
"humidity": 100,
"temp_kf": -0.4
},
"weather": [
{
"id": 801,
"main": "Clouds",
"description": "few clouds",
"icon": "02n"
}
],
"clouds": {
"all": 18
},
"wind": {
"speed": 1.58,
"deg": 49.883
},
"sys": {
"pod": "n"
},
"dt_txt": "2019-03-27 20:00:00"
},
{
"dt": 1553720400,
"main": {
"temp": 277.32,
"temp_min": 277.32,
"temp_max": 277.522,
"pressure": 1034.661,
"sea_level": 1034.661,
"grnd_level": 973.506,
"humidity": 100,
"temp_kf": -0.2
},
"weather": [
{
"id": 801,
"main": "Clouds",
"description": "few clouds",
"icon": "02n"
}
],
"clouds": {
"all": 12
},
"wind": {
"speed": 1.66,
"deg": 52.854
},
"sys": {
"pod": "n"
},
"dt_txt": "2019-03-27 21:00:00"
},
{
"dt": 1553724000,
"main": {
"temp": 276.96,
"temp_min": 276.96,
"temp_max": 276.96,
"pressure": 1035.082,
"sea_level": 1035.082,
"grnd_level": 973.81,
"humidity": 100,
"temp_kf": 0
},
"weather": [
{
"id": 800,
"main": "Clear",
"description": "clear sky",
"icon": "02n"
}
],
"clouds": {
"all": 9
},
"wind": {
"speed": 1.6,
"deg": 56.855
},
"sys": {
"pod": "n"
},
"dt_txt": "2019-03-27 22:00:00"
},
{
"dt": 1553727600,
"main": {
"temp": 276.491,
"temp_min": 276.491,
"temp_max": 276.491,
"pressure": 1035.273,
"sea_level": 1035.273,
"grnd_level": 973.91,
"humidity": 100,
"temp_kf": 0
},
"weather": [
{
"id": 800,
"main": "Clear",
"description": "clear sky",
"icon": "02n"
}
],
"clouds": {
"all": 7
},
"wind": {
"speed": 1.38,
"deg": 62.298
},
"sys": {
"pod": "n"
},
"dt_txt": "2019-03-27 23:00:00"
},
{
"dt": 1553731200,
"main": {
"temp": 276.081,
"temp_min": 276.081,
"temp_max": 276.081,
"pressure": 1035.227,
"sea_level": 1035.227,
"grnd_level": 973.783,
"humidity": 100,
"temp_kf": 0
},
"weather": [
{
"id": 800,
"main": "Clear",
"description": "clear sky",
"icon": "02n"
}
],
"clouds": {
"all": 6
},
"wind": {
"speed": 1.13,
"deg": 67.811
},
"sys": {
"pod": "n"
},
"dt_txt": "2019-03-28 00:00:00"
},
{
"dt": 1553734800,
"main": {
"temp": 275.712,
"temp_min": 275.712,
"temp_max": 275.712,
"pressure": 1035.094,
"sea_level": 1035.094,
"grnd_level": 973.571,
"humidity": 100,
"temp_kf": 0
},
"weather": [
{
"id": 800,
"main": "Clear",
"description": "clear sky",
"icon": "01n"
}
],
"clouds": {
"all": 0
},
"wind": {
"speed": 0.93,
"deg": 71.565
},
"sys": {
"pod": "n"
},
"dt_txt": "2019-03-28 01:00:00"
},
{
"dt": 1553738400,
"main": {
"temp": 275.358,
"temp_min": 275.358,
"temp_max": 275.358,
"pressure": 1035.008,
"sea_level": 1035.008,
"grnd_level": 973.403,
"humidity": 100,
"temp_kf": 0
},
"weather": [
{
"id": 800,
"main": "Clear",
"description": "clear sky",
"icon": "01n"
}
],
"clouds": {
"all": 0
},
"wind": {
"speed": 0.76,
"deg": 73.649
},
"sys": {
"pod": "n"
},
"dt_txt": "2019-03-28 02:00:00"
},
{
"dt": 1553742000,
"main": {
"temp": 274.954,
"temp_min": 274.954,
"temp_max": 274.954,
"pressure": 1035.01,
"sea_level": 1035.01,
"grnd_level": 973.342,
"humidity": 100,
"temp_kf": 0
},
"weather": [
{
"id": 800,
"main": "Clear",
"description": "clear sky",
"icon": "01n"
}
],
"clouds": {
"all": 0
},
"wind": {
"speed": 0.58,
"deg": 77.844
},
"sys": {
"pod": "n"
},
"dt_txt": "2019-03-28 03:00:00"
},
{
"dt": 1553745600,
"main": {
"temp": 274.805,
"temp_min": 274.805,
"temp_max": 274.805,
"pressure": 1035.079,
"sea_level": 1035.079,
"grnd_level": 973.401,
"humidity": 100,
"temp_kf": 0
},
"weather": [
{
"id": 800,
"main": "Clear",
"description": "clear sky",
"icon": "01n"
}
],
"clouds": {
"all": 0
},
"wind": {
"speed": 0.48,
"deg": 76.225
},
"sys": {
"pod": "n"
},
"dt_txt": "2019-03-28 04:00:00"
},
{
"dt": 1553749200,
"main": {
"temp": 274.744,
"temp_min": 274.744,
"temp_max": 274.744,
"pressure": 1035.228,
"sea_level": 1035.228,
"grnd_level": 973.537,
"humidity": 100,
"temp_kf": 0
},
"weather": [
{
"id": 800,
"main": "Clear",
"description": "clear sky",
"icon": "01d"
}
],
"clouds": {
"all": 0
},
"wind": {
"speed": 0.49,
"deg": 70.502
},
"sys": {
"pod": "d"
},
"dt_txt": "2019-03-28 05:00:00"
},
{
"dt": 1553752800,
"main": {
"temp": 275.267,
"temp_min": 275.267,
"temp_max": 275.267,
"pressure": 1035.421,
"sea_level": 1035.421,
"grnd_level": 973.977,
"humidity": 100,
"temp_kf": 0
},
"weather": [
{
"id": 800,
"main": "Clear",
"description": "clear sky",
"icon": "01d"
}
],
"clouds": {
"all": 0
},
"wind": {
"speed": 0.61,
"deg": 57.479
},
"sys": {
"pod": "d"
},
"dt_txt": "2019-03-28 06:00:00"
},
{
"dt": 1553756400,
"main": {
"temp": 277,
"temp_min": 277,
"temp_max": 277,
"pressure": 1034.79,
"sea_level": 1034.79,
"grnd_level": 974.311,
"humidity": 100,
"temp_kf": 0
},
"weather": [
{
"id": 800,
"main": "Clear",
"description": "clear sky",
"icon": "01d"
}
],
"clouds": {
"all": 0
},
"wind": {
"speed": 1.04,
"deg": 49.554
},
"sys": {
"pod": "d"
},
"dt_txt": "2019-03-28 07:00:00"
},
{
"dt": 1553760000,
"main": {
"temp": 278.8,
"temp_min": 278.8,
"temp_max": 278.8,
"pressure": 1034.179,
"sea_level": 1034.179,
"grnd_level": 974.483,
"humidity": 100,
"temp_kf": 0
},
"weather": [
{
"id": 800,
"main": "Clear",
"description": "clear sky",
"icon": "01d"
}
],
"clouds": {
"all": 0
},
"wind": {
"speed": 1.61,
"deg": 51.039
},
"sys": {
"pod": "d"
},
"dt_txt": "2019-03-28 08:00:00"
},
{
"dt": 1553763600,
"main": {
"temp": 280.6,
"temp_min": 280.6,
"temp_max": 280.6,
"pressure": 1033.734,
"sea_level": 1033.734,
"grnd_level": 974.574,
"humidity": 100,
"temp_kf": 0
},
"weather": [
{
"id": 800,
"main": "Clear",
"description": "clear sky",
"icon": "01d"
}
],
"clouds": {
"all": 0
},
"wind": {
"speed": 2.25,
"deg": 50.628
},
"sys": {
"pod": "d"
},
"dt_txt": "2019-03-28 09:00:00"
},
{
"dt": 1553767200,
"main": {
"temp": 281.8,
"temp_min": 281.8,
"temp_max": 281.8,
"pressure": 1033.315,
"sea_level": 1033.315,
"grnd_level": 974.491,
"humidity": 100,
"temp_kf": 0
},
"weather": [
{
"id": 800,
"main": "Clear",
"description": "clear sky",
"icon": "01d"
}
],
"clouds": {
"all": 0
},
"wind": {
"speed": 2.77,
"deg": 53.619
},
"sys": {
"pod": "d"
},
"dt_txt": "2019-03-28 10:00:00"
},
{
"dt": 1553770800,
"main": {
"temp": 282.933,
"temp_min": 282.933,
"temp_max": 282.933,
"pressure": 1032.889,
"sea_level": 1032.889,
"grnd_level": 974.281,
"humidity": 100,
"temp_kf": 0
},
"weather": [
{
"id": 800,
"main": "Clear",
"description": "clear sky",
"icon": "01d"
}
],
"clouds": {
"all": 0
},
"wind": {
"speed": 3.01,
"deg": 58.517
},
"sys": {
"pod": "d"
},
"dt_txt": "2019-03-28 11:00:00"
},
{
"dt": 1553774400,
"main": {
"temp": 283.888,
"temp_min": 283.888,
"temp_max": 283.888,
"pressure": 1032.449,
"sea_level": 1032.449,
"grnd_level": 973.963,
"humidity": 100,
"temp_kf": 0
},
"weather": [
{
"id": 800,
"main": "Clear",
"description": "clear sky",
"icon": "01d"
}
],
"clouds": {
"all": 0
},
"wind": {
"speed": 3.12,
"deg": 63.066
},
"sys": {
"pod": "d"
},
"dt_txt": "2019-03-28 12:00:00"
},
{
"dt": 1553778000,
"main": {
"temp": 284.6,
"temp_min": 284.6,
"temp_max": 284.6,
"pressure": 1031.936,
"sea_level": 1031.936,
"grnd_level": 973.482,
"humidity": 100,
"temp_kf": 0
},
"weather": [
{
"id": 800,
"main": "Clear",
"description": "clear sky",
"icon": "01d"
}
],
"clouds": {
"all": 1
},
"wind": {
"speed": 3.31,
"deg": 63.126
},
"sys": {
"pod": "d"
},
"dt_txt": "2019-03-28 13:00:00"
},
{
"dt": 1553781600,
"main": {
"temp": 285.021,
"temp_min": 285.021,
"temp_max": 285.021,
"pressure": 1031.435,
"sea_level": 1031.435,
"grnd_level": 972.997,
"humidity": 100,
"temp_kf": 0
},
"weather": [
{
"id": 800,
"main": "Clear",
"description": "clear sky",
"icon": "01d"
}
],
"clouds": {
"all": 1
},
"wind": {
"speed": 3.49,
"deg": 59.49
},
"sys": {
"pod": "d"
},
"dt_txt": "2019-03-28 14:00:00"
},
{
"dt": 1553785200,
"main": {
"temp": 284.9,
"temp_min": 284.9,
"temp_max": 284.9,
"pressure": 1031.28,
"sea_level": 1031.28,
"grnd_level": 972.758,
"humidity": 100,
"temp_kf": 0
},
"weather": [
{
"id": 800,
"main": "Clear",
"description": "clear sky",
"icon": "01d"
}
],
"clouds": {
"all": 1
},
"wind": {
"speed": 3.64,
"deg": 55.629
},
"sys": {
"pod": "d"
},
"dt_txt": "2019-03-28 15:00:00"
},
{
"dt": 1553788800,
"main": {
"temp": 284.231,
"temp_min": 284.231,
"temp_max": 284.231,
"pressure": 1031.355,
"sea_level": 1031.355,
"grnd_level": 972.662,
"humidity": 100,
"temp_kf": 0
},
"weather": [
{
"id": 800,
"main": "Clear",
"description": "clear sky",
"icon": "01d"
}
],
"clouds": {
"all": 1
},
"wind": {
"speed": 3.5,
"deg": 52.569
},
"sys": {
"pod": "d"
},
"dt_txt": "2019-03-28 16:00:00"
},
{
"dt": 1553792400,
"main": {
"temp": 282.595,
"temp_min": 282.595,
"temp_max": 282.595,
"pressure": 1031.93,
"sea_level": 1031.93,
"grnd_level": 972.835,
"humidity": 100,
"temp_kf": 0
},
"weather": [
{
"id": 800,
"main": "Clear",
"description": "clear sky",
"icon": "01d"
}
],
"clouds": {
"all": 1
},
"wind": {
"speed": 3.21,
"deg": 48.196
},
"sys": {
"pod": "d"
},
"dt_txt": "2019-03-28 17:00:00"
},
{
"dt": 1553796000,
"main": {
"temp": 280.849,
"temp_min": 280.849,
"temp_max": 280.849,
"pressure": 1033.033,
"sea_level": 1033.033,
"grnd_level": 973.292,
"humidity": 100,
"temp_kf": 0
},
"weather": [
{
"id": 800,
"main": "Clear",
"description": "clear sky",
"icon": "01n"
}
],
"clouds": {
"all": 1
},
"wind": {
"speed": 3.21,
"deg": 47.349
},
"sys": {
"pod": "n"
},
"dt_txt": "2019-03-28 18:00:00"
},
{
"dt": 1553799600,
"main": {
"temp": 279.9,
"temp_min": 279.9,
"temp_max": 279.9,
"pressure": 1033.945,
"sea_level": 1033.945,
"grnd_level": 973.762,
"humidity": 100,
"temp_kf": 0
},
"weather": [
{
"id": 800,
"main": "Clear",
"description": "clear sky",
"icon": "01n"
}
],
"clouds": {
"all": 0
},
"wind": {
"speed": 3.16,
"deg": 49.767
},
"sys": {
"pod": "n"
},
"dt_txt": "2019-03-28 19:00:00"
},
{
"dt": 1553803200,
"main": {
"temp": 279.3,
"temp_min": 279.3,
"temp_max": 279.3,
"pressure": 1034.455,
"sea_level": 1034.455,
"grnd_level": 973.981,
"humidity": 100,
"temp_kf": 0
},
"weather": [
{
"id": 800,
"main": "Clear",
"description": "clear sky",
"icon": "01n"
}
],
"clouds": {
"all": 0
},
"wind": {
"speed": 2.96,
"deg": 53.944
},
"sys": {
"pod": "n"
},
"dt_txt": "2019-03-28 20:00:00"
},
{
"dt": 1553806800,
"main": {
"temp": 278.775,
"temp_min": 278.775,
"temp_max": 278.775,
"pressure": 1034.815,
"sea_level": 1034.815,
"grnd_level": 974.052,
"humidity": 100,
"temp_kf": 0
},
"weather": [
{
"id": 800,
"main": "Clear",
"description": "clear sky",
"icon": "01n"
}
],
"clouds": {
"all": 0
},
"wind": {
"speed": 2.65,
"deg": 61.44
},
"sys": {
"pod": "n"
},
"dt_txt": "2019-03-28 21:00:00"
},
{
"dt": 1553810400,
"main": {
"temp": 278.326,
"temp_min": 278.326,
"temp_max": 278.326,
"pressure": 1034.999,
"sea_level": 1034.999,
"grnd_level": 974.006,
"humidity": 100,
"temp_kf": 0
},
"weather": [
{
"id": 800,
"main": "Clear",
"description": "clear sky",
"icon": "01n"
}
],
"clouds": {
"all": 1
},
"wind": {
"speed": 2.37,
"deg": 70.557
},
"sys": {
"pod": "n"
},
"dt_txt": "2019-03-28 22:00:00"
},
{
"dt": 1553814000,
"main": {
"temp": 278,
"temp_min": 278,
"temp_max": 278,
"pressure": 1034.992,
"sea_level": 1034.992,
"grnd_level": 973.853,
"humidity": 100,
"temp_kf": 0
},
"weather": [
{
"id": 800,
"main": "Clear",
"description": "clear sky",
"icon": "01n"
}
],
"clouds": {
"all": 1
},
"wind": {
"speed": 2.12,
"deg": 77.503
},
"sys": {
"pod": "n"
},
"dt_txt": "2019-03-28 23:00:00"
},
{
"dt": 1553817600,
"main": {
"temp": 277.6,
"temp_min": 277.6,
"temp_max": 277.6,
"pressure": 1034.874,
"sea_level": 1034.874,
"grnd_level": 973.638,
"humidity": 100,
"temp_kf": 0
},
"weather": [
{
"id": 800,
"main": "Clear",
"description": "clear sky",
"icon": "01n"
}
],
"clouds": {
"all": 0
},
"wind": {
"speed": 1.96,
"deg": 80.639
},
"sys": {
"pod": "n"
},
"dt_txt": "2019-03-29 00:00:00"
},
{
"dt": 1553821200,
"main": {
"temp": 277.16,
"temp_min": 277.16,
"temp_max": 277.16,
"pressure": 1034.624,
"sea_level": 1034.624,
"grnd_level": 973.351,
"humidity": 100,
"temp_kf": 0
},
"weather": [
{
"id": 800,
"main": "Clear",
"description": "clear sky",
"icon": "01n"
}
],
"clouds": {
"all": 0
},
"wind": {
"speed": 1.95,
"deg": 82.322
},
"sys": {
"pod": "n"
},
"dt_txt": "2019-03-29 01:00:00"
},
{
"dt": 1553824800,
"main": {
"temp": 276.739,
"temp_min": 276.739,
"temp_max": 276.739,
"pressure": 1034.345,
"sea_level": 1034.345,
"grnd_level": 973.111,
"humidity": 100,
"temp_kf": 0
},
"weather": [
{
"id": 800,
"main": "Clear",
"description": "clear sky",
"icon": "01n"
}
],
"clouds": {
"all": 0
},
"wind": {
"speed": 2,
"deg": 85.258
},
"sys": {
"pod": "n"
},
"dt_txt": "2019-03-29 02:00:00"
},
{
"dt": 1553828400,
"main": {
"temp": 276.465,
"temp_min": 276.465,
"temp_max": 276.465,
"pressure": 1034.124,
"sea_level": 1034.124,
"grnd_level": 972.924,
"humidity": 100,
"temp_kf": 0
},
"weather": [
{
"id": 800,
"main": "Clear",
"description": "clear sky",
"icon": "01n"
}
],
"clouds": {
"all": 0
},
"wind": {
"speed": 2.1,
"deg": 86.835
},
"sys": {
"pod": "n"
},
"dt_txt": "2019-03-29 03:00:00"
},
{
"dt": 1553832000,
"main": {
"temp": 276.078,
"temp_min": 276.078,
"temp_max": 276.078,
"pressure": 1033.979,
"sea_level": 1033.979,
"grnd_level": 972.784,
"humidity": 100,
"temp_kf": 0
},
"weather": [
{
"id": 800,
"main": "Clear",
"description": "clear sky",
"icon": "01n"
}
],
"clouds": {
"all": 0
},
"wind": {
"speed": 2.28,
"deg": 90.151
},
"sys": {
"pod": "n"
},
"dt_txt": "2019-03-29 04:00:00"
},
{
"dt": 1553835600,
"main": {
"temp": 275.682,
"temp_min": 275.682,
"temp_max": 275.682,
"pressure": 1033.842,
"sea_level": 1033.842,
"grnd_level": 972.547,
"humidity": 100,
"temp_kf": 0
},
"weather": [
{
"id": 800,
"main": "Clear",
"description": "clear sky",
"icon": "01d"
}
],
"clouds": {
"all": 0
},
"wind": {
"speed": 2.39,
"deg": 95.09
},
"sys": {
"pod": "d"
},
"dt_txt": "2019-03-29 05:00:00"
},
{
"dt": 1553839200,
"main": {
"temp": 276.125,
"temp_min": 276.125,
"temp_max": 276.125,
"pressure": 1033.614,
"sea_level": 1033.614,
"grnd_level": 972.456,
"humidity": 100,
"temp_kf": 0
},
"weather": [
{
"id": 800,
"main": "Clear",
"description": "clear sky",
"icon": "01d"
}
],
"clouds": {
"all": 0
},
"wind": {
"speed": 2.5,
"deg": 95.761
},
"sys": {
"pod": "d"
},
"dt_txt": "2019-03-29 06:00:00"
},
{
"dt": 1553842800,
"main": {
"temp": 277.8,
"temp_min": 277.8,
"temp_max": 277.8,
"pressure": 1032.628,
"sea_level": 1032.628,
"grnd_level": 972.408,
"humidity": 100,
"temp_kf": 0
},
"weather": [
{
"id": 800,
"main": "Clear",
"description": "clear sky",
"icon": "01d"
}
],
"clouds": {
"all": 0
},
"wind": {
"speed": 3.05,
"deg": 96.324
},
"sys": {
"pod": "d"
},
"dt_txt": "2019-03-29 07:00:00"
},
{
"dt": 1553846400,
"main": {
"temp": 279.874,
"temp_min": 279.874,
"temp_max": 279.874,
"pressure": 1031.838,
"sea_level": 1031.838,
"grnd_level": 972.421,
"humidity": 100,
"temp_kf": 0
},
"weather": [
{
"id": 800,
"main": "Clear",
"description": "clear sky",
"icon": "01d"
}
],
"clouds": {
"all": 0
},
"wind": {
"speed": 3.45,
"deg": 91.031
},
"sys": {
"pod": "d"
},
"dt_txt": "2019-03-29 08:00:00"
},
{
"dt": 1553850000,
"main": {
"temp": 281.851,
"temp_min": 281.851,
"temp_max": 281.851,
"pressure": 1031.349,
"sea_level": 1031.349,
"grnd_level": 972.486,
"humidity": 100,
"temp_kf": 0
},
"weather": [
{
"id": 800,
"main": "Clear",
"description": "clear sky",
"icon": "01d"
}
],
"clouds": {
"all": 0
},
"wind": {
"speed": 3.88,
"deg": 86.273
},
"sys": {
"pod": "d"
},
"dt_txt": "2019-03-29 09:00:00"
},
{
"dt": 1553853600,
"main": {
"temp": 283.525,
"temp_min": 283.525,
"temp_max": 283.525,
"pressure": 1030.794,
"sea_level": 1030.794,
"grnd_level": 972.325,
"humidity": 100,
"temp_kf": 0
},
"weather": [
{
"id": 800,
"main": "Clear",
"description": "clear sky",
"icon": "01d"
}
],
"clouds": {
"all": 0
},
"wind": {
"speed": 4.18,
"deg": 84.283
},
"sys": {
"pod": "d"
},
"dt_txt": "2019-03-29 10:00:00"
},
{
"dt": 1553857200,
"main": {
"temp": 284.836,
"temp_min": 284.836,
"temp_max": 284.836,
"pressure": 1030.155,
"sea_level": 1030.155,
"grnd_level": 971.947,
"humidity": 100,
"temp_kf": 0
},
"weather": [
{
"id": 800,
"main": "Clear",
"description": "clear sky",
"icon": "01d"
}
],
"clouds": {
"all": 0
},
"wind": {
"speed": 4.23,
"deg": 84.736
},
"sys": {
"pod": "d"
},
"dt_txt": "2019-03-29 11:00:00"
},
{
"dt": 1553860800,
"main": {
"temp": 285.888,
"temp_min": 285.888,
"temp_max": 285.888,
"pressure": 1029.426,
"sea_level": 1029.426,
"grnd_level": 971.42,
"humidity": 100,
"temp_kf": 0
},
"weather": [
{
"id": 800,
"main": "Clear",
"description": "clear sky",
"icon": "01d"
}
],
"clouds": {
"all": 0
},
"wind": {
"speed": 4.01,
"deg": 86.743
},
"sys": {
"pod": "d"
},
"dt_txt": "2019-03-29 12:00:00"
},
{
"dt": 1553864400,
"main": {
"temp": 286.551,
"temp_min": 286.551,
"temp_max": 286.551,
"pressure": 1028.625,
"sea_level": 1028.625,
"grnd_level": 970.772,
"humidity": 100,
"temp_kf": 0
},
"weather": [
{
"id": 800,
"main": "Clear",
"description": "clear sky",
"icon": "01d"
}
],
"clouds": {
"all": 0
},
"wind": {
"speed": 3.68,
"deg": 88.662
},
"sys": {
"pod": "d"
},
"dt_txt": "2019-03-29 13:00:00"
},
{
"dt": 1553868000,
"main": {
"temp": 286.945,
"temp_min": 286.945,
"temp_max": 286.945,
"pressure": 1027.913,
"sea_level": 1027.913,
"grnd_level": 970.11,
"humidity": 100,
"temp_kf": 0
},
"weather": [
{
"id": 800,
"main": "Clear",
"description": "clear sky",
"icon": "01d"
}
],
"clouds": {
"all": 0
},
"wind": {
"speed": 3.32,
"deg": 90.741
},
"sys": {
"pod": "d"
},
"dt_txt": "2019-03-29 14:00:00"
},
{
"dt": 1553871600,
"main": {
"temp": 286.874,
"temp_min": 286.874,
"temp_max": 286.874,
"pressure": 1027.432,
"sea_level": 1027.432,
"grnd_level": 969.583,
"humidity": 100,
"temp_kf": 0
},
"weather": [
{
"id": 800,
"main": "Clear",
"description": "clear sky",
"icon": "01d"
}
],
"clouds": {
"all": 0
},
"wind": {
"speed": 2.94,
"deg": 91.638
},
"sys": {
"pod": "d"
},
"dt_txt": "2019-03-29 15:00:00"
},
{
"dt": 1553875200,
"main": {
"temp": 286.426,
"temp_min": 286.426,
"temp_max": 286.426,
"pressure": 1027.195,
"sea_level": 1027.195,
"grnd_level": 969.276,
"humidity": 100,
"temp_kf": 0
},
"weather": [
{
"id": 800,
"main": "Clear",
"description": "clear sky",
"icon": "01d"
}
],
"clouds": {
"all": 0
},
"wind": {
"speed": 2.59,
"deg": 87.609
},
"sys": {
"pod": "d"
},
"dt_txt": "2019-03-29 16:00:00"
},
{
"dt": 1553878800,
"main": {
"temp": 284.8,
"temp_min": 284.8,
"temp_max": 284.8,
"pressure": 1027.564,
"sea_level": 1027.564,
"grnd_level": 969.159,
"humidity": 100,
"temp_kf": 0
},
"weather": [
{
"id": 800,
"main": "Clear",
"description": "clear sky",
"icon": "01d"
}
],
"clouds": {
"all": 0
},
"wind": {
"speed": 2.37,
"deg": 78.358
},
"sys": {
"pod": "d"
},
"dt_txt": "2019-03-29 17:00:00"
},
{
"dt": 1553882400,
"main": {
"temp": 282.945,
"temp_min": 282.945,
"temp_max": 282.945,
"pressure": 1028.448,
"sea_level": 1028.448,
"grnd_level": 969.273,
"humidity": 100,
"temp_kf": 0
},
"weather": [
{
"id": 800,
"main": "Clear",
"description": "clear sky",
"icon": "01n"
}
],
"clouds": {
"all": 0
},
"wind": {
"speed": 2.43,
"deg": 78.33
},
"sys": {
"pod": "n"
},
"dt_txt": "2019-03-29 18:00:00"
},
{
"dt": 1553886000,
"main": {
"temp": 281.849,
"temp_min": 281.849,
"temp_max": 281.849,
"pressure": 1029.256,
"sea_level": 1029.256,
"grnd_level": 969.579,
"humidity": 100,
"temp_kf": 0
},
"weather": [
{
"id": 800,
"main": "Clear",
"description": "clear sky",
"icon": "01n"
}
],
"clouds": {
"all": 0
},
"wind": {
"speed": 2.47,
"deg": 89.815
},
"sys": {
"pod": "n"
},
"dt_txt": "2019-03-29 19:00:00"
},
{
"dt": 1553889600,
"main": {
"temp": 281.1,
"temp_min": 281.1,
"temp_max": 281.1,
"pressure": 1029.672,
"sea_level": 1029.672,
"grnd_level": 969.675,
"humidity": 100,
"temp_kf": 0
},
"weather": [
{
"id": 800,
"main": "Clear",
"description": "clear sky",
"icon": "01n"
}
],
"clouds": {
"all": 0
},
"wind": {
"speed": 2.32,
"deg": 105.728
},
"sys": {
"pod": "n"
},
"dt_txt": "2019-03-29 20:00:00"
},
{
"dt": 1553893200,
"main": {
"temp": 280.464,
"temp_min": 280.464,
"temp_max": 280.464,
"pressure": 1029.773,
"sea_level": 1029.773,
"grnd_level": 969.517,
"humidity": 100,
"temp_kf": 0
},
"weather": [
{
"id": 800,
"main": "Clear",
"description": "clear sky",
"icon": "01n"
}
],
"clouds": {
"all": 0
},
"wind": {
"speed": 1.88,
"deg": 124.96
},
"sys": {
"pod": "n"
},
"dt_txt": "2019-03-29 21:00:00"
},
{
"dt": 1553896800,
"main": {
"temp": 279.896,
"temp_min": 279.896,
"temp_max": 279.896,
"pressure": 1029.712,
"sea_level": 1029.712,
"grnd_level": 969.271,
"humidity": 100,
"temp_kf": 0
},
"weather": [
{
"id": 800,
"main": "Clear",
"description": "clear sky",
"icon": "01n"
}
],
"clouds": {
"all": 0
},
"wind": {
"speed": 1.46,
"deg": 150.309
},
"sys": {
"pod": "n"
},
"dt_txt": "2019-03-29 22:00:00"
},
{
"dt": 1553900400,
"main": {
"temp": 279.443,
"temp_min": 279.443,
"temp_max": 279.443,
"pressure": 1029.667,
"sea_level": 1029.667,
"grnd_level": 969.135,
"humidity": 100,
"temp_kf": 0
},
"weather": [
{
"id": 800,
"main": "Clear",
"description": "clear sky",
"icon": "01n"
}
],
"clouds": {
"all": 1
},
"wind": {
"speed": 1.21,
"deg": 180.52
},
"sys": {
"pod": "n"
},
"dt_txt": "2019-03-29 23:00:00"
},
{
"dt": 1553904000,
"main": {
"temp": 279.011,
"temp_min": 279.011,
"temp_max": 279.011,
"pressure": 1029.659,
"sea_level": 1029.659,
"grnd_level": 969.083,
"humidity": 100,
"temp_kf": 0
},
"weather": [
{
"id": 800,
"main": "Clear",
"description": "clear sky",
"icon": "02n"
}
],
"clouds": {
"all": 7
},
"wind": {
"speed": 1.06,
"deg": 208.378
},
"sys": {
"pod": "n"
},
"dt_txt": "2019-03-30 00:00:00"
},
{
"dt": 1553907600,
"main": {
"temp": 278.65,
"temp_min": 278.65,
"temp_max": 278.65,
"pressure": 1029.548,
"sea_level": 1029.548,
"grnd_level": 969.018,
"humidity": 100,
"temp_kf": 0
},
"weather": [
{
"id": 803,
"main": "Clouds",
"description": "broken clouds",
"icon": "04n"
}
],
"clouds": {
"all": 56
},
"wind": {
"speed": 1.07,
"deg": 226.254
},
"sys": {
"pod": "n"
},
"dt_txt": "2019-03-30 01:00:00"
},
{
"dt": 1553911200,
"main": {
"temp": 278.319,
"temp_min": 278.319,
"temp_max": 278.319,
"pressure": 1029.405,
"sea_level": 1029.405,
"grnd_level": 968.854,
"humidity": 100,
"temp_kf": 0
},
"weather": [
{
"id": 802,
"main": "Clouds",
"description": "scattered clouds",
"icon": "03n"
}
],
"clouds": {
"all": 47
},
"wind": {
"speed": 1.22,
"deg": 228.257
},
"sys": {
"pod": "n"
},
"dt_txt": "2019-03-30 02:00:00"
},
{
"dt": 1553914800,
"main": {
"temp": 277.98,
"temp_min": 277.98,
"temp_max": 277.98,
"pressure": 1029.25,
"sea_level": 1029.25,
"grnd_level": 968.656,
"humidity": 100,
"temp_kf": 0
},
"weather": [
{
"id": 802,
"main": "Clouds",
"description": "scattered clouds",
"icon": "03n"
}
],
"clouds": {
"all": 39
},
"wind": {
"speed": 1.47,
"deg": 226.958
},
"sys": {
"pod": "n"
},
"dt_txt": "2019-03-30 03:00:00"
},
{
"dt": 1553918400,
"main": {
"temp": 277.707,
"temp_min": 277.707,
"temp_max": 277.707,
"pressure": 1029.092,
"sea_level": 1029.092,
"grnd_level": 968.418,
"humidity": 100,
"temp_kf": 0
},
"weather": [
{
"id": 802,
"main": "Clouds",
"description": "scattered clouds",
"icon": "03n"
}
],
"clouds": {
"all": 30
},
"wind": {
"speed": 1.61,
"deg": 227.084
},
"sys": {
"pod": "n"
},
"dt_txt": "2019-03-30 04:00:00"
},
{
"dt": 1553922000,
"main": {
"temp": 277.295,
"temp_min": 277.295,
"temp_max": 277.295,
"pressure": 1029.07,
"sea_level": 1029.07,
"grnd_level": 968.336,
"humidity": 100,
"temp_kf": 0
},
"weather": [
{
"id": 801,
"main": "Clouds",
"description": "few clouds",
"icon": "02d"
}
],
"clouds": {
"all": 24
},
"wind": {
"speed": 1.63,
"deg": 226.396
},
"sys": {
"pod": "d"
},
"dt_txt": "2019-03-30 05:00:00"
},
{
"dt": 1553925600,
"main": {
"temp": 277.977,
"temp_min": 277.977,
"temp_max": 277.977,
"pressure": 1028.86,
"sea_level": 1028.86,
"grnd_level": 968.369,
"humidity": 100,
"temp_kf": 0
},
"weather": [
{
"id": 801,
"main": "Clouds",
"description": "few clouds",
"icon": "02d"
}
],
"clouds": {
"all": 20
},
"wind": {
"speed": 1.65,
"deg": 224.755
},
"sys": {
"pod": "d"
},
"dt_txt": "2019-03-30 06:00:00"
},
{
"dt": 1553929200,
"main": {
"temp": 280.019,
"temp_min": 280.019,
"temp_max": 280.019,
"pressure": 1027.856,
"sea_level": 1027.856,
"grnd_level": 968.293,
"humidity": 100,
"temp_kf": 0
},
"weather": [
{
"id": 800,
"main": "Clear",
"description": "clear sky",
"icon": "01d"
}
],
"clouds": {
"all": 0
},
"wind": {
"speed": 1.66,
"deg": 230.385
},
"sys": {
"pod": "d"
},
"dt_txt": "2019-03-30 07:00:00"
},
{
"dt": 1553932800,
"main": {
"temp": 282.377,
"temp_min": 282.377,
"temp_max": 282.377,
"pressure": 1026.804,
"sea_level": 1026.804,
"grnd_level": 968.141,
"humidity": 100,
"temp_kf": 0
},
"weather": [
{
"id": 800,
"main": "Clear",
"description": "clear sky",
"icon": "01d"
}
],
"clouds": {
"all": 0
},
"wind": {
"speed": 1.86,
"deg": 243.587
},
"sys": {
"pod": "d"
},
"dt_txt": "2019-03-30 08:00:00"
},
{
"dt": 1553936400,
"main": {
"temp": 284.504,
"temp_min": 284.504,
"temp_max": 284.504,
"pressure": 1025.983,
"sea_level": 1025.983,
"grnd_level": 967.831,
"humidity": 100,
"temp_kf": 0
},
"weather": [
{
"id": 800,
"main": "Clear",
"description": "clear sky",
"icon": "01d"
}
],
"clouds": {
"all": 0
},
"wind": {
"speed": 1.91,
"deg": 255.825
},
"sys": {
"pod": "d"
},
"dt_txt": "2019-03-30 09:00:00"
},
{
"dt": 1553940000,
"main": {
"temp": 286.404,
"temp_min": 286.404,
"temp_max": 286.404,
"pressure": 1025.078,
"sea_level": 1025.078,
"grnd_level": 967.26,
"humidity": 100,
"temp_kf": 0
},
"weather": [
{
"id": 800,
"main": "Clear",
"description": "clear sky",
"icon": "01d"
}
],
"clouds": {
"all": 0
},
"wind": {
"speed": 1.99,
"deg": 271.009
},
"sys": {
"pod": "d"
},
"dt_txt": "2019-03-30 10:00:00"
},
{
"dt": 1553943600,
"main": {
"temp": 287.804,
"temp_min": 287.804,
"temp_max": 287.804,
"pressure": 1024.221,
"sea_level": 1024.221,
"grnd_level": 966.646,
"humidity": 100,
"temp_kf": 0
},
"weather": [
{
"id": 800,
"main": "Clear",
"description": "clear sky",
"icon": "01d"
}
],
"clouds": {
"all": 0
},
"wind": {
"speed": 2.16,
"deg": 285.457
},
"sys": {
"pod": "d"
},
"dt_txt": "2019-03-30 11:00:00"
},
{
"dt": 1553947200,
"main": {
"temp": 288.805,
"temp_min": 288.805,
"temp_max": 288.805,
"pressure": 1023.499,
"sea_level": 1023.499,
"grnd_level": 966.047,
"humidity": 100,
"temp_kf": 0
},
"weather": [
{
"id": 800,
"main": "Clear",
"description": "clear sky",
"icon": "01d"
}
],
"clouds": {
"all": 0
},
"wind": {
"speed": 2.26,
"deg": 297.891
},
"sys": {
"pod": "d"
},
"dt_txt": "2019-03-30 12:00:00"
},
{
"dt": 1553950800,
"main": {
"temp": 289.331,
"temp_min": 289.331,
"temp_max": 289.331,
"pressure": 1022.782,
"sea_level": 1022.782,
"grnd_level": 965.392,
"humidity": 100,
"temp_kf": 0
},
"weather": [
{
"id": 800,
"main": "Clear",
"description": "clear sky",
"icon": "01d"
}
],
"clouds": {
"all": 0
},
"wind": {
"speed": 2.22,
"deg": 306.751
},
"sys": {
"pod": "d"
},
"dt_txt": "2019-03-30 13:00:00"
},
{
"dt": 1553954400,
"main": {
"temp": 289.448,
"temp_min": 289.448,
"temp_max": 289.448,
"pressure": 1022.062,
"sea_level": 1022.062,
"grnd_level": 964.682,
"humidity": 100,
"temp_kf": 0
},
"weather": [
{
"id": 800,
"main": "Clear",
"description": "clear sky",
"icon": "01d"
}
],
"clouds": {
"all": 0
},
"wind": {
"speed": 2.05,
"deg": 310.428
},
"sys": {
"pod": "d"
},
"dt_txt": "2019-03-30 14:00:00"
},
{
"dt": 1553958000,
"main": {
"temp": 289.3,
"temp_min": 289.3,
"temp_max": 289.3,
"pressure": 1021.556,
"sea_level": 1021.556,
"grnd_level": 964.137,
"humidity": 100,
"temp_kf": 0
},
"weather": [
{
"id": 800,
"main": "Clear",
"description": "clear sky",
"icon": "01d"
}
],
"clouds": {
"all": 0
},
"wind": {
"speed": 1.85,
"deg": 313.162
},
"sys": {
"pod": "d"
},
"dt_txt": "2019-03-30 15:00:00"
},
{
"dt": 1553961600,
"main": {
"temp": 288.852,
"temp_min": 288.852,
"temp_max": 288.852,
"pressure": 1021.245,
"sea_level": 1021.245,
"grnd_level": 963.777,
"humidity": 100,
"temp_kf": 0
},
"weather": [
{
"id": 800,
"main": "Clear",
"description": "clear sky",
"icon": "01d"
}
],
"clouds": {
"all": 0
},
"wind": {
"speed": 1.54,
"deg": 321.334
},
"sys": {
"pod": "d"
},
"dt_txt": "2019-03-30 16:00:00"
},
{
"dt": 1553965200,
"main": {
"temp": 287,
"temp_min": 287,
"temp_max": 287,
"pressure": 1021.473,
"sea_level": 1021.473,
"grnd_level": 963.658,
"humidity": 100,
"temp_kf": 0
},
"weather": [
{
"id": 800,
"main": "Clear",
"description": "clear sky",
"icon": "01d"
}
],
"clouds": {
"all": 0
},
"wind": {
"speed": 1.05,
"deg": 334.973
},
"sys": {
"pod": "d"
},
"dt_txt": "2019-03-30 17:00:00"
},
{
"dt": 1553968800,
"main": {
"temp": 284.921,
"temp_min": 284.921,
"temp_max": 284.921,
"pressure": 1022.206,
"sea_level": 1022.206,
"grnd_level": 963.736,
"humidity": 100,
"temp_kf": 0
},
"weather": [
{
"id": 800,
"main": "Clear",
"description": "clear sky",
"icon": "01n"
}
],
"clouds": {
"all": 0
},
"wind": {
"speed": 0.75,
"deg": 350.55
},
"sys": {
"pod": "n"
},
"dt_txt": "2019-03-30 18:00:00"
},
{
"dt": 1553972400,
"main": {
"temp": 284.107,
"temp_min": 284.107,
"temp_max": 284.107,
"pressure": 1022.954,
"sea_level": 1022.954,
"grnd_level": 964.049,
"humidity": 100,
"temp_kf": 0
},
"weather": [
{
"id": 800,
"main": "Clear",
"description": "clear sky",
"icon": "01n"
}
],
"clouds": {
"all": 0
},
"wind": {
"speed": 0.37,
"deg": 21.283
},
"sys": {
"pod": "n"
},
"dt_txt": "2019-03-30 19:00:00"
},
{
"dt": 1553976000,
"main": {
"temp": 283.481,
"temp_min": 283.481,
"temp_max": 283.481,
"pressure": 1023.319,
"sea_level": 1023.319,
"grnd_level": 964.135,
"humidity": 100,
"temp_kf": 0
},
"weather": [
{
"id": 800,
"main": "Clear",
"description": "clear sky",
"icon": "01n"
}
],
"clouds": {
"all": 0
},
"wind": {
"speed": 0.44,
"deg": 164.037
},
"sys": {
"pod": "n"
},
"dt_txt": "2019-03-30 20:00:00"
},
{
"dt": 1553979600,
"main": {
"temp": 282.731,
"temp_min": 282.731,
"temp_max": 282.731,
"pressure": 1023.413,
"sea_level": 1023.413,
"grnd_level": 964.039,
"humidity": 100,
"temp_kf": 0
},
"weather": [
{
"id": 800,
"main": "Clear",
"description": "clear sky",
"icon": "01n"
}
],
"clouds": {
"all": 0
},
"wind": {
"speed": 1.24,
"deg": 187.769
},
"sys": {
"pod": "n"
},
"dt_txt": "2019-03-30 21:00:00"
},
{
"dt": 1553983200,
"main": {
"temp": 282.031,
"temp_min": 282.031,
"temp_max": 282.031,
"pressure": 1023.284,
"sea_level": 1023.284,
"grnd_level": 963.786,
"humidity": 100,
"temp_kf": 0
},
"weather": [
{
"id": 800,
"main": "Clear",
"description": "clear sky",
"icon": "01n"
}
],
"clouds": {
"all": 0
},
"wind": {
"speed": 1.7,
"deg": 203.753
},
"sys": {
"pod": "n"
},
"dt_txt": "2019-03-30 22:00:00"
},
{
"dt": 1553986800,
"main": {
"temp": 281.345,
"temp_min": 281.345,
"temp_max": 281.345,
"pressure": 1023.085,
"sea_level": 1023.085,
"grnd_level": 963.561,
"humidity": 100,
"temp_kf": 0
},
"weather": [
{
"id": 800,
"main": "Clear",
"description": "clear sky",
"icon": "01n"
}
],
"clouds": {
"all": 0
},
"wind": {
"speed": 1.9,
"deg": 221.413
},
"sys": {
"pod": "n"
},
"dt_txt": "2019-03-30 23:00:00"
},
{
"dt": 1553990400,
"main": {
"temp": 280.755,
"temp_min": 280.755,
"temp_max": 280.755,
"pressure": 1022.786,
"sea_level": 1022.786,
"grnd_level": 963.212,
"humidity": 100,
"temp_kf": 0
},
"weather": [
{
"id": 800,
"main": "Clear",
"description": "clear sky",
"icon": "01n"
}
],
"clouds": {
"all": 0
},
"wind": {
"speed": 2.02,
"deg": 232.806
},
"sys": {
"pod": "n"
},
"dt_txt": "2019-03-31 00:00:00"
},
{
"dt": 1553994000,
"main": {
"temp": 280.239,
"temp_min": 280.239,
"temp_max": 280.239,
"pressure": 1022.381,
"sea_level": 1022.381,
"grnd_level": 962.795,
"humidity": 100,
"temp_kf": 0
},
"weather": [
{
"id": 800,
"main": "Clear",
"description": "clear sky",
"icon": "01n"
}
],
"clouds": {
"all": 0
},
"wind": {
"speed": 2.05,
"deg": 238.431
},
"sys": {
"pod": "n"
},
"dt_txt": "2019-03-31 01:00:00"
},
{
"dt": 1553997600,
"main": {
"temp": 280.065,
"temp_min": 280.065,
"temp_max": 280.065,
"pressure": 1022.085,
"sea_level": 1022.085,
"grnd_level": 962.541,
"humidity": 100,
"temp_kf": 0
},
"weather": [
{
"id": 800,
"main": "Clear",
"description": "clear sky",
"icon": "02n"
}
],
"clouds": {
"all": 7
},
"wind": {
"speed": 1.99,
"deg": 245.401
},
"sys": {
"pod": "n"
},
"dt_txt": "2019-03-31 02:00:00"
},
{
"dt": 1554001200,
"main": {
"temp": 280.302,
"temp_min": 280.302,
"temp_max": 280.302,
"pressure": 1021.907,
"sea_level": 1021.907,
"grnd_level": 962.446,
"humidity": 100,
"temp_kf": 0
},
"weather": [
{
"id": 802,
"main": "Clouds",
"description": "scattered clouds",
"icon": "03n"
}
],
"clouds": {
"all": 28
},
"wind": {
"speed": 2.05,
"deg": 252.801
},
"sys": {
"pod": "n"
},
"dt_txt": "2019-03-31 03:00:00"
},
{
"dt": 1554004800,
"main": {
"temp": 280.533,
"temp_min": 280.533,
"temp_max": 280.533,
"pressure": 1021.802,
"sea_level": 1021.802,
"grnd_level": 962.318,
"humidity": 100,
"temp_kf": 0
},
"weather": [
{
"id": 802,
"main": "Clouds",
"description": "scattered clouds",
"icon": "03n"
}
],
"clouds": {
"all": 46
},
"wind": {
"speed": 2.15,
"deg": 245.989
},
"sys": {
"pod": "n"
},
"dt_txt": "2019-03-31 04:00:00"
},
{
"dt": 1554008400,
"main": {
"temp": 280.4,
"temp_min": 280.4,
"temp_max": 280.4,
"pressure": 1021.819,
"sea_level": 1021.819,
"grnd_level": 962.206,
"humidity": 100,
"temp_kf": 0
},
"weather": [
{
"id": 803,
"main": "Clouds",
"description": "broken clouds",
"icon": "04d"
}
],
"clouds": {
"all": 57
},
"wind": {
"speed": 2.34,
"deg": 237.072
},
"sys": {
"pod": "d"
},
"dt_txt": "2019-03-31 05:00:00"
},
{
"dt": 1554012000,
"main": {
"temp": 280.652,
"temp_min": 280.652,
"temp_max": 280.652,
"pressure": 1021.732,
"sea_level": 1021.732,
"grnd_level": 962.296,
"humidity": 100,
"temp_kf": 0
},
"weather": [
{
"id": 803,
"main": "Clouds",
"description": "broken clouds",
"icon": "04d"
}
],
"clouds": {
"all": 61
},
"wind": {
"speed": 2.48,
"deg": 240.71
},
"sys": {
"pod": "d"
},
"dt_txt": "2019-03-31 06:00:00"
},
{
"dt": 1554015600,
"main": {
"temp": 281.777,
"temp_min": 281.777,
"temp_max": 281.777,
"pressure": 1021.023,
"sea_level": 1021.023,
"grnd_level": 962.432,
"humidity": 100,
"temp_kf": 0
},
"weather": [
{
"id": 500,
"main": "Rain",
"description": "light rain",
"icon": "10d"
}
],
"clouds": {
"all": 48
},
"wind": {
"speed": 2.72,
"deg": 257.441
},
"rain": {
"1h": 0.188
},
"sys": {
"pod": "d"
},
"dt_txt": "2019-03-31 07:00:00"
},
{
"dt": 1554019200,
"main": {
"temp": 282.933,
"temp_min": 282.933,
"temp_max": 282.933,
"pressure": 1020.601,
"sea_level": 1020.601,
"grnd_level": 962.55,
"humidity": 100,
"temp_kf": 0
},
"weather": [
{
"id": 500,
"main": "Rain",
"description": "light rain",
"icon": "10d"
}
],
"clouds": {
"all": 53
},
"wind": {
"speed": 2.59,
"deg": 268.936
},
"rain": {
"1h": 0.25
},
"sys": {
"pod": "d"
},
"dt_txt": "2019-03-31 08:00:00"
},
{
"dt": 1554022800,
"main": {
"temp": 283.906,
"temp_min": 283.906,
"temp_max": 283.906,
"pressure": 1020.44,
"sea_level": 1020.44,
"grnd_level": 962.628,
"humidity": 100,
"temp_kf": 0
},
"weather": [
{
"id": 500,
"main": "Rain",
"description": "light rain",
"icon": "10d"
}
],
"clouds": {
"all": 66
},
"wind": {
"speed": 2.34,
"deg": 280.821
},
"rain": {
"1h": 0.25
},
"sys": {
"pod": "d"
},
"dt_txt": "2019-03-31 09:00:00"
},
{
"dt": 1554026400,
"main": {
"temp": 284.568,
"temp_min": 284.568,
"temp_max": 284.568,
"pressure": 1020.102,
"sea_level": 1020.102,
"grnd_level": 962.005,
"humidity": 100,
"temp_kf": 0
},
"weather": [
{
"id": 500,
"main": "Rain",
"description": "light rain",
"icon": "10d"
}
],
"clouds": {
"all": 75
},
"wind": {
"speed": 1.9,
"deg": 271.118
},
"rain": {
"1h": 0.187
},
"sys": {
"pod": "d"
},
"dt_txt": "2019-03-31 10:00:00"
},
{
"dt": 1554030000,
"main": {
"temp": 286.2,
"temp_min": 286.2,
"temp_max": 286.2,
"pressure": 1019.724,
"sea_level": 1019.724,
"grnd_level": 961.365,
"humidity": 100,
"temp_kf": 0
},
"weather": [
{
"id": 501,
"main": "Rain",
"description": "moderate rain",
"icon": "10d"
}
],
"clouds": {
"all": 79
},
"wind": {
"speed": 3.19,
"deg": 305.976
},
"rain": {
"1h": 1.25
},
"sys": {
"pod": "d"
},
"dt_txt": "2019-03-31 11:00:00"
},
{
"dt": 1554033600,
"main": {
"temp": 285.683,
"temp_min": 285.683,
"temp_max": 285.683,
"pressure": 1019.562,
"sea_level": 1019.562,
"grnd_level": 961.265,
"humidity": 100,
"temp_kf": 0
},
"weather": [
{
"id": 500,
"main": "Rain",
"description": "light rain",
"icon": "10d"
}
],
"clouds": {
"all": 81
},
"wind": {
"speed": 5.29,
"deg": 333.416
},
"rain": {
"1h": 0.687
},
"sys": {
"pod": "d"
},
"dt_txt": "2019-03-31 12:00:00"
},
{
"dt": 1554037200,
"main": {
"temp": 285.221,
"temp_min": 285.221,
"temp_max": 285.221,
"pressure": 1019.558,
"sea_level": 1019.558,
"grnd_level": 961.421,
"humidity": 100,
"temp_kf": 0
},
"weather": [
{
"id": 500,
"main": "Rain",
"description": "light rain",
"icon": "10d"
}
],
"clouds": {
"all": 100
},
"wind": {
"speed": 5.97,
"deg": 354.865
},
"rain": {
"1h": 0.312
},
"sys": {
"pod": "d"
},
"dt_txt": "2019-03-31 13:00:00"
},
{
"dt": 1554040800,
"main": {
"temp": 284.535,
"temp_min": 284.535,
"temp_max": 284.535,
"pressure": 1019.713,
"sea_level": 1019.713,
"grnd_level": 961.594,
"humidity": 100,
"temp_kf": 0
},
"weather": [
{
"id": 500,
"main": "Rain",
"description": "light rain",
"icon": "10d"
}
],
"clouds": {
"all": 100
},
"wind": {
"speed": 5.84,
"deg": 6.023
},
"rain": {
"1h": 0.126
},
"sys": {
"pod": "d"
},
"dt_txt": "2019-03-31 14:00:00"
},
{
"dt": 1554044400,
"main": {
"temp": 283.6,
"temp_min": 283.6,
"temp_max": 283.6,
"pressure": 1020.222,
"sea_level": 1020.222,
"grnd_level": 961.918,
"humidity": 100,
"temp_kf": 0
},
"weather": [
{
"id": 804,
"main": "Clouds",
"description": "overcast clouds",
"icon": "04d"
}
],
"clouds": {
"all": 100
},
"wind": {
"speed": 5.41,
"deg": 10.429
},
"rain": {},
"sys": {
"pod": "d"
},
"dt_txt": "2019-03-31 15:00:00"
},
{
"dt": 1554048000,
"main": {
"temp": 282.695,
"temp_min": 282.695,
"temp_max": 282.695,
"pressure": 1020.903,
"sea_level": 1020.903,
"grnd_level": 962.455,
"humidity": 100,
"temp_kf": 0
},
"weather": [
{
"id": 500,
"main": "Rain",
"description": "light rain",
"icon": "10d"
}
],
"clouds": {
"all": 100
},
"wind": {
"speed": 5.33,
"deg": 9.238
},
"rain": {
"1h": 0.062
},
"sys": {
"pod": "d"
},
"dt_txt": "2019-03-31 16:00:00"
},
{
"dt": 1554051600,
"main": {
"temp": 281.5,
"temp_min": 281.5,
"temp_max": 281.5,
"pressure": 1021.88,
"sea_level": 1021.88,
"grnd_level": 963.288,
"humidity": 100,
"temp_kf": 0
},
"weather": [
{
"id": 804,
"main": "Clouds",
"description": "overcast clouds",
"icon": "04d"
}
],
"clouds": {
"all": 100
},
"wind": {
"speed": 5,
"deg": 7.624
},
"rain": {},
"sys": {
"pod": "d"
},
"dt_txt": "2019-03-31 17:00:00"
}
],
"city": {
"id": 2867714,
"name": "Munich",
"coord": {
"lat": 48.1371,
"lon": 11.5754
},
"country": "DE",
"population": 1260391
}
};
      this.setCurrentCity(response.city.name);
      this.setHourlyInfoList(response.list);
    } catch(e) {
      console.error(e);
    } finally {
      this.setLoading(false);
    }
  }
};

export default WeatherPage;
