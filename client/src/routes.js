import React from 'react';
import { Route, IndexRoute} from 'react-router';

import AppView from './containers/AppView';
import HomeView from './components/HomeView';
import MenuView from './containers/MenuView';
import ProjectView from './containers/ProjectView';
import SelectedProjectView from './containers/SelectedProjectView';
import LoginView from './components/LoginView';
import SignupView from './components/SignupView';
import ErrorView from './components/ErrorView';
import CreateProjectView from './containers/CreateProjectView';

export default (
  <Route path='/' component={AppView}>
    <IndexRoute component={HomeView} />
    <Route path='menu' component={MenuView} />
    <Route path='project' component={ProjectView} />
    <Route path='createProject' component={CreateProjectView} />
    <Route path='selectedproject' component={SelectedProjectView} />
    <Route path='login' component={LoginView} />
    <Route path='signup' component={SignupView} />
    <Route path='*' component={ErrorView} />
  </Route>
)