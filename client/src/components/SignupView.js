import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import {bindActionCreators } from 'redux';
import firebase from 'firebase';
import { setUsername } from '../actions/actions';

class SignupView extends Component {
  constructor(props) {
    super(props);

    this.state = {
      name: '',
      email: '',
      password: '',
      error: ''
    };
  }

  handleSignup(event) {
    event.preventDefault();

    let name = this.state.name.trim();
    let email = this.state.email.trim();
    let password = this.state.password.trim();

    // Firebase method that creates the user
    firebase.auth().createUserWithEmailAndPassword(email, password)
      .then(() => {
        // Firebase method that saves the user's name
        let user = firebase.auth().currentUser;
        user.updateProfile({ displayName: name })
          .then(() => {
            // Dispatch action to set username :)
            this.props.setUsername({
              username: name,
              uid: user.uid
            });

          })
          .catch(() => {
            this.setState({
              error: 'Please enter a legitimate name. Sorry if that was your actual name.'
            });
          });
        // Route back to homepage
        this.context.router.push('/');
      })
      .catch((error) => {
        // Change state to display error message for user to view
        this.setState({
          name: '',
          email: '',
          password: '',
          error: error.message
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
        <form className="form-login">
          <h2>Sign Up</h2>
          <input
            id="name"
            className="form-control"
            type="text"
            placeholder="Name"
            value={this.state.name}
            onChange={this.handleInputChange.bind(this)}
          />
          <input
            id="email"
            className="form-control"
            type="text"
            placeholder="Email"
            value={this.state.email}
            onChange={this.handleInputChange.bind(this)}
          />
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
            value="Save">
            Sign Up
          </button>
        </form>
        <div>{this.state.error}</div>
      </div>
    );
  }
}

// Attach router to NavbarView's context
SignupView.contextTypes = {
  router: PropTypes.object.isRequired
};

function mapDispatchToProps(dispatch) {
  return bindActionCreators({setUsername}, dispatch);
}

export default connect(null, mapDispatchToProps)(SignupView);
