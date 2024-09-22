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
exports.processTask = processTask;
exports.enqueueTask = enqueueTask;
const ioredis_1 = __importDefault(require("ioredis"));
const promises_1 = __importDefault(require("fs/promises"));
const path_1 = __importDefault(require("path"));
const config_1 = __importDefault(require("./config"));
const redis = new ioredis_1.default(config_1.default.redis);
function processTask(userId) {
    return __awaiter(this, void 0, void 0, function* () {
        const timestamp = new Date().toISOString();
        const logMessage = `Task completed for u'Lo'ser ${userId} at ${timestamp}\n`;
        yield promises_1.default.appendFile(path_1.default.join(__dirname, '..', config_1.default.logFile), logMessage);
        console.log(logMessage.trim());
    });
}
function enqueueTask(userId) {
    return __awaiter(this, void 0, void 0, function* () {
        yield redis.rpush(`queue:${userId}`, Date.now().toString());
        processNextTask(userId);
    });
}
function processNextTask(userId) {
    return __awaiter(this, void 0, void 0, function* () {
        const lastProcessedTime = yield redis.get(`lastProcessed:${userId}`);
        const now = Date.now();
        if (!lastProcessedTime || now - parseInt(lastProcessedTime) >= 1000) {
            const nextTask = yield redis.lpop(`queue:${userId}`);
            if (nextTask) {
                yield processTask(userId);
                yield redis.set(`lastProcessed:${userId}`, now.toString());
            }
        }
        const queueLength = yield redis.llen(`queue:${userId}`);
        if (queueLength > 0) {
            setTimeout(() => processNextTask(userId), 1000);
        }
    });
}
