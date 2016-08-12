import React, { Component } from 'react';
import { Link } from 'react-router';

class LoginView extends Component {
  render() {
    return (
     <div className="container center-text">
        <form className="form-login">
          <h2>Log In</h2>
          <input id="username" className="form-control" type="text" placeholder="Username"/>
          <input id="password" className="form-control" type="password" placeholder="Password"/>
          <Link to="/"><button className="btn btn-success btn-block" type="submit" value="Save">Log In</button></Link>
        </form>

        <div>
          <span><Link to="/signup">Don't have an account? Sign up here!</Link></span>
        </div>
      </div>
    );
  }
}

export default LoginView;
