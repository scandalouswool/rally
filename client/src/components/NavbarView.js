import React, { Component } from 'react';
import { Link } from 'react-router';

class NavbarView extends Component {

  render() {
    return (
      <div>
        <nav className="navbar navbar-inverse">
          <div className="container-fluid">
            <div className="navbar-header">
              <button type="button" className="navbar-toggle" data-toggle="collapse" data-target="#myNavbar">
                <span className="icon-bar"></span>
                <span className="icon-bar"></span>
                <span className="icon-bar"></span> 
              </button>
              <Link className="navbar-brand" to="/">Rally</Link>
            </div>
            <div className="collapse navbar-collapse" id="myNavbar">
              <ul className="nav navbar-nav">
                <li><Link to="/"><span className="glyphicon glyphicon-home"></span> Home</Link></li>
                <li><Link to="menu"><span className="glyphicon glyphicon-tasks"></span> Projects</Link></li>
                <li><Link to="project"><span className="glyphicon glyphicon-blackboard"></span> Current Project</Link></li>
              </ul>
              <ul className="nav navbar-nav navbar-right">
                <li><Link to="login"><span className="glyphicon glyphicon-log-in"></span> Log In</Link></li>
                <li><Link to="login"><span className="glyphicon glyphicon-log-out"></span> Log Out</Link></li>
              </ul>
            </div>
          </div>
        </nav>
      </div>
    );
  }
}

export default NavbarView;