import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import 'antd/dist/antd.css';
import App from 'Components/App';

import {Provider} from 'mobx-react';
import store from 'Stores';

import {GA_CONTAINER_ID, HOTJAR_ID, HOTJAR_VERSION} from 'Config';

import ReactGA from 'react-ga';
if (GA_CONTAINER_ID) {
  ReactGA.initialize(GA_CONTAINER_ID);
  ReactGA.pageview(window.location.pathname + window.location.search);
}

import {hotjar} from 'react-hotjar';
if (HOTJAR_ID && HOTJAR_VERSION) {
  hotjar.initialize(HOTJAR_ID, HOTJAR_VERSION);
}

ReactDOM.render(
  <Provider store={store}>
    <App />
  </Provider>
  , document.getElementById('root')
);