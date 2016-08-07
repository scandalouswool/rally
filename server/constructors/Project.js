const Job = require('./Job.js');
const Worker = require('./Worker.js');
const _ = require('lodash');

// Project object takes an options object as input, which must be in 
// the following format:
// options = {
//    dataSet: ARRAY, // Data to be operated on. 
//    generateDataSet: FUNCTION, (Optional input. Will use dataSet if both
//    dataSet and generateDataSet are provided)
//    mapData: FUNCTION,  // Function to run on every data item. 
//    reduceResults: FUNCTION  // Function to run on completed results array
// }
class Project {

  constructor(options, projectId, io) {
    //create projectId
      //ex: this.projectId = projectId;
    this.projectId = projectId;  // To be initialized by the projectController

    //create availableJobs array
    this.availableJobs = (() => {
      let dataSet = options.dataSet || options.generateDataSet();

      return dataSet.map( (item, index) => {
        return new Job(item, index, this.projectId);
      });
    })();

    //create a variable to keep track of the length of the available jobs
    //so we can know when the project is complete
    this.jobsLength = this.availableJobs.length;  
    
    //create completedJobs array
      //stores the RESULTS of completed jobs
      //note: the results will be placed at their original availableJobs index
    this.completedJobs = []; 
  
    //create workers object to track all workers for this project
    this.workers = {};

    //initialize reduceResults function
      //This function must be provided in the options object
    this.reduceResults = options.reduceResults;

    this.finalResult = null;

    //mapData function, function that will be sent to client to be run on every dataset
      //This function must be provided in the options object
    this.mapData = options.mapData;

    this.io = io;
  }

  assignJob(worker) {
  //assignJob function, takes worker as an argument
    //gives the worker the first job from availabeJobs as a property
      //we set its currentJob property

    if (worker.currentJob === null && this.availableJobs.length) {
      worker.currentJob = this.availableJobs.shift();
      console.log('This worker: ', worker.workerId, "has this job: ", worker.currentJob);

      worker.currentJob.workerId = worker.workerId;

      // Send the newly assigned job to this worker
      // NOTE: do NOT use this inside the emit function. Doing so will
      // cause a maximum stack call exceeded error, for some reason
      worker.socket.emit('newJob', worker.currentJob);
    } else {
      console.log('Error assigning job to worker');
    }
  }

  reassignJob(socketId) {
  //reassignJob function, takes socketId as an argument
    //locate the worker based on its socketId and find the assigned job 
    //unshift the job back into availableJobs array
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
  //createWorker function
    //ex start:
      //createWorker: function (projectId, socket) {
      //   var worker = new Worker(projectId, socket);
      //}
    if (typeof projectId === 'number' && typeof socket === 'object') {
      var newWorker = new Worker(projectId, socket);
      //assign the worker a job (invoke assignJob on worker)

      this.assignJob(newWorker);
      //place the worker into the workers object (its key value is the socketId)

      this.workers[newWorker.workerId] = newWorker;

      //for-in loop over all workers in the workers object, and emit to them the workers array
      // NOTE: do NOT use this inside the emit function. Doing so will
      // cause a maximum stack call exceeded error, for some reason
      // TODO: refactor using socket rooms if possible, otherwise add
      // broadcast method to project function
      var workersList = [];
      for (var key in this.workers) {
        workersList.push(this.workers[key].workerId);
      }

      workersList.forEach( (workerId) => {
        this.io.to(workerId).emit('updateWorkers', workersList);
      });
   
    } else {
      console.log('Error creating worker: invalid input type');
    }
  }

  removeWorker(socketId) {
  //removeWorker function, takes socketId as an argument
    //call reassignJob function on socketId
    this.reassignJob(socketId);

    //delete worker from the worker object
    delete this.workers[socketId];
    
    //for-in loop over all workers in the workers object, and emit to them the workers array
    // NOTE: do NOT use this inside the emit function. Doing so will
    // cause a maximum stack call exceeded error, for some reason
    // TODO: refactor using socket rooms if possible, otherwise add
    // broadcast method to project function
    var workersList = [];
    for (var key in this.workers) {
      workersList.push(this.workers[key].workerId);
    }

    workersList.forEach( (workerId) => {
      this.io.to(workerId).emit('updateWorkers', workersList);
    });
  }

  handleResult(job) {
  //handleResult function, takes a job object as an argument
    //if jobsLength === completedJobs.length
      //run completeProject
    // else: 
      // Assign worker new job

    //place job[results] into completedJobs array based on its original index
    this.completedJobs[ job.jobId ] = job.result;

    // Set worker's current job to null 
    this.workers[ job.workerId ].currentJob = null;

    //for-in loop over all workers in the workers object, and emit to them the new completedJobs array
    // NOTE: do NOT use this inside the emit function. Doing so will
    // cause a maximum stack call exceeded error, for some reason
    // TODO: refactor using socket rooms if possible, otherwise add
    // broadcast method to project function
    var workersList = [];
    for (var key in this.workers) {
      workersList.push(this.workers[key].workerId);
    }
    var completed = this.completedJobs.map( (job) => {
      return job;
    });

    workersList.forEach( (workerId) => {
      this.io.to(workerId).emit('updateResults', completed);
    });

    if (this.jobsLength === this.completedJobs.length) {
      this.completeProject();
    } else {
      this.assignJob(this.workers[ job.workerId ]);
    }
  }

  completeProject() {
  //completeProject function
    //invoke this.reduceResults on the completedJobs array
    this.finalResult = this.reduceResults(this.completedJobs);

    //for-in loop over all workers in the workers object, and emit to them the final result and that the job is done
    var workersList = [];
    for (var key in this.workers) {
      workersList.push(this.workers[key].workerId);
    }
    var final = _.cloneDeep(this.finalResult);

    workersList.forEach( (workerId) => {
      this.io.to(workerId).emit('finalResult', final);
    });
  }
}

// export Project class
module.exports = Project;
