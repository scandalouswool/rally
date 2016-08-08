const express = require('express');
const app = express();
const server = require('http').Server(app);
const io = require('socket.io')(server);
const timers = require('node-timers');
const projectController = require('./controllers/projectController.js');
const pc = new projectController();
const _ = require('lodash');

// Tester module
const testProject = require('./projects/tester.js');

app.use(express.static(__dirname + '/../client'));

server.listen(process.env.PORT || 8000, () => {
  console.log('Now listening on port', server.address().port);
});

// /*
// ===============
// EVENT LISTENERS
// ===============
// */

io.on('connect', (socket) => {
  
  // 'disconnect' event handler
  // Pass the socket.id for this user to the ProjectController object
  // ProjectController will remove the Worker object associated with this
  // socket connection and reassign its work to another object.
  socket.on('disconnect', () => {
    console.log('User disconnected');
    pc.userDisconnect(socket.id);
  });
  
  // 'userReady' event handler
  // Pass the socket and projectId to the ProjectController object
  // ProjectController will create a new Worker in the requested project
  // and associate it with this socket connection.
  // The socket connection will be passed to the relevant Worker object
  // so that it can emit messages directly.
  socket.on('userReady', (projectId) => {
    console.log('User ready for project:', projectId);
    pc.userReady(projectId, socket);
  });

  // 'userJobDone' event handler
  // Pass completed Job to the ProjectController object
  // The completed Job object will have a 'result' property
  socket.on('userJobDone', (completedJob) => {
    console.log('User finished a job');
    pc.userJobDone(completedJob);
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
    pc.createProject(project, io);
  });

  // 'error' event handler
  socket.on('error', (error) => {
    console.log('Socket error:', error);
  });
});

// Testers
pc.createProject(testProject, io);
