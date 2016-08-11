import { Component } from 'react';

class SignupView extends Component {
  render() {
    return (
      <div className='padded container center-text'>
        <form className="form-login">
          <h2>Sign Up</h2>
          <input id="username" className="form-control" type="text" placeholder="Username"/>
          <input id="password" className="form-control" type="password" placeholder="Password"/>
          <button className="btn btn-success btn-block" type="submit" value="Save">Sign Up</button>
        </form>
      </div>
    )
  }
}

export default SignupView