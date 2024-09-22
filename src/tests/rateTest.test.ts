import cluster from 'cluster';
import config from '../config';

jest.mock('cluster', () => ({
  isMaster: true,
  fork: jest.fn(),
  on: jest.fn(),
}));

describe('Cluster Functionality', () => {
  it('should create the correct number of worker processes', () => {
    require('../app');
    expect(cluster.fork).toHaveBeenCalledTimes(config.workers);
  });

  it('should set up an event listener for worker exits', () => {
    require('../app');
    expect(cluster.on).toHaveBeenCalledWith('exit', expect.any(Function));
  });
});