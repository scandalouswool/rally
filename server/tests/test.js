const chai = require('chai');
const Job = require('../constructors/Job.js');
const should = chai.should();
const expect = chai.expect;
const Worker = require('../constructors/Worker.js');

const testJob = new Job([1, 2, 3], 3, 'project01');

describe('Jobs', () => {
  it('should be an object', () => {
    testJob.should.be.a('object');
  });
  it('should should have a JobId', () => {
    // testJob.to.include.keys('jobId');
    should.exist(testJob.jobId);
    expect(testJob.jobId).to.equal(3);
  });
  it('should have a projectId', () => {
    should.exist(testJob.projectId);
    expect(testJob.projectId).to.equal('project01');
  });
  it('should have a data field', () => {
    should.exist(testJob.data);
    expect(testJob.data).to.deep.equal([1, 2, 3]);
  });
  it('should not have a result value', () => {
    should.not.exist(testJob.result);
  });
  it('should not have a mapData function', () => {
    should.not.exist(testJob.mapData);
  });
  it('should not have a workerId', () => {
    should.not.exist(testJob.workerId);
  });
  it('should not have a jobsLength', () => {
    should.not.exist(testJob.jobsLength);
  });
});

const testWorker = new Worker('project01', 'socket01');

describe('Workers', () => {
  it('should be an object', () => {
    expect(testWorker).to.be.a('object');
  });
  it('should have a project ID', () => {
    should.exist(testJob.projectId);
  });
  it('should have a worker ID', () => {
    expect(testJob.socketId).to.equal('socket01');
  });
});

const testProjectOptions = {
  title: 'test',
  projectType: 'testProject',
  dataSet: null,
  generateDataSet: () => {
    return [1, 2, 3, 4]
  },
  mapData: (data) => {
      return data * 2;
    });
  },
  reduceResults: (results) => {
    return results.reduce( (acc, next) => {
      return acc + next;
    });
  }
}

















