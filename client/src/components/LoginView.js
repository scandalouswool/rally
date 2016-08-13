import React, { Component, PropTypes } from 'react';
import { Link } from 'react-router';
import firebase from 'firebase';

class LoginView extends Component {
  constructor(props) {
    super(props);

    this.state = {
      email: '',
      password: '',
      error: ''
    };
  }

  // Fire action to attempt login with inputted username/password
  // and route user to the homepage
  handleLogin(event) {
    event.preventDefault();

    let email = this.state.email.trim();
    let password = this.state.password.trim();

    firebase.auth().signInWithEmailAndPassword(email, password)
      .then(() => {
        // Route to homepage
        this.context.router.push('/');
      })
      .catch((error) => {
        this.setState({
          email: '',
          password: '',
          error: 'Invalid email or password :('
        });
      });
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
        <form className="form-login" onSubmit={this.handleLogin.bind(this)}>
          <h2>Log In</h2>
          <input
            id="email"
            className="form-control"
            type="text"
            placeholder="Email"
            value={this.state.email}
            onChange={this.handleInputChange.bind(this)}/>
          <input
            id="password"
            className="form-control"
            type="password"
            placeholder="Password"
            value={this.state.password}
            onChange={this.handleInputChange.bind(this)}
          />
          <button
            className="btn btn-success btn-block"
            type="submit"
            value="Save"
            onClick={this.handleLogin.bind(this)}>
            Log In
          </button>
        </form>

        <div>
          <span><Link to="/signup">Don't have an account? Sign up here!</Link></span>
        </div>

        <div>{this.state.error}</div>
      </div>
    );
  }
}

// Attach router to NavbarView's context
LoginView.contextTypes = {
  router: PropTypes.object.isRequired
};

export default LoginView;
