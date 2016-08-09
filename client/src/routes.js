import React from 'react';
import { Route, IndexRoute } from 'react-router';

import App from './components/app';
import HomeView from './components/home';
import MenuView from './containers/menu';
import AlgorithmView from './components/algorithm';
import CreateAlgorithmView from './components/createAlgorithm';
import ErrorView from './components/error';

export default (
  <Route path='/' component={App}>
    <IndexRoute component={HomeView} />
    <Route path='menu' component={MenuView} />
    <Route path='algorithm' component={AlgorithmView} />
    <Route path='createalgorithm' component={CreateAlgorithmView} />
    <Route path='*' component={ErrorView} />
  </Route>
)