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
const cluster_1 = __importDefault(require("cluster"));
const express_1 = __importDefault(require("express"));
const express_rate_limit_1 = __importDefault(require("express-rate-limit"));
const rate_limit_redis_1 = __importDefault(require("rate-limit-redis"));
const ioredis_1 = __importDefault(require("ioredis"));
// import Redis from 'ioredis';
const taskProcessor_1 = require("./taskProcessor");
const config_1 = __importDefault(require("./config"));
const redis = new ioredis_1.default(config_1.default.redis);
// const redis = new RedisClient({ config.redis});
// const RedisClient = createClient({config.redis});
if (cluster_1.default.isPrimary) {
    console.log(`Master/Primary ${process.pid} iz running bozz`);
    for (let i = 0; i < config_1.default.workers; i++) {
        cluster_1.default.fork();
    }
    cluster_1.default.on('exit', (worker, code, signal) => {
        console.log(`Worker ${worker.process.pid} died pepsied`);
        cluster_1.default.fork();
    });
}
else {
    const app = (0, express_1.default)();
    app.use(express_1.default.json());
    const limiter = (0, express_rate_limit_1.default)({
        store: new rate_limit_redis_1.default({
            // client: redis,
            sendCommand: (command, ...args) => __awaiter(void 0, void 0, void 0, function* () {
                return redis.call(command, ...args);
            }),
            prefix: 'rate_limit:',
        }),
        windowMs: config_1.default.rateLimit.windowMs,
        max: config_1.default.rateLimit.max,
        keyGenerator: (req) => req.body.userId,
        standardHeaders: true,
        legacyHeaders: false,
    });
    app.post('/process-task', limiter, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const { userId } = req.body;
        if (!userId) {
            return res.status(400).json({ message: 'User ID is required' });
        }
        try {
            yield (0, taskProcessor_1.enqueueTask)(userId);
            res.status(200).json({ message: 'Task queued sucsuxfully' });
        }
        catch (error) {
            console.error('Error processing task:', error);
            res.status(500).json({ message: 'Internal server error' });
        }
    }));
    app.listen(config_1.default.port, () => {
        console.log(`Worker ${process.pid} started and listening on port ${config_1.default.port}`);
    });
}
