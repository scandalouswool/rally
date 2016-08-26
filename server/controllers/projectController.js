const Project = require('../constructors/Project.js');
const ANNProject = require('../constructors/ANNProject.js');
const Synaptic = require('synaptic');

const Architect = Synaptic.Architect;
const Layer = Synaptic.Layer;
const Network = Synaptic.Network;
const Trainer = Synaptic.Trainer;

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
    this.pendingProjects['0'] = {
      projectId: '0',
      title: 'My Project',
      dataSet: '[0, 1, 2, 3]',
      generateDataSet: '',
      mapData: '(val) => {return val;}',
      reduceResults: '(results) => {return results;}'
    };

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
          finalResult: JSON.parse(data.finalResult),
          inputLayer: data.inputLayer ? data.inputLayer : 0,
          hiddenLayer: data.hiddenLayer ? JSON.parse(data.hiddenLayer) : '',
          outputLayer: data.outputLayer ? data.outputLayer : 0,
          trainerOptions: data.trainerOptions ? JSON.parse(data.trainerOptions) : ''
        };

        if (data.projectType === 'ANN') {
          this.allProjects[data.projectId] = new ANNProject(options, data.projectId, io);
        } else {
          this.allProjects[data.projectId] = new Project(options, data.projectId, io);
        }
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
                finalResult: JSON.stringify(project.finalResult),
                inputLayer: project.inputLayer ? project.inputLayer : 0,
                hiddenLayer: project.hiddenLayer ? JSON.stringify(project.hiddenLayer) : '',
                outputLayer: project.outputLayer ? project.outputLayer : 0,
                trainerOptions: project.trainerOptions ? JSON.stringify(project.trainerOptions) : ''
              });
            }
          });
        };
      })(), this.backUpTime);
    });

    /***************************************************
    // Query database for pending projects and populate
    // the this.pendingProjects object
    ***************************************************/
    db.PendingProject.findAll({}).then((pendingProjects) => {
      pendingProjects.forEach((pending) => {
        let data = pending.dataValues;
        let options = {
          projectId: data.projectId,
          title: data.title,
          dataSet: data.dataSet,
          generateDataSet: data.generateDataSet,
          mapData: data.mapData,
          reduceResults: data.reduceResults
        };
        this.pendingProjects[data.projectId] = options;
      });

      // **************************************************
      // // Iterate over projects in this.allProjects object
      // // and save to the database once per minute
      // **************************************************
      setInterval((() => {
        return () => {
          // First clear out the database
          db.PendingProject.destroy({
            where: {}
          // Then resave all projects
          }).then(() => {
            for (var obj in this.pendingProjects) {
              let pending = this.pendingProjects[obj];
              db.PendingProject.create({
                projectId: pending.projectId,
                title: pending.title,
                dataSet: pending.dataSet,
                generateDataSet: pending.generateDataSet,
                mapData: pending.mapData,
                reduceResults: pending.reduceResults
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
    console.log('USER READY FOR:', project.projectType);
    if (project) {
      // Creates a new Worker in the appropriate Project
      const newWorker = project.createWorker(readyMessage);
      
      // Create a record of the new Worker in the allWorkers ledger
      this.allWorkers[newWorker.workerId] = project.projectId;

      // Assign the new worker as many jobs as the worker can handle
      console.log('Assigning max jobs:', newWorker.maxJobs);
      for (var i = 0; i < newWorker.maxJobs; i++) {
        const newJob = project.assignJob(newWorker)
        console.log('New job for worker:', newJob);
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

  /*
    NEURAL NETWORK HANDLERS
  */
  updateANN(doneJob) {
    // console.log('Received finished ANN job:', doneJob);
    console.log('Updating partial networks');
    const partialNetwork = doneJob.result.trainedNetwork;
    // console.log('Result is: ', partialNetwork);
    const project = this.allProjects[doneJob.projectId];
    let networksSynchronized = false;
    // console.log('Updated network info:', updatedNetwork);
    // const partialNetwork = Network.fromJSON(updatedNetwork.trainedNetwork);
    // console.log('Inside new network:', trainedNetwork);
    // console.log(trainedNetwork.layers.input.list);
    // const error = project.testNetwork(trainedNetwork);
    // let trainingComplete;

    project.partialNetworks.push(partialNetwork);

    project.workers[doneJob.workerId].isBusy = false;
    // console.log(project.workers[doneJob.workerId]);
    // Check if all workers are busy
    let readyToSync = true;
    for (let worker in project.workers) {
      // console.log(project.workers);
      if (project.workers[worker].isBusy === true) {
        console.log('There are still busy workers in this project');
        readyToSync = false;
      }
    }

    if (!readyToSync) {
      console.log('Not ready to sync');
      return networksSynchronized;
    } 

    if (readyToSync) {
      const trainedNetwork = this.syncNetworks(project.partialNetworks);
      const result = project.testNetwork(trainedNetwork);

      // evaluate the error rate and continue is necessary
      // otherwise complete project

      if (result.error < project.trainerOptions.error) {
        console.log('Desired error rate reached. Training complete.');
        console.log('Final error rate:', result.error);
        this.completeProject(result);

      } else {
        console.log('Error rate too high - continuing training:', result.error);
        project.updateNetwork(trainedNetwork);
        project.partialNetworks = [];
        networksSynchronized = true;
        return networksSynchronized;
      }    
    }
  }

  syncNetworks(partialNetworks) {
    console.log(`Synchronizing ${partialNetworks.length} networks`);
    for (var i = 1; i < partialNetworks.length; i++) {
      for (var j = 0; j < partialNetworks[0].connections.length; j++) {
        partialNetworks[0].connections[j].weight =
         partialNetworks[0].connections[j].weight + 
         partialNetworks[i].connections[j].weight;
      }
    }

    console.log('Reconciled the weights of partial networks');
    return partialNetworks[0];
  }

  restartANN(projectId, ANNJobCallback) {
    console.log('Resetting ANN project');
    const project = this.allProjects[projectId];
    project.resetTrainingSet();
    project.completedJobs = [];

    console.log('Reinitialized jobs:', project.availableJobs.length);
    // console.log('Available workers:', project.workers);

    for (var key in project.workers) {

      const worker = project.workers[key];
      worker.currentJob = [];

      for (var i = 0; i < worker.maxJobs; i++) {
        project.workers[key].currentJob = [];
        // console.log('Assigning to:', project.workers);
        // console.log(project.workers[key]);
        console.log('sending job to:', key);
        ANNJobCallback(key, project.assignJob(project.workers[key]) );
      }
    }
  }

  /*
    PROJECT MANAGEMENT METHODS
  */

  createProject(options) {
    // Create a new instance of Project with the pass-in options parameters
    // Assign a project ID to the new Project and create a new Project
    const projectId = 'project' + Object.keys(this.allProjects).length;
    let newProject;

    if (options.projectType === 'ANN') {
      newProject = new ANNProject(options, projectId);
    } else {
      newProject = new Project(options, projectId);
    }

    // Store the newly created project in the allProjects object
    this.allProjects[projectId] = newProject;
    // console.log(newProject);
    return projectId;
  }

  pendProject(options) {
    // Add to list of pending projects
    const id = Object.keys(this.pendingProjects).length;
    this.pendingProjects[id] = options;
    return true;
  }

  removePendingProject(projectId) {
    delete this.pendingProjects[projectId];
    return true;
  }

  getPendingProjects() {
    console.log('Pending projects:', this.pendingProjects);
    return this.pendingProjects;
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
  completeProject(finalResult) {
    console.log('Project done. Final result:', finalResult);
  }
}

module.exports = ProjectController;
