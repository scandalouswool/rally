//require Job.js
//require Worker.js

//begin project constructor
//takes reduceResults function as argument, takes initial data (an array), projectId
  
  //create projectId
    //ex: this.projectId = projectId;

  //create availableJobs array
    //ex: const availableJobs = [1, 2, 3, 4, 5];

  //create completedJobs array
    //note: try to place jobs back in their original availableJobs index

  //create workers object to track all workers for this project

  //create reduceResults function
    //this.reduceResults = options.reduceResults;

  //initializeJobs function, argument is data (an array)
    //example start:
      // initializeJobs: function (data) {
      //   if (Array.isArray(data)) {
      //     data.forEach(function(item, index) {
      //       availableJobs[index] = new Job(item, index, this.projectId);
      //     });
      //   }
      // }

  //assignJob function, takes worker as an argument 
  //and a CALLBACK (this callback is passed in from socketRoutes.js)
    //gives the worker the first job from availabeJobs as a property
    //pass job into the callback

  //reassignJob function, takes socketId as an argument
    //locate the worker based on its socketId and find the job property
    //unshift the job back into availableJobs array

/*
==================================
USER INTERFACE AFFECTING FUNCTIONS
==================================
*/

  //createWorker function
    //ex start:
      //createWorker: function (projectId, socketId) {
      //   var worker = new Worker(projectId, socketId);
      //}
    //place the worker into the workers object (its key value is the socketId)
    //assign the worker a job (invoke assignJob on worker)
    //for-in loop over all workers in the workers object, and emit to them the workers array

  //removeWorker function, takes socketId as an argument
    //call reassignJob function on socketId
    //delete worker from the worker object
    //for-in loop over all workers in the workers object, and emit to them the workers array

  //handleResult function, takes a job object as an argument
  //(note: the worker that the job belongs too will emit)
    //place job[results] into completedJobs array based on its original index
    //for-in loop over all workers in the workers object, and emit to them the new completedJobs array