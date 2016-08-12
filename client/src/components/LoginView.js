import React, { Component } from 'react';
import { Link } from 'react-router';

class LoginView extends Component {
  constructor(props) {
    super(props);

    this.state = {
      email: '',
      password: ''
    };
  }

  // Fire action to attempt login with inputted username/password
  // and route user to the homepage
  handleLogin(event) {
    event.preventDefault();

    let email = this.state.email.trim();
    let password = this.state.password.trim();
    console.log('Login to be handled');

    firebase.auth().signInWithEmailAndPassword(email, password);
  }

  // Save username and password form inputs to component's state
  handleInputChange(event) {
    let newState = {};
    newState[event.target.id] = event.target.value;
    this.setState(newState);
  }

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
