import React, { Component } from 'react';
import { Link } from 'react-router';

class Navbar extends Component {
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
              <li><Link to='/menu'>Algorithms</Link></li>
              <li><Link to='/'>Login</Link></li>  
            </ul>
          </div>
        </nav>
      </div>
    )
  }
}

export default Navbar;