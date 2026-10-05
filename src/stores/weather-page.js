import { observable, action, computed } from 'mobx';
import axios from 'axios';
import { reduce, isEmpty, slice, cloneDeep } from 'lodash';
import moment from 'moment';

const WEATHER_CONDITIONS = {
  0: ['Clear sky', '☀️'],
  1: ['Mainly clear', '🌤️'],
  2: ['Partly cloudy', '⛅'],
  3: ['Overcast', '☁️'],
  45: ['Fog', '🌫️'],
  48: ['Depositing rime fog', '🌫️'],
  51: ['Light drizzle', '🌦️'],
  53: ['Moderate drizzle', '🌦️'],
  55: ['Dense drizzle', '🌧️'],
  56: ['Light freezing drizzle', '🌧️'],
  57: ['Dense freezing drizzle', '🌧️'],
  61: ['Slight rain', '🌧️'],
  63: ['Moderate rain', '🌧️'],
  65: ['Heavy rain', '🌧️'],
  66: ['Light freezing rain', '🌧️'],
  67: ['Heavy freezing rain', '🌧️'],
  71: ['Slight snowfall', '🌨️'],
  73: ['Moderate snowfall', '🌨️'],
  75: ['Heavy snowfall', '❄️'],
  77: ['Snow grains', '❄️'],
  80: ['Slight rain showers', '🌦️'],
  81: ['Moderate rain showers', '🌧️'],
  82: ['Violent rain showers', '🌧️'],
  85: ['Slight snow showers', '🌨️'],
  86: ['Heavy snow showers', '❄️'],
  95: ['Thunderstorm', '⛈️'],
  96: ['Thunderstorm with slight hail', '⛈️'],
  99: ['Thunderstorm with heavy hail', '⛈️'],
};

const describeWeather = (code) => WEATHER_CONDITIONS[code] || ['Unknown conditions', ''];

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
  @observable currentWeather;
  @observable dailyWeather;
  @observable hourlyInfoList = [];
  @observable todayLineChartType = 'temp';
  @observable nextLineChartType = 'temp';

  @computed
  get currentInfo() {
    if (!this.currentWeather) {
      return {};
    }

    const {
      temperature_2m: temp,
      apparent_temperature: apparentTemp,
      relative_humidity_2m: humidity,
      cloud_cover: clouds,
      wind_speed_10m: windSpeed,
      wind_direction_10m: windDirection,
      weather_code: weatherCode,
    } = this.currentWeather;
    const rainSum = this.dailyWeather && this.dailyWeather.rain_sum[0];
    const rainChance = this.dailyWeather && this.dailyWeather.precipitation_probability_max[0];
    const [description, icon] = describeWeather(weatherCode);
    const wordingForNoInfo = 'No Info';

    return {
      mainDescription: description,
      detailDescription: '',
      icon,
      temp: temp == null ? wordingForNoInfo : `${Math.round(temp)}°C`,
      feelsLike: apparentTemp == null ? '' : `Feels like ${Math.round(apparentTemp)}°C`,
      humidity: humidity == null ? wordingForNoInfo : `${humidity}%`,
      clouds: clouds == null ? wordingForNoInfo : `${clouds}%`,
      wind: {
        speed: windSpeed == null ? wordingForNoInfo : `${windSpeed} m/s`,
        degree: windDirection == null ? wordingForNoInfo : `${windDirection} degrees`,
      },
      rain: rainSum == null && rainChance == null ? null : {
        total: rainSum == null ? '' : `${Math.round(rainSum * 10) / 10} mm`,
        chance: rainChance == null ? '' : `Up to ${rainChance}% chance`,
      },
    };
  }

  generateBaseConfig = (type, label, unit) => {
    let config = cloneDeep(this.defaultLineChartConfig);
    config.yField = type;
    config.tooltip = {
      formatter: (date, value, tooltipLabel) => ({
        title: date,
        name: `${label || tooltipLabel} (${unit})`,
        value,
      }),
    };
    return config;
  };

  transformInfoListToLineChartConfigs = (infoList) => {
    return reduce(infoList, (result, hourlyInfo) => {
      const datetime = moment(hourlyInfo.time).format('MMM D HH[h]');

      result.temp.data.push(
        {
          datetime,
          metric: 'Temperature',
          value: hourlyInfo.temperature_2m,
        },
        {
          datetime,
          metric: 'Apparent temperature',
          value: hourlyInfo.apparent_temperature,
        }
      );
      result.humidity.data.push({
        datetime,
        humidity: hourlyInfo.relative_humidity_2m
      });
      result.clouds.data.push({
        datetime,
        clouds: hourlyInfo.cloud_cover
      });
      result.wind.data.push({
        datetime,
        wind: hourlyInfo.wind_speed_10m
      });
      result.rain.data.push({
        datetime,
        rain: hourlyInfo.rain,
      });
      result.rainChance.data.push({
        datetime,
        rainChance: hourlyInfo.precipitation_probability,
      });
      return result;
    }, {
      temp: {
        ...this.generateBaseConfig('value'),
        seriesField: 'metric',
        legend: { position: 'top-right' },
        tooltip: {
          formatter: (date, value, label) => ({
            title: date,
            name: `${label === 'Apparent temperature' ? 'Apparent Temperature' : 'Temperature'} (°C)`,
            value,
          }),
        },
      },
      humidity: this.generateBaseConfig('humidity', 'Humidity', '%'),
      clouds: this.generateBaseConfig('clouds', 'Cloud Cover', '%'),
      wind: this.generateBaseConfig('wind', 'Wind Speed', 'm/s'),
      rain: this.generateBaseConfig('rain', 'Rain', 'mm'),
      rainChance: this.generateBaseConfig('rainChance', 'Rain Chance', '%'),
    });
  };

  @computed
  get todayInfo() {
    if (isEmpty(this.hourlyInfoList)) {
      return {};
    }

    const todayHourlyInfoList = slice(this.hourlyInfoList, 0, 12);
    return this.transformInfoListToLineChartConfigs(todayHourlyInfoList);
  }

  @computed
  get nextInfo() {
    if (isEmpty(this.hourlyInfoList)) {
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
  setCurrentWeather = (value) => (this.currentWeather = value);

  @action
  setDailyWeather = (value) => (this.dailyWeather = value);

  @action
  setHourlyInfoList = (list) => (this.hourlyInfoList = list);

  @action
  setTodayLineChartType = (type) => (this.todayLineChartType = type);

  @action
  setNextLineChartType = (type) => (this.nextLineChartType = type);

  fetchData = async (latitude, longitude, city) => {
    const response = await axios.get('https://api.open-meteo.com/v1/forecast', {
      params: {
        latitude,
        longitude,
        current: 'temperature_2m,apparent_temperature,relative_humidity_2m,cloud_cover,wind_speed_10m,wind_direction_10m,weather_code',
        hourly: 'temperature_2m,apparent_temperature,relative_humidity_2m,cloud_cover,wind_speed_10m,wind_direction_10m,rain,precipitation_probability',
        daily: 'rain_sum,precipitation_probability_max',
        forecast_hours: 96,
        timezone: 'auto',
        temperature_unit: 'celsius',
        wind_speed_unit: 'ms',
      },
    });
    const { current, daily, hourly } = response.data;
    const hourlyInfoList = hourly.time.map((time, index) => ({
      time,
      temperature_2m: hourly.temperature_2m[index],
      apparent_temperature: hourly.apparent_temperature[index],
      relative_humidity_2m: hourly.relative_humidity_2m[index],
      cloud_cover: hourly.cloud_cover[index],
      wind_speed_10m: hourly.wind_speed_10m[index],
      rain: hourly.rain[index],
      precipitation_probability: hourly.precipitation_probability[index],
    }));

    this.setCurrentCity(city);
    this.setCurrentWeather(current);
    this.setDailyWeather(daily);
    this.setHourlyInfoList(hourlyInfoList);
  };

  fetchWeatherData = async () => {
    this.setLoading(true);
    this.setError(null);
    let latitude = 51.5072;
    let longitude = -0.1276;
    let city = 'London';

    if ('geolocation' in navigator) {
      try {
        const position = await new Promise((resolve, reject) => {
          navigator.geolocation.getCurrentPosition(resolve, reject, {
            maximumAge: 600000,
            timeout: 10000,
          });
        });
        latitude = position.coords.latitude;
        longitude = position.coords.longitude;
        city = 'Current location';
      } catch (error) {
        console.warn('Unable to determine location; using London.', error);
      }
    }

    try {
      await this.fetchData(latitude, longitude, city);
    } catch (error) {
      console.error(error);
      this.setError(error);
    } finally {
      this.setLoading(false);
    }
  };
};

export default WeatherPage;
