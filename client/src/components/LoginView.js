import { Component } from 'react';

class LoginView extends Component {
  render() {
    return (
     <div className='padded container center-text'>
        <form className='form-login'>
          <h2>Log In</h2>
          <input id='username' className='form-control' type='text' placeholder='Username'/>
          <input id='password' className='form-control' type='password' placeholder='Password'/>
          <button className='btn btn-success btn-block' type='submit' value='Save'>Log In</button>
        </form>

        <div>
          <span><a href='/signup'>Don't have an account? Sign up here!</a></span>
        </div>
      </div>
    )
  }
}

export default LoginView
