const Job = require('./Job.js');
const Worker = require('./Worker.js');
const _ = require('lodash');

// Project object takes options as input, which contains the information 
// necessary to instantiate a new Project.
// Options must be in the following format:
// options = {
//    dataSet: ARRAY, // Data to be operated on. 
//    generateDataSet: FUNCTION, (Optional input. Will use dataSet if both
//    dataSet and generateDataSet are provided)
//    mapData: FUNCTION,  // Function to run on every data item. 
//    reduceResults: FUNCTION  // Function to run on completed results array
// }
class Project {

  constructor(options, projectId, io) {
    // Project ID is created by the ProjectController and passed to Project
    this.projectId = projectId;  
    
    // Used for timer events
    this.projectBeginTime = null;

    this.projectEndTime = null;

    // availableJobs takes in a dataSet array and converts all items to Jobs
    // dataSet may be inputted as a property of options or generated by 
    // a user-provided function
    this.availableJobs = (() => {
      let dataSet = options.dataSet || options.generateDataSet();

      return dataSet.map( (item, index) => {
        return new Job(item, index, this.projectId);
      });
    })();

    // jobsLength stores the number of jobs that were available when the 
    // was first initialized. This is used to determine when the project
    // as completed.
    this.jobsLength = this.availableJobs.length;  
    
    // Creates completedJobs array which stores the RESULTS of completed jobs
    // Each job's result is placed at that job's original availableJobs index
    this.completedJobs = []; 
  
    // Creates workers object to track all workers for this project
    // Workers object takes workerId as key and stores the Worker object
    // as property. NOTE: a Worker's workerID is equal to the socket ID of 
    // the user that asked for the Worker to be created.
    this.workers = {};

    // reduceResults will be run at the completion of the project.
    // finalResult, which stores the result of the reduceResult, will be 
    // sent to all clients that are currently working on the project.
    this.reduceResults = options.reduceResults;

    this.finalResult = null;

    // mapData function is run by the client on the data field of each Job
    // that the client receives. The result is saved to job.result and the
    // entire job object is sent back to the server
    // TODO: implement ability tos end this function to client as a string
    this.mapData = options.mapData;

    this.io = io;
  }

  assignJob(worker) {
    console.log('Assigning job to ', worker.workerId);
    // Assigns a new job to the passed-in Worker
    // Will assign the first job from availableJobs array

    if (worker.currentJob === null && this.availableJobs.length) {
      worker.currentJob = this.availableJobs.shift();
      worker.currentJob.mapData = this.mapData.toString(); // Send stringified mapData function
      worker.currentJob.workerId = worker.workerId;

      // Send the newly assigned job to this worker
      // NOTE: do NOT use 'this' inside the emit function. Doing so will
      // cause a maximum stack call exceeded error. 
      worker.socket.emit('newJob', worker.currentJob);

      // If this is the first job, begin the beginTime timer 
      if (this.projectBeginTime === null) {
        this.projectBeginTime = new Date();
      }

    } else {
      console.log('Error assigning job to worker');
    }
  }

  reassignJob(socketId) {
    console.log('Reassigning job of ', socketId);
    // Reassigns the job that was previously assigned to a disconnected user
    // Locates the worker based on its socketId and find the assigned job.
    // Then the method puts job into the front of the availableJobs array
    if (this.workers[socketId]) {
      this.workers[socketId].currentJob.workerId = null;
      this.availableJobs.unshift( this.workers[socketId].currentJob );
      this.workers[socketId].currentJob = null;
    } else {
      console.log('Error reassigning job: no worker found with that ID');
    }
  }

/*
==================================
USER-INTERFACE-AFFECTING FUNCTIONS
==================================
*/
  createWorker(projectId, socket) {
    console.log('Creating a new worker in ' + projectId + ' for: ', socket.id);
    // Creates a new Worker and uses it in this project
    if (this.projectId === projectId && typeof socket === 'object') {
      var newWorker = new Worker(projectId, socket);
      
      // Assigns the worker a job by invoking the project's assingJob method
      this.assignJob(newWorker);

      // Places the worker into the workers object, using the worker's
      // socket ID as the key
      this.workers[newWorker.workerId] = newWorker;

      // Iterate over all workers in the workers object, and emit to them the workers array
      // NOTE: do NOT use 'this' inside the emit function. Doing so will
      // cause a maximum stack call exceeded error, for some reason.
      // Unfortunately, this requires us to generate a workersList array
      // to pass into the socket message. Hacky. Need to refactor.
      // TODO: refactor to use socket rooms to broadcast messages?

      var workersList = [];
      for (var key in this.workers) {
        workersList.push(this.workers[key].workerId);
      }
      for (var key in this.workers) {
        this.workers[key].socket.emit('updateWorkers', workersList);
      }

      // Send the user of this worker the latest results
      var completed = this.completedJobs.map( (job) => {
        return job;
      });
      newWorker.socket.emit('updateResults', completed);

    } else {
      console.log('Error creating worker: invalid input type');
    }
  }

