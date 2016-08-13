import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { createStore, applyMiddleware } from 'redux';
import { Router, browserHistory } from 'react-router';
import thunk from 'redux-thunk';

import routes from './routes';
import reducers from './reducers/store';
import { startListeningToAuth } from './actions/actions';

const store = applyMiddleware(thunk)(createStore)(reducers);

// Initialize Firebase
import firebase from 'firebase';

// Alter before deployment to Heroku
import { ENV } from './environment/environment';
// const ENV = {
//   apiKey: process.env.apiKey,
//   authDomain: process.env.apiKey,
//   databaseURL: process.env.databaseURL,
//   storageBucket: process.env.storageBucket
// };
// console.log(process.env);
// console.log('Checking retrieval of ENV', ENV);
const firebaseApp = firebase.initializeApp(ENV);

ReactDOM.render(
  <Provider store={store}>
    <Router history={browserHistory} routes={routes} />
  </Provider>
, document.getElementById('app'));

// Initialize authentication listener
// (Not sure why this has to be set timeout...change if proves unnecessary)
setTimeout(store.dispatch(startListeningToAuth(firebaseApp)));
