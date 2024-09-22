"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const ioredis_mock_1 = __importDefault(require("ioredis-mock"));
const taskProcessor_1 = require("../taskProcessor");
const redis = new ioredis_mock_1.default();
jest.mock('ioredis', () => require('ioredis-mock'));
describe('Task Queueing', () => {
    beforeEach(() => {
        redis.flushall();
    });
    it('should enqueue tasks', () => __awaiter(void 0, void 0, void 0, function* () {
        yield (0, taskProcessor_1.enqueueTask)('user1');
        const queueLength = yield redis.llen('queue:user1');
        expect(queueLength).toBe(1);
    }));
    it('should process tasks at a rate of 1 per second', () => __awaiter(void 0, void 0, void 0, function* () {
        jest.setTimeout(5000);
        const startTime = Date.now();
        yield Promise.all([
            (0, taskProcessor_1.enqueueTask)('user1'),
            (0, taskProcessor_1.enqueueTask)('user1'),
            (0, taskProcessor_1.enqueueTask)('user1'),
        ]);
        yield new Promise(resolve => setTimeout(resolve, 3500));
        const endTime = Date.now();
        const duration = endTime - startTime;
        expect(duration).toBeGreaterThanOrEqual(3000);
        expect(duration).toBeLessThan(3500);
    }));
});
