import React, { Component } from 'react';
import { Link } from 'react-router';

class NavbarView extends Component {

  render() {
    return (
      <div>
        <nav className="navbar navbar-inverse navbar-fixed-top">
          <div className="container-fluid">
            <div className="navbar-header">
              <a className="navbar-brand" href="/">Rally</a>
            </div>
            <ul className="nav navbar-nav">
              <li><Link to="/">Home</Link></li>
              <li><Link to="menu">Projects</Link></li>
              <li><Link to="project">Current Project</Link></li>
              <li><Link to="login">Log In</Link></li>
              <li><Link to="login">Log Out</Link></li>
            </ul>
          </div>
        </nav>
      </div>
    );
  }
}

export default NavbarView;
