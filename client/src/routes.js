import React from 'react';
import { Route, IndexRoute } from 'react-router';

import App from './components/app'
import HomeView from './components/home.js'
import MenuView from './containers/menu.js'

console.log(MenuView);

export default (
  <Route path='/' component={App}>
    <IndexRoute component={HomeView} />
    <Route path='menu' component={MenuView} />
  </Route>
)

    // <Route path="createAlgorithm" component={CreateAlgorithmView} />
    // <Route path="algorithm" component={AlgorithmView} />