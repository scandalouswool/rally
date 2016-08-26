class Job {
  constructor(item, index, projectId) {
    this.jobId = index;
    this.projectId = projectId;
    this.projectType = 'default';
    this.workerId = null;
    this.jobsLength = null;
    this.data = item;
    this.result = null;
    this.mapData = null; 
  }
}

module.exports = Job;