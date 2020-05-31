import {observable, action, computed} from 'mobx';
import axios from 'axios';

class WeatherPage {
  @observable currentInfo = {};
  @observable todayHourlyInfo = [];

  @computed
  get todayInfo() {
    // TODO
  }

  fetch
};

export default WeatherPage;
