const express = require('express');
const app = express();
const server = require('http').Server(app);
const io = require('socket.io')(server);
const timers = require('node-timers');
<<<<<<< 7c0eea363bc9b3681e1786b8db2c6233eba4331f
const projectController = require('./controllers/projectController.js');
const pc = new projectController();
const _ = require('lodash');

// Tester module
const testProject = require('./projects/tester.js');
=======
// const pc = require('/controllers/projectController.js');
>>>>>>> Create basic skeleton for the frontend using webpack

app.use(express.static(__dirname + '/../client'));

server.listen(process.env.PORT || 8000, () => {
  console.log('Now listening on port', server.address().port);
});

// /*
// ===============
// EVENT LISTENERS
// ===============
// */

<<<<<<< 7c0eea363bc9b3681e1786b8db2c6233eba4331f
io.on('connect', (socket) => {
  
  // 'disconnect' event handler
  // Pass the socket.id for this user to the ProjectController object
  // ProjectController will remove the Worker object associated with this
  // socket connection and reassign its work to another object.
  socket.on('disconnect', () => {
    console.log('User disconnected');
    pc.userDisconnect(socket.id);
  });
=======
// io.on('connect', (socket) => {
//   //on userConnect
//   //save socketId for this user
//   const socketId = socket.id;

//   //on disconnect
//   //pass the socketId for this user to projectController.js
//   socket.on('disconnect', () => {
//     pc.userDisconnect(socket.id);
//   });
>>>>>>> Create basic skeleton for the frontend using webpack
  
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

<<<<<<< 7c0eea363bc9b3681e1786b8db2c6233eba4331f
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
=======
//   //on userJobDone
//   //pass completed job to projectController.js
//   socket.on('userJobDone', (completedJob) => {
//     pc.userJobDone(completedJob);
//   });

//   //on createProject
//   //pass script to projectController.js
//   //NOTES:
//   //the idea is that the user inputs relevant information on the client-side
//   //this information will then emit 'createProject'
//   //createProject will receive this information and pass it to projectController.js
//   socket.on('createProject', (project) => {
//     pc.createProject(project);
//   });
// });
>>>>>>> Create basic skeleton for the frontend using webpack
