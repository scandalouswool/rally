import React, { Component } from 'react';

export default class App extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div>
        This is the app view.
        {this.props.children}
      </div>
    )
  }
}
