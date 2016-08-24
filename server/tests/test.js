const chai = require('chai');
const Job = require('../constructors/Job.js');
const should = chai.should();
const expect = chai.expect;

const testJob = new Job([1, 2, 3], 3, 'project02');

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
    expect(testJob.projectId).to.equal('project02');
  });
  it('should have a data field', () => {
    should.exist(testJob.data);
    expect(testJob.data).to.deep.equal([1, 2, 3]);
  });
  it('should not have a result value')
  it('should not have a mapData function')
});













