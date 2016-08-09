import React, { Component } from 'react';
import { Link } from 'react-router';

class HomeView extends Component {
  render() {
    return (
      <div>
        <div>Yay crowdsourced distributed computing. This is more information about our app...</div>
        <button><Link to='menu'>Begin</Link></button>
      </div>
    )
  }
}

export default HomeView;