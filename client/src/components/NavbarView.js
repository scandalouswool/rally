import React, { Component } from 'react';
import { Link } from 'react-router';
import io from 'socket.io-client';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
// import some function from actions
import { saveSocket } from '../actions/index';

class NavbarView extends Component {

  render() {
    return (
      <div>
        <nav className='navbar navbar-default'>
          <div className='container-fluid'>
            <div className='navbar-header'>
              <h1>Rally</h1>
            </div>
            <ul className='nav navbar-nav'>
              <li><Link to='/'>Home</Link></li>
              <li><Link to='/menu'>Projects</Link></li>
              <li><Link to='/'>Login</Link></li>  
            </ul>
          </div>
        </nav>
      </div>
    )
  }
}

export default NavbarView;
