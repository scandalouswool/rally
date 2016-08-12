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

// Alter before deployment to Heroku
// import { ENV } from './environment/environment';
const ENV = {
  apiKey: process.env.apiKey,
  authDomain: process.env.apiKey,
  databaseURL: process.env.databaseURL,
  storageBucket: process.env.storageBucket
};
console.log(process.env);
console.log('Checking retrieval of ENV', ENV);
// const firebaseApp = firebase.initializeApp(ENV);

ReactDOM.render(
  <Provider store={createStoreWithMiddleware(reducers)}>
    <Router history={browserHistory} routes={routes} />
  </Provider>
, document.getElementById('app'));
