const express = require('express');
const app = express();
const server = require('http').Server(app);
const io = require('socket.io')(server);
const path = require('path');
const projectController = require('./controllers/projectController.js');
const db = require('./db/');
const pc = new projectController(db, io);

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
  socket.emit('updateAllProjects', pc.getUpdateAllProjects());
  
  // 'disconnect' event handler
  // Pass the socket.id for this user to the ProjectController object
  // ProjectController will remove the Worker object associated with this
  // socket connection and reassign its work to another object.
  socket.on('disconnect', () => {
    if (pc.userDisconnect(socket.id)) {
      console.log('User removed from projects: ', socket.id);
      io.emit('updateAllProjects', pc.getUpdateAllProjects());

    } else {
      console.log('Error: cannot find user:', socket.id);
    }
    
  });

  // 'userReady' event handler
  // Pass the socket and projectId to the ProjectController object
  // ProjectController will create a new Worker in the requested project
  // and associate it with this socket connection.
  // The socket connection will be passed to the relevant Worker object
  // so that it can emit messages directly.
  socket.on('userReady', (readyMessage) => {
    console.log(readyMessage);
    console.log('User ready for project:', readyMessage.projectId);

    // Passes callback function that will be called on new jobs assigned
    // to the new user
    pc.userReady(readyMessage, (newJob) => {
      socket.emit('newJob', newJob);
    });

    // Send results of selected project to the user
    socket.emit('updateResults', pc.getUpdateResults(readyMessage.projectId));

    // Send global update of all projects to users
    io.emit('updateAllProjects', pc.getUpdateAllProjects());
  });

  socket.on('userDisconnect', () => {
    if (pc.userDisconnect(socket.id)) {
      console.log('User left the project:', socket.id);
      io.emit('updateAllProjects', pc.getUpdateAllProjects());

    } else {
      console.log('Error: that user not found');
    }
  });

  // 'userJobDone' event handler
  // Pass completed Job to the ProjectController object
  // The completed Job object will have a 'result' property
  socket.on('userJobDone', (completedJob) => {
    console.log('User finished a job');
    pc.userJobDone(completedJob, (newJob) => {
      socket.emit('newJob', newJob);
    });
    io.emit('updateAllProjects', pc.getUpdateAllProjects());
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

    if (pc.createProject(project)) {
      console.log('Successfully created a new project');
      io.emit('updateAllProjects', pc.getUpdateAllProjects());

    } else {
      console.log('Error creating project');
    }

  });

  socket.on('pendProject', (project) => {
    pc.pendProject(project, io);
  });

  socket.on('pendToCreateProject', (pendingDecision) => {
    if (pendingDecision.decision) {
      pc.createProject(pendingDecision.project, io);
    }
    pc.removePendingProject(pendingDecision.projectId, io);
  });

  socket.on('getAllProjectsUpdate', () => {
    socket.emit('updateAllProjects', pc.getUpdateAllProjects());
  });

  // 'error' event handler
  socket.on('error', (error) => {
    console.log('Socket error:', error);
  });
});
