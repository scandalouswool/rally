//require Project constructor
const Project = require('../constructors/Project.js');

class ProjectController {

  constructor() {
    //create an object to hold all of the created "projects" from the Project constructor
    //key/value pair of projectId and the respective project 
    this.allProjects = {};

    //object to hold all worker information across all projects
    //key/value pair of socketId and projectId
    this.allWorkers = {};
  }

  /*
  ======================
  SOCKETROUTES.JS EVENTS
  ======================
  */

  userDisconnect(socketId) {
    //look into allProjects object, find a specific project (based on its Id which is allWorkers.socketId)
    //then remove that worker based on its socketId
    this.allProjects[this.allWorkers[socketId]].removeWorker(socketId);
    delete this.allWorkers[socketId];
  }
    
  userReady(projectId, socket) {
    if (this.allProjects[projectId]) {
      //create the new user/worker
      this.allProjects[projectId].createWorker(projectId, socket);
      //log the newly created worker into the allWorkers object
      this.allWorkers[socket.id] = projectId;
    } else {
      console.log('Error in userReady: Project does not exist');
    }
  }

  userJobDone(job) {
    if (this.allProjects[job.projectId]) {
      //if the project exists, handleResult the job
      this.allProjects[job.projectId].handleResult(job);
    } else {
      console.log('Error in userJobDone: project does not exist');
    }
  }

  createProject(options, io) {
    //this is the length of the allProjects object
    const projectId = Object.keys(this.allProjects).length;
    //create the project
    const newProject = new Project(options, projectId, io);
    //store the newly created project in the allProjects object
    this.allProjects[projectId] = newProject;
  }
  //TODO: completeProject method
}

module.exports = ProjectController;