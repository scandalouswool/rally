const express = require('express');
const app = express();
const server = require('http').Server(app);
const io = require('socket.io')(server);
const path = require('path');
const projectController = require('./controllers/projectController.js');
const db = require('./db/');
const pc = new projectController(db, io);

app.use(express.static(__dirname + '/../client'));

// For accessing the Web Worker related files
app.get('/webworker', (req, res) => {
  res.sendFile(path.resolve(__dirname + '/../client/src/utils/webWorker.js'));
});
app.get('/ANNworker', (req, res) => {
  res.sendFile(path.resolve(__dirname + '/../client/src/utils/ANNworker.js'));
});
app.get('/synaptic', (req, res) => {
  res.sendFile(path.resolve(__dirname + '/../client/src/utils/synaptic.js'));
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
  const jobCallback = (newJob) => {
    if (newJob.projectType === 'ANN') {
      console.log('Sending ANN job');
      socket.emit('newANNJob', newJob);        
    } else {
      socket.emit('newJob', newJob);
    }
  }

  socket.emit('updateAllProjects', pc.getUpdateAllProjects());
  socket.emit('updatePendingProjects', pc.getPendingProjects());

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
    console.log('User ready for project:', readyMessage.projectId);
    pc.userReady(readyMessage, jobCallback);

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
    pc.userJobDone(completedJob, jobCallback);
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
    if (pc.pendProject(project)) {
      io.emit('updatePendingProjects', pc.getPendingProjects());
    } else {
      console.log('Error pending project');
    }
  });

  socket.on('pendToCreateProject', (pendingDecision) => {
    if (pendingDecision.decision) {
      if (pc.createProject(pendingDecision.project)) {
        io.emit('updateAllProjects', pc.getUpdateAllProjects());
      }
    }
    if (pc.removePendingProject(pendingDecision.projectId)) {
      io.emit('updatePendingProjects', pc.getPendingProjects());
    }
  });

  socket.on('getAllProjectsUpdate', () => {
    socket.emit('updateAllProjects', pc.getUpdateAllProjects());
  });

  // 'error' event handler
  socket.on('error', (error) => {
    console.log('Socket error:', error);
  });

  /*
    NEURAL NETWORK EVENT HANDLERS
  */
  socket.on('ANNUpdatedNetwork', (doneJob) => {
    console.log('Received Updated Network from', doneJob.workerId);
    const synchronizeANN = pc.updateANN(doneJob);
    const ANNJobCallback = (name, newJob) => {
      io.to(name).emit('newANNJob', newJob);
    }

    if (synchronizeANN) {
      setTimeout( () => {
        pc.restartANN(doneJob.projectId, ANNJobCallback);
      }, 4000);
    } 
  });
});

// PRELOADED PROJECTS FOR DEMO PURPOSES
const irisOptions = require('./projects/iris.js');
const mnistOptions = require('./projects/mnist.js');
pc.createProject(irisOptions);
pc.createProject(mnistOptions);
