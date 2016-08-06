const Job = require('./Job.js');
const Worker = require('./Worker.js');

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

  constructor(options) {
    //create projectId
      //ex: this.projectId = projectId;
    this.projectId = null;  // To be initialized by the projectController

    //create availableJobs array
    this.availableJobs = options.dataSet || options.generateDataSet(); 
    
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

    //mapData function, function that will be sent to client to be run on every dataset
      //This function must be provided in the options object
    this.mapData = options.mapData;
  }

  assignJob(worker) {
  //assignJob function, takes worker as an argument
    //gives the worker the first job from availabeJobs as a property
      //we set its currentJob property

    if (worker.currentJob === null && this.availableJobs.length) {
      worker.currentJob = this.availableJobs.shift();
      console.log('This worker: ', worker.workerId, "has this job: ", worker.currentJob);
      // Send the newly assigned job to this worker
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
      for (var key in this.workers) {
        this.workers[key].socket.emit('updateWorkers', this.workers);
      }      
    } else {
      console.log('Error creating worker: invalid input type');
    }

  }

  removeWorker() {
  //removeWorker function, takes socketId as an argument
    //call reassignJob function on socketId
    //delete worker from the worker object
    //for-in loop over all workers in the workers object, and emit to them the workers array
  }

  handleResult() {
  //handleResult function, takes a job object as an argument
  //(note: the worker that the job belongs too will emit)
    //place job[results] into completedJobs array based on its original index
    //for-in loop over all workers in the workers object, and emit to them the new completedJobs array
    // Set worker's current job to null 
    //if jobsLength === completedJobs.length
      //run completeProject
    // else: 
      // Assign worker new job
  }

  completeProject() {
  //completeProject function
    //invoke this.reduceResults on the completedJobs array
    //for-in loop over all workers in the workers object, and emit to them the final result and that the job is done
  }
}

// export Project class
module.exports = Project;