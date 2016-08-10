import React, { Component } from 'react';
import io from 'socket.io-client';
import Navbar from '../components/navbar';

export default class App extends Component {
  constructor() {
    super();
    this.socket = io();
  }

  componentDidMount() {
    console.log('This is the socket state: ', this.socket);
  }

  render() {
    return (
      <div className='app'>
        <Navbar />
      
        <div className='container'>
          {this.props.children}
        </div>
      </div>
    )
  }
}


// function mapStateToProps(state) {
//   return {

//   }
// }

// function mapDispatchToProps(dispatch) {
//   return bindActionCreators({ selectAlgorithm: selectAlgorithm }, dispatch)
// }

// export default connect(mapStateToProps, mapDispatchToProps)(App);