import React, { Component } from 'react';
import firebase from 'firebase';

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
          .catch(() => {
            this.setState({
              error: 'Please enter a legitimate name. Sorry if that was your actual name.'
            });
          });
      })
      .catch((error) => {
        // Change state to display error message for user to view
        this.setState({error: error.message});
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
          <input id="username" className="form-control" type="text" placeholder="Username"/>
          <input id="password" className="form-control" type="password" placeholder="Password"/>
          <button className="btn btn-success btn-block" type="submit" value="Save">Sign Up</button>
        </form>
        <div>{this.state.error}</div>
      </div>
    );
  }
}

export default SignupView;
