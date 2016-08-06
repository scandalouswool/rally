//require Project constructor
const Project = require('../constructors/Project.js');

//create an object to hold all of the created "projects" from the Project constructor
//key/value pair of projectId and the respective project 
const allProjects = {};

//object to hold all worker information across all projects
//key/value pair of socketId and projectId
const allWorkers = {};

/*
======================
SOCKETROUTES.JS EVENTS
======================
*/

const userDisconnect = (socketId) => {
  //look into allProjects object, find a specific project (based on its Id which is allWorkers.socketId)
  //then remove that worker based on its socketId
  allProjects[allWorkers[socketId]].removeWorker(socketId);
  delete allWorkers[socketId];
}
  
const userReady = (projectId, socket) => {
  if (allProjects[projectId]) {
    //create the new user/worker
    allProjects[projectId].createWorker(projectId, socket);
    //log the newly created worker into the allWorkers object
    allWorkers[socket.id] = projectId;
  } else {
    console.log('Error in userReady: Project does not exist');
  }
}

const userJobDone = (job) => {
  if (allProjects[job.projectId]) {
    //if the project exists, handleResult the job
    allProjects[job.projectId].handleResult(job);
  } else {
    console.log('Error in userJobDone: project does not exist');
  }
}

const createProject = (options) => {
  //this is the length of the allProjects object
  const projectId = Object.keys(allProjects).length;
  //create the project
  const newProject = new Project(options, projectId);
  //store the newly created project in the allProjects object
  allProjects[projectId] = newProject;
}

//function completeProject
  //to be revisited