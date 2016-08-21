//begin worker constructor, projectId and socket as arguments
class Worker {
  constructor(projectId, socketId) {
    this.projectId = projectId;
    this.workerId = socketId;
    this.currentJob = [];
    this.maxJobs = null;
  }
}
//export job constructor
module.exports = Worker;