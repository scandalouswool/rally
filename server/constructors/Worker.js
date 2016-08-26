class Worker {
  constructor(projectId, socketId) {
    this.projectId = projectId;
    this.workerId = socketId;
    this.currentJob = [];
    this.maxJobs = null;
    this.isBusy = false;
  }
}

module.exports = Worker;