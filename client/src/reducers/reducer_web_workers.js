export default function (state = [], action) {
  switch (action.type){
    case 'CREATE_WEB_WORKER':
      // Create a Web Worker pool based on the maximum number of 
      // concurrent processes that user's CPU can support. Default to 
      // two workers if navigator.hardwareConcurrency is unavailable
      const MAX_WEBWORKERS = navigator.hardwareConcurrency || 2;
      const webWorkerPool = [];
      const socket = action.payload.socket;

      for (var i = 0; i < MAX_WEBWORKERS; i++) {
        let newWorker = {
          worker: new Worker('/webWorker'),
          isBusy: false,
          jobId: null
        }
    
        newWorker.worker.onmessage = (event) => {
          console.log('Sending completed job to server');
          const job = event.data;

          webWorkerPool.forEach( (worker) => {
            if (worker.jobId === job.jobId) {
              worker.isBusy = false;
              worker.jobId = null;
            }
          });

          socket.emit('userJobDone', job);
        };

        webWorkerPool.push(newWorker);
      }  
      console.log('WWReducer: Created new web workers', webWorkerPool);
      return webWorkerPool;
    
    case 'RESET_WEB_WORKER':
      console.log('Terminating web workers');
      action.payload.webWorkersPool.forEach( (worker) => {
        worker.worker.terminate();
      });

      return [];

    default:
      return state;
  }
}