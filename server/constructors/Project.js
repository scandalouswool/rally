const Job = require('./Job.js');
const Worker = require('./Worker.js');
const timers = require('node-timers');
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

  constructor(options, projectId) {
    // Project ID is created by the ProjectController and passed to Project
    this.projectId = projectId;
    this.projectType = options.projectType || null; // Used for custom visualizations
    this.title = options.title;

    // Whether or not project is complete; all jobs have been run
    this.complete = options.complete || false;

    // Timer used to track how long it takes to complete project
    this.timer = timers.simple();
    this.projectTime = options.projectTime || 0; //might need to be this.projectTime

    // Convert dataSet and generateDataSet to string in case they're not already
    this.dataSet = (typeof options.dataSet === 'string') ?
      options.dataSet : JSON.stringify(options.dataSet);
    if (options.generateDataSet === null) {
      this.generateDataSet = '';
    } else {
      this.generateDataSet = (typeof options.generateDataSet === 'string') ?
        options.generateDataSet : options.generateDataSet.toString();
    }

    // availableJobs takes in a dataSet array and converts all items to Jobs
    this.availableJobs = (() => {
      let dataSet;

      if (this.dataSet !== 'null') {
        console.log('Parsing dataSet');
        dataSet = JSON.parse(this.dataSet);
      } else {
        console.log('Evaluating code');
        dataSet = eval(this.generateDataSet)();
      }

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
    this.completedJobs = options.completedJobs || [];

    // Creates workers object to track all workers for this project
    // Workers object takes workerId as key and stores the Worker object
    // as property. NOTE: a Worker's workerID is equal to the socket ID of
    // the user that asked for the Worker to be created.
    this.workers = {};

    // reduceResults will be run at the completion of the project.
    //this.reduceResults = (typeof options.reduceResults === 'function' ? options.reduceResults : eval( options.reduceResults ));

    // finalResult, which stores the result of the reduceResult, will be
    // sent to all clients that are currently working on the project.
    if (options.reduceResults === null) {
      this.reduceResults = '';
    } else {
      this.reduceResults = (typeof options.reduceResults === 'string') ?
        options.reduceResults : options.reduceResults.toString();
    }


    this.finalResult = options.finalResult || null;

    // mapData function is run by the client on the data field of each Job
    // that the client receives. The result is saved to job.result and the
    // entire job object is sent back to the server
    this.mapData = options.mapData ? options.mapData : '';

  }

  assignJob(worker) {
    // Assigns a new job to the passed-in Worker
    // Will assign the first job from availableJobs array

    if (worker.currentJob.length < worker.maxJobs && this.availableJobs.length) {
      console.log('Assigning job to ', worker.workerId);

      let newJob = this.availableJobs.shift();
      newJob.mapData = this.mapData ? this.mapData.toString() : null;
      newJob.workerId = worker.workerId;
      newJob.jobsLength = this.jobsLength;
      worker.currentJob.push(newJob);

      // Alternate timer
      if (this.timer.state() === 'clean' || this.timer.state() === 'stopped') {
        this.timer.start();
      }

      return newJob;

    } else {
      if (!this.availableJobs.length) {
        console.log('No more jobs available');

      } else {
        console.log('Error assigning job to worker');

      }
    }

    return;
  }

  reassignJob(socketId) {
    // Reassigns jobs that were previously assigned to a disconnected user
    // Locates the worker based on its socketId and find the assigned jobs.
    // Then the method puts jobs into the front of the availableJobs array
    if (this.workers[socketId] && this.workers[socketId].currentJob.length) {
      console.log('This worker has following number of jobs:', this.workers[socketId].currentJob.length);

      while (this.workers[socketId].currentJob.length) {
        let oldJob = this.workers[socketId].currentJob.pop();
        oldJob.workerId = null;
        this.availableJobs.unshift( oldJob );
        console.log('Reassigning job');
      }

      this.workers[socketId].currentJob = [];
    } else {
      console.log('Error reassigning job: no worker found with that ID');
    }
  }

/*
==================================
USER-INTERFACE-AFFECTING FUNCTIONS
==================================
*/
  createWorker(readyMessage) {
    const projectId = readyMessage.projectId;
    const socketId = readyMessage.socketId;

    console.log('Creating a new worker in ' + projectId);
    // Creates a new Worker and uses it in this project
    if (this.projectId === projectId) {
      var newWorker = new Worker(projectId, socketId);
      newWorker.maxJobs = readyMessage.maxWorkerJobs;
      console.log('Created new worker capable of max jobs:', newWorker.maxJobs);

      // Places the worker into the workers object, using the worker's
      // socket ID as the key
      this.workers[newWorker.workerId] = newWorker;

      return newWorker;

    } else {
      console.log('Error creating worker: invalid input type');
    }
  }

  removeWorker(socketId) {
    console.log(`Removing worker ${socketId} in project ${this.projectId}`);
    // Removes the worker associated with the passed in socketId
    // First reassign the disconnected worker's job
    this.reassignJob(socketId);

    // Then delete the worker from the worker object
    delete this.workers[socketId];
    if (_.isEmpty(this.workers)) {
      this.timer.stop();
    }
  }

  handleResult(job) {
    console.log('Result received for job id: ', job.jobId);

    // Check whether this is a valid job for this project
    if (this.workers[job.workerId]) {

      // Places job's result into completedJobs array based on the job's original index location in availableJobs
      this.completedJobs[job.jobId] = job.result;

      // Remove completed job from worker's currentJob list
      let idx = null;
      this.workers[job.workerId].currentJob.forEach( (currentJob, i) => {
        if (job.jobId === currentJob.jobId) {
          idx = i;
        }
      });

      if (idx !== null) {
        this.workers[job.workerId].currentJob = this.workers[job.workerId].currentJob.slice(0, idx).concat(this.workers[job.workerId].currentJob.slice(idx + 1));
        console.log('This worker has jobs left:', this.workers[job.workerId].currentJob.length);
      } else {
        console.log('Error: job not found');
      }

    } else {
      console.log('Error: worker not found for this job');
    }

    // Returns whether the project has concluded
    return this.jobsLength === this.completedJobs.length;
  }

  completeProject() {
    console.log('Project ' + this.projectId + ' has completed');
    // Completes the project
    // Calls reduceResults on the array of results and stores the result
    // in finalResult

    this.finalResult = eval(this.reduceResults)(this.completedJobs);
    console.log('The final results:', this.finalResult);
    // Log the time when the project finished
    console.log(`Project completed after ${this.projectTime} miliseconds`);
    this.complete = true;
    console.log(this.completedJobs.length + ' jobs completed!');
    return true;
  }
}

// export Project class
module.exports = Project;