  removeWorker(socketId) {
    console.log('Removing worker for ', socketId);
    // Removes the worker associated with the passed in socketId
    // First reassign the disconnected worker's job
    this.reassignJob(socketId);

    // Then delete the worker from the worker object
    delete this.workers[socketId];
    
    // Iterate over all workers in the workers object, and emit to them the workers array
    // NOTE: do NOT use 'this' inside the emit function. Doing so will
    // cause a maximum stack call exceeded error, for some reason.
    // Unfortunately, this requires us to generate a workersList array
    // to pass into the socket message. Hacky. Need to refactor.
    // TODO: refactor to use socket rooms to broadcast messages?
    var workersList = [];
    for (var key in this.workers) {
      workersList.push(this.workers[key].workerId);
    }
    for (var key in this.workers) {
      this.workers[key].socket.emit('updateWorkers', workersList);
    }
  }

  handleResult(job) {
    console.log('Result received for job id: ', job.jobId);
    // Places job's result into completedJobs array based on the job's original index location in availableJobs
    this.completedJobs[job.jobId] = job.result;

    // Set worker's current job to null 
    this.workers[job.workerId].currentJob = null;

    // Iterate over all workers in the workers object, and emit to them the updated results array
    // NOTE: do NOT use 'this' inside the emit function. Doing so will
    // cause a maximum stack call exceeded error, for some reason.
    // Unfortunately, this requires us to generate a workersList array
    // to pass into the socket message. Hacky. Need to refactor.
    // TODO: refactor to use socket rooms to broadcast messages?
    var workersList = [];
    for (var key in this.workers) {
      workersList.push(this.workers[key].workerId);
    }
    var completed = this.completedJobs.map( (job) => {
      return job;
    });
    for (var key in this.workers) {
      this.workers[key].socket.emit('updateResults', completed);
    }

    // Completes the project if all jobs have been completed
    if (this.jobsLength === this.completedJobs.length) {
      this.completeProject();
    } else {
      this.assignJob(this.workers[ job.workerId ]);
    }
  }

  completeProject() {
    console.log('Project ' + this.projectId + ' has completed');
    // Completes the project
    // Calls reduceResults on the array of results and stores the result
    // in finalResult
    this.finalResult = this.reduceResults(this.completedJobs);

    // Log the time when the project finished
    this.projectEndTime = new Date();
    console.log(`Project completed after ${this.projectEndTime - this.projectBeginTime} miliseconds`);

    // Broadcast to clients that the project has been completed
    // NOTE: do NOT use 'this' inside the emit function. Doing so will
    // cause a maximum stack call exceeded error, for some reason.
    // Unfortunately, this requires us to generate a workersList array
    // to pass into the socket message. Hacky. Need to refactor.
    // TODO: refactor to use socket rooms to broadcast messages?
    var workersList = [];
    for (var key in this.workers) {
      workersList.push(this.workers[key].workerId);
    }
    var final = _.cloneDeep(this.finalResult);

    for (var key in this.workers) {
      this.workers[key].socket.emit('finalResult', final);
    }
  }
}

// export Project class
module.exports = Project;
