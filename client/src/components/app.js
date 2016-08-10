import React, { Component } from 'react';
import { Link } from 'react-router';
import io from 'socket.io-client';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
// import some function from actions
import { saveSocket } from '../actions/index';

class App extends Component {

  constructor() {
    super();
    this.socket = io();
  }

  componentWillMount() {

    /**********************************************************
    // Create an object with methods containing socket emitters
    **********************************************************/
    let socketMethods = {
      socket: this.socket,
      // Hard coded for now
      sendReady: () => {
        let projectId = 0;  
        this.socket.emit('userReady', projectId);
      },
      getAllProjects: () => {
        this.socket.emit('getAllProjects');
      }
      // createWebWorker: () {
      //   let myWebWorker = null;

      //   //this checks if your computer can run web workers, Worker is a global variable that is native to the browser
      //   if (typeof(Worker) !== 'undefined') {
      //     console.log('Initializing new Web Worker');
      //     myWebWorker = new Worker('../../webWorker.js');
      //   } else {
      //     console.log('This browser does not support Web Workers. The main browser process will perform the calculations, which will likely cause noticeable delays.');
      //   }

      //   // myWebWorker will send back a Job object with the 
      //   // data field populated. Send this object to the server
      //   myWebWorker.onmessage = function(event) {
      //     var job = event.data;
      //     socket.emit('userJobDone', job);
      //   }
      // }
    }

    /**********************************************************
    // Add listeners to the socket
    **********************************************************/
    this.socket.on('updateWorkers', function(workers) {
      console.log('New workers list received:', workers);
    });

    this.socket.on('newJob', function(job) {
      //if myWebWorker is not null, that means we were able to create it
      if (myWebWorker !== null) {
        console.log('Web Worker assigned to the new job!');
        //send the job item to the web worker, postMessage sends a message to the web worker
        myWebWorker.postMessage(job);
      } else {
        console.log('This browser does not support Web Workers. mapData will run in the main browser process.');

        var mapDataFunc = eval('(' + job.mapData + ')');
        job.result = mapDataFunc(job.data);

        console.log('Job complete. Result is: ', job.result);
        console.log('Sending result back to server');
        
        this.socket.emit('userJobDone', job);
      }
    });

    this.socket.on('updateResults', function(results) {
      console.log(results);
      $('#nQueensSolutions').empty();

      results.forEach( function(item) {
        if (item !== null) {
          $('#nQueensSolutions').append('<li>Worker found ' + item + ' solutions!');        
        }
      });
    });

    this.socket.on('finalResult', function(final) {
      console.log('Received final results!');
      $('#nQueensSolutions').append('<li>Final nQueens result after applying the mirror-image algorithm: ' + final);
    });

    this.socket.on('allProjects', function(allProjects) {
      console.log(allProjects);
    })

    console.log(this.saveSocket);
    this.props.saveSocket(socketMethods);
  }

  render() {
    return (
      <div className='app'>

        <nav className='navbar navbar-default'>
          <div className='container-fluid'>
            <div className='navbar-header'>
              <h1>Rally</h1>
            </div>
            <ul className='nav navbar-nav'>
              <li><Link to='/'>Home</Link></li>
              <li><Link to='/menu'>Algorithms</Link></li>
              <li><Link to='/'>Login</Link></li>  
            </ul>
          </div>
        </nav>

        <div className='container'>
          {this.props.children}
        </div>
      </div>
    )
  }
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({saveSocket: saveSocket}, dispatch);
}

export default connect(null, mapDispatchToProps)(App);

