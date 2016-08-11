import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { createStore, applyMiddleware } from 'redux';
import { Router, browserHistory } from 'react-router';

import routes from './routes';
import reducers from './reducers/store';
const createStoreWithMiddleware = applyMiddleware()(createStore);

// Initialize Firebase
import firebase from 'firebase';
import { ENV } from './environment/environment';
const firebaseApp = firebase.initializeApp(ENV);

ReactDOM.render(
  <Provider store={createStoreWithMiddleware(reducers)}>
    <Router history={browserHistory} routes={routes} />
  </Provider>
, document.getElementById('app'));
