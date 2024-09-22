"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const cluster_1 = __importDefault(require("cluster"));
const config_1 = __importDefault(require("../config"));
jest.mock('cluster', () => ({
    isMaster: true,
    fork: jest.fn(),
    on: jest.fn(),
}));
describe('Cluster Functionality', () => {
    it('should create the correct number of worker processes', () => {
        require('../app');
        expect(cluster_1.default.fork).toHaveBeenCalledTimes(config_1.default.workers);
    });
    it('should set up an event listener for worker exits', () => {
        require('../app');
        expect(cluster_1.default.on).toHaveBeenCalledWith('exit', expect.any(Function));
    });
});
