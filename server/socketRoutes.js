//require socket.io


/*
===============
EVENT LISTENERS
===============
*/

//on userConnect
  //save socketId for this user

//on userDisconnect
  //pass the socketId for this user to projectController.js

//on userReady
  //pass the socketId to projectController.js
  //pass the projectId to projectController.js

//on userJobDone
  //pass completed job to projectController.js

//on createProject
  //pass script to projectController.js
  //NOTES:
  //the idea is that the user inputs relevant information on the client-side
  //this information will then emit 'createProject'
  //createProject will receive this information and pass it to projectController.js

