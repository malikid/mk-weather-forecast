import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from 'Components/App';

import {Provider} from 'mobx-react';
import store from 'Stores';

ReactDOM.render(
  <Provider store={store}>
    <App />
  </Provider>
  , document.getElementById('root')
);