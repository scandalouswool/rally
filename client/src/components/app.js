import React, { Component } from 'react';
import Menu from '../containers/menu';

export default class App extends Component {

  render() {
    return (
      <div>
        This is the app view.
        <Menu />
      </div>
    )
  }
}
