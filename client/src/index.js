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
const firebaseApp = firebase.initializeApp(ENV);

ReactDOM.render(
  <Provider store={store}>
    <Router history={browserHistory} routes={routes} />
  </Provider>
, document.getElementById('app'));

store.dispatch(startListeningToAuth(firebaseApp));
