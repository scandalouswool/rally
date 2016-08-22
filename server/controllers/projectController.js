const Project = require('../constructors/Project.js');

// ProjectController is responsible for creating and terminating
// projects. It also routes incoming socket messages to the appropriate
// Project object.

class ProjectController {

  constructor(db, io) {
    // Stores all Project objects in existence. It has the following form:
    // { projectId1: Project1,
    //   projectId2: Project2 }
    this.allProjects = {};

    this.pendingProjects = {};

    // Time between database backups
    this.backUpTime = 10000;

    /***************************************************
    // Query database for projects, intialize a Project
    // for each entry, and populate this.allProjects obj
    ***************************************************/
    db.Project.findAll({}).then((projects) => {
      projects.forEach((project) => {
        let data = project.dataValues;
        let options = {
          projectType: data.projectType,
          title: data.title,
          complete: data.complete,
          projectTime: data.projectTime,
          dataSet: data.dataSet,
          generateDataSet: data.generateDataSet,
          completedJobs: JSON.parse(data.completedJobs),
          mapData: data.mapData,
          reduceResults: data.reduceResults,
          finalResult: JSON.parse(data.finalResult)
        };
        this.allProjects[data.projectId] = new Project(options, data.projectId, io);
      });

      /***************************************************
      // Iterate over projects in this.allProjects object
      // and save to the database once per minute
      ***************************************************/
      setInterval((() => {
        return () => {
          // First clear out the database
          db.Project.destroy({
            where: {}
          // Then resave all projects
          }).then(() => {
            for (var obj in this.allProjects) {
              let project = this.allProjects[obj];
              db.Project.create({
                projectId: project.projectId,
                projectType: project.projectType,
                title: project.title,
                complete: project.complete,
                projectTime: project.projectTime,
                dataSet: project.dataSet,
                generateDataSet: project.generateDataSet,
                completedJobs: JSON.stringify(project.completedJobs),
                mapData: project.mapData,
                reduceResults: project.reduceResults,
                finalResult: JSON.stringify(project.finalResult)
              });
            }
          });
        };
      })(), this.backUpTime);
    });

    // Keeps a record of all Worker instances in existence.
    // Socket id is used to log workers because the Worker object
    // uses socket id as the worker id. The ledger stores the project id
    // rather than a reference to the Worker object itself.

    // It has the following form:
    // { socketId1: projectId,
    //   socketId2: projectId }
    this.allWorkers = {};

    this.io = io;
  }

  /*
  ======================
  SOCKETROUTES.JS EVENTS
  ======================
  */

  userDisconnect(socketId) {
    // Identifies the project that the disconnected user was contributing to
    // and calls the removeWorker method for that project
    console.log(this.allWorkers);
    if (this.allWorkers[socketId] !== undefined) {
      console.log('Removing user from global workers list:', socketId);

      this.allProjects[this.allWorkers[socketId]].removeWorker(socketId);
      delete this.allWorkers[socketId];

      return socketId;

    } else {
      // User not found
      console.log('Project controller could not find that user', socketId);
      return false;
    }
  }

  userReady(readyMessage, callback) {
    // Passes the new user's socket connection to the appropriate Project,
    // which will then create a new Worker for that user and assign it
    // an available job
    const project = this.allProjects[readyMessage.projectId];

    if (project) {
      // Creates a new Worker in the appropriate Project
      const newWorker = project.createWorker(readyMessage);
      
      // Create a record of the new Worker in the allWorkers ledger
      this.allWorkers[newWorker.workerId] = project.projectId;

      // Assign the new worker as many jobs as the worker can handle
      for (var i = 0; i < newWorker.maxJobs; i++) {
        const newJob = project.assignJob(newWorker)
        if (newJob) {
          callback(newJob);
        }
      } 

    } else {
      console.log('Error in userReady: Project does not exist');
    }
  }

  userJobDone(job, callback) {
    // The Job object will be returned from the client with the .result
    // field populated.
    let projectComplete = false;
    const project = this.allProjects[job.projectId]; 
    const worker = project.workers[job.workerId];

    if (project && worker) {
      // // Check first whether project and worker associated with job exists
      // // then pass the job object to the appropriate project object
      // console.log('User ' + job.workerId + ' completed a job: ' + job);
      // projectComplete = this.allProjects[job.projectId].handleResult(job);

      // Refactor above into discrete tasks
      // 1. Resolve job result
      // 2. If project is over, trigger completeProject
      // 3. If projecti s not over, assign jobs
      projectComplete = project.handleResult(job);
    
      if (projectComplete) {
        project.completeProject();
        this.completeProject();
      
      } else {
        // Assign jobs to the worker
        const newJob = project.assignJob(worker);
        if (newJob) {
          callback(newJob);
        }
      }

    } else {
      if (!project) {
        console.log('Error in userJobDone: project does not exist');
      }
      if (!worker) {
        console.log('Error in userJobDone: worker does not exist');
      }

    }
  }

  createProject(options) {
    // Check if it was a pending project; if so, remove from the list of pending projects

    // Create a new instance of Project with the pass-in options parameters
    // Assign a project ID to the new Project and create a new Project

    const projectId = 'project' + Object.keys(this.allProjects).length;
    const newProject = new Project(options, projectId);

    // Store the newly created project in the allProjects object
    this.allProjects[projectId] = newProject;
    this.sendUpdateAllProjects(io);

    return projectId;
  }

  pendProject(options, io) {
    // Add to list of pending projects
    const id = Object.keys(this.pendingProjects).length;
    this.pendingProjects[id] = options;

    // Emit updated pending project list to all users
    this.sendUpdatePendingProjects(io);
  }

  removePendingProject(projectId, io) {
    delete this.pendingProjects[projectId];
    this.sendUpdatePendingProjects(io);
  }

  // Returns status of projects to all connected users
  getUpdateAllProjects() {
    let allProjectsUpdate = [];

    // Initialize project update information
    for (var key in this.allProjects) {
      const project = this.allProjects[key];

      const completedJobs = [];
      project.completedJobs.map( (item) => {
        completedJobs.push(item);
      });

      // WorkersList: [ Worker1, Worker2 ]
      const workersList = [];

      for (var k in project.workers) {
        workersList.push({
          workerId: project.workers[k].workerId,
          projectId: project.workers[k].projectId,
          jobId: project.workers[k].currentJob === null ? null : project.workers[k].currentJob.jobId
        });
      }

      const finalResult = [];
      finalResult.push(project.finalResult);

      allProjectsUpdate.push({
        projectId: project.projectId,
        projectType: project.projectType,
        title: project.title,
        availableJobsNum: project.availableJobs.length,
        jobsLength: project.jobsLength,
        completedJobs: completedJobs,
        workers: workersList,
        finalResult: project.finalResult,
        complete: project.complete,
        projectTime: project.projectTime
      });
    }

    return allProjectsUpdate;
  }

  //TODO: completeProject method
  completeProject() {
    console.log('Project done');
  }
}

module.exports = ProjectController;
