const express = require('express');
const app = express();
const server = require('http').Server(app);
const io = require('socket.io')(server);
const timers = require('node-timers');
const path = require('path');
const projectController = require('./controllers/projectController.js');
const pc = new projectController();
const _ = require('lodash');

// Tester module
const nQueens = require('./projects/nQueens.js');
const primes = require('./projects/primes.js');

app.use(express.static(__dirname + '/../client'));

// For accessing the Web Worker script file
app.get('/webworker', (req, res) => {
  res.sendFile(path.resolve(__dirname + '/../client/src/utils/webWorker.js'));
});

//this is for when the user chooses to enter our site with a specific path
//it will route them to index.html. The front-end will then handle the route
app.get('*', (req, res) => {
  console.log('Sending index file');
  res.sendFile(path.resolve(__dirname + '/../client/index.html'));
});

server.listen(process.env.PORT || 8000, () => {
  console.log('Now listening on port', server.address().port);
});

// /*
// ===============
// EVENT LISTENERS
// ===============
// */

io.on('connect', (socket) => {
  // On initial connection, send the projects list to the client
  console.log('User connected:', socket.id);
  // pc.sendAllProjects(socket);
  pc.sendUpdateAllProjects(socket);
  
  // 'disconnect' event handler
  // Pass the socket.id for this user to the ProjectController object
  // ProjectController will remove the Worker object associated with this
  // socket connection and reassign its work to another object.
  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
    pc.userDisconnect(socket.id);
  });
 
  // 'userReady' event handler
  // Pass the socket and projectId to the ProjectController object
  // ProjectController will create a new Worker in the requested project
  // and associate it with this socket connection.
  // The socket connection will be passed to the relevant Worker object
  // so that it can emit messages directly.
  socket.on('userReady', (readyMessage) => {
    console.log('User ready for project:', readyMessage.projectId);
    pc.userReady(readyMessage, socket);
  });

  socket.on('userDisconnect', () => {
    console.log('User left the project:', socket.id);
    pc.userDisconnect(socket.id);
  });

  // 'userJobDone' event handler
  // Pass completed Job to the ProjectController object
  // The completed Job object will have a 'result' property
  socket.on('userJobDone', (completedJob) => {
    console.log('User finished a job');
    pc.userJobDone(completedJob);
    pc.sendUpdateAllProjects(io);
  });

  // 'createProject' event handler
  // Passes an 'options' object to the ProjectController
  // Options must have the form that's defined in the Project constructor script, specifically:
  // options = {
  //    dataSet: ARRAY, // Data to be operated on. 
  //    generateDataSet: FUNCTION, (Optional input. Will use dataSet if both
  //    dataSet and generateDataSet are provided)
  //    mapData: FUNCTION,  // Function to run on every data item. 
  //    reduceResults: FUNCTION  // Function to run on completed results array
  // }
  // ProjectController will instantiate a new Project object with the 
  // information stored in the options object.
  // The server will pass the io object to the ProjectController to directly
  // handle the sending of socket messages
  socket.on('createProject', (project) => {
    console.log('Creating project...', project);
    pc.createProject(project, io);
  });

  // // 'getProjectsUpdate' event handler
  // // Sends back an object containing information
  // // about all projects and workers
  // socket.on('getProjectsUpdate', () => {
  //   pc.sendUpdateAllProjects(socket);
  // });

  socket.on('getAllProjectsUpdate', () => {
    pc.sendUpdateAllProjects(socket);
  });

  // 'error' event handler
  socket.on('error', (error) => {
    console.log('Socket error:', error);
  });
});
