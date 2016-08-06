//require Project constructor

//create an object to hold all of the created "projects" from the Project constructor
  //ex:
  // const projects = {
  //   0: /* (the nQueens object) */ ,
  //   1: /* etc. */
  // }

//create an object of workers created form the Worker constructor
  //ex:
  // const workers = {
  //   socketId: projectId,
  //   socketId: projectId
  // }

//handle all socketRoutes.js events
  //userDisconnect
    //look up the projectId, 
    //give it the socketId to handle the worker disconnect

  //userReady
    //look up the projectId, tell the project to create a new worker
      // NOTES:
      // 1. new user 'ready'
      //   user sends workerId and project id to socketRouter
      //   socketRouter takes this information and passes it down to the projectcontroller

      // 2. projectcontroller
      //   finds the relevent project

      // 3. inside the project object
      //   create a new worker with the workerId
      //   assign job to the worker
      //   communicate job to client

  //userJobDone
    //look up the projectId, give the job to the project

//function createProject, create a project based on Project.js,
//takes 'script' as an argument
  //pass script into Project.js to create a new project
  //place the project into the projects object

//function completeProject
  //to be revisited