//begin job constructor, takes item (job data), index, projectId as arguments
class Job {
  constructor(item, index, projectId) {
    this.jobId = index;
    this.projectId = projectId;
    this.projectType = 'default';
    this.workerId = null;
    this.totalJobs = null;
    this.data = item;
    this.result = null;
    this.mapData = null; 
  }
}

//export job constructor
module.exports = Job;