const express = require('express');
const app = express();
const server = require('http').Server(app);
const io = require('socket.io')(server);
const timers = require('node-timers');
const projectController = require('./controllers/projectController.js');
const pc = new projectController();
app.use(express.static(__dirname + '/../client'));

server.listen(process.env.PORT || 8000, () => {
  console.log('Now listening on port', server.address().port);
});

/*
===============
EVENT LISTENERS
===============
*/

io.on('connect', (socket) => {
  //on userConnect
  //save socketId for this user
  const socketId = socket.id;

  //on disconnect
  //pass the socketId for this user to projectController.js
  socket.on('disconnect', () => {
    pc.userDisconnect(socket.id);
  });
  
  //on userReady
  //pass the socket to projectController.js
  //pass the projectId to projectController.js
  socket.on('userReady', (projectId) => {
    pc.userReady(projectId, socket);
  });

  //on userJobDone
  //pass completed job to projectController.js
  socket.on('userJobDone', (completedJob) => {
    pc.userJobDone(completedJob);
  });

  //on createProject
  //pass script to projectController.js
  //NOTES:
  //the idea is that the user inputs relevant information on the client-side
  //this information will then emit 'createProject'
  //createProject will receive this information and pass it to projectController.js
  socket.on('createProject', (project) => {
    pc.createProject(project);
  });
});

// Testers
const testOptions = {
  dataSet: [1, 2, 3],
  generateDataSet: () => {
    var dataSet = [];
    for (var i = 0; i < 5; i++) {
      dataSet.push( [i * 100000, i * 100000 + 99999]);
    }
    return dataSet;
  },  
  mapData: (min, max) => {
    const primeTester = (num) => {
      for (var i = 2; i < num - 1; i++) {
        if (num % i === 0) {
          return false;
        }
      }
      return true;
    };

    for (var i = min; i <= max; i++) {
      if (primeTester(i)) {
        result.push(i);
      }
    }
    console.log(result.length);
    return result;
  },
  reduceResult: (results) => {
    console.log(results);
  }
}

pc.createProject(testOptions);