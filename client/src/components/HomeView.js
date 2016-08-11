import React, { Component } from 'react';
import { Link } from 'react-router';

class HomeView extends Component {
  render() {
    return (
      <div className="jumbotron">
        <h1>Race to the finish line</h1>
        <p>Process the toughest, largest problems in less time than you ever imagined</p>
        <p><button className="btn-lg"><Link to="menu">Click here to discover projects</Link></button></p>
      </div>
    );
  }
}

export default HomeView;
