import React, { Component } from 'react';
import { Link } from 'react-router';
import io from 'socket.io-client';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
// import some function from actions
import { saveSocket } from '../actions/actions';

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
              <li><Link to='/'>Home</Link></li>
              <li><Link to='menu'>Projects</Link></li>
              <li><Link to='project'>Current Project</Link></li> 
            </ul>
          </div>
        </nav>
      </div>
    )
  }
}

export default NavbarView;
