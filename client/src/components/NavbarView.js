import React, { Component, PropTypes } from 'react';
import { Link } from 'react-router';
import firebase from 'firebase';

class NavbarView extends Component {
  constructor(props) {
    super(props);

    console.log('Navbar props: ', this.props);
  }

  handleLogout(event) {
    event.preventDefault();
    firebase.auth().signOut()
      .then(() => {
        console.log('Successfully logged out!');
        // Need to fire action to log out?
      })
      .catch((error) => {
        console.log('Error logging out: ' + error);
      });
    this.context.router.push('/menu');
  }

  goToLogin(event) {
    event.preventDefault();
    this.context.router.push('login');
  }

  render() {
    // This is the login or logout button depending on the user's authentication state
    let text, className, route, clickHandler;
    if (this.props.auth.uid) {
      text = ' Log Out';
      className = 'glyphicon glyphicon-log-out';
      route = '';
      clickHandler = this.handleLogout.bind(this);
    } else {
      text = ' Log In';
      className = 'glyphicon glyphicon-log-in';
      route = 'login';
      clickHandler = this.goToLogin.bind(this);
    }

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
              <img className="logo" src="../../assets/logo.png"></img>
            </div>
            <div className="collapse navbar-collapse" id="myNavbar">
              <ul className="nav navbar-nav">
                <li><Link to="/"><span className="glyphicon glyphicon-home"></span> Home</Link></li>
                <li><Link to="menu"><span className="glyphicon glyphicon-tasks"></span> Projects</Link></li>
                <li><Link to="project"><span className="glyphicon glyphicon-blackboard"></span> Current Project</Link></li>
              </ul>
              <ul className="nav navbar-nav navbar-right">
                <li><Link to={route} onClick={clickHandler}><span className={className}></span>{text}</Link></li>
              </ul>
            </div>
          </div>
        </nav>
      </div>
    );
  }
}

// Attach router to NavbarView's context
NavbarView.contextTypes = {
  router: PropTypes.object.isRequired
};

export default NavbarView;
