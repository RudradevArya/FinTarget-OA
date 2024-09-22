# Node.js API Cluster with Rate Limiting

This project/assessment implements a Node.js API cluster with rate limiting and task queueing capabilities using TypeScript, Express, and Redis.

## Problem Statement

[Detailed Problem Statement](https://drive.google.com/file/d/120l2XdptGb1AARiMFcsQKk7LLdyLe19z/view?usp=drive_link)

## Features/Tasklist

> * [x] `Node.js cluster with multiple workers`
> * [x] `Rate limiting (20 requests per minute per user)`
> * [x] `Task queueing (1 task per second per user)`
> * [x] `Redis for distributed rate limiting and task queueing`
> * [x] `TypeScript implementation`
> * [ ] `Testing suite`
> * [ ] `Docker support(tried)`

## Prerequisites

* Node.js (v14+)
* Redis
* Docker and Docker Compose (optional)

## Folder struct

```
├── src/
│   ├── app.ts
│   ├── config.ts
│   ├── taskProcessor.ts
│   └── types.ts
├── Dockerfile
├── docker-compose.yml
├── package.json
├── tsconfig.json
└── readme.md
```

## Installation

1. Clone the repository:

```
git clone https://github.com/RudradevArya/FinTarget-OA.git
cd FinTarget-OA
```

2. Install dependencies:

```
npm install
```

3. Build the TypeScript code:

```
npm run build
```

4. Start the server:

```
npm start
```

## Running with Docker

1. Build and run the containers:

```
docker-compose up --build
```

## API Documentation

### POST /process-task

Process a task for a specific user.

**Request Body:**

``` json
{
  "userId": "string"
}
```

**Response:**

* 200 OK: Task queued successfully
* 400 Bad Request: User ID is required
* 429 Too Many Requests: Rate limit exceeded
* 500 Internal Server Error: Server error

## Outputs

* Starting up
![Starting up](https://github.com/RudradevArya/FinTarget-OA/blob/main/outputs/1.png)
* cURL Outputs
![cURL Outputs](https://github.com/RudradevArya/FinTarget-OA/blob/main/outputs/2.png)
* Postman Output
![Postman Output](https://github.com/RudradevArya/FinTarget-OA/blob/main/outputs/3.png)
* Task\_log log file
![Task_log log file](https://github.com/RudradevArya/FinTarget-OA/blob/main/outputs/4.png)
* Redis user queue monitoring
![Redis user queue monitoring](https://github.com/RudradevArya/FinTarget-OA/blob/main/outputs/5.png)

## Architecture Decisions

* Used TypeScript for improved type safety and developer experience.
* Implemented a custom task queue using Redis to ensure one task per second per user across multiple workers.
* Used Redis for distributed rate limiting across multiple worker processes.
* Containerized the application for easy deployment and scaling(Tried)

## Future Improvements

* Implement comprehensive unit and integration tests
* Add monitoring and alerting (e.g., Prometheus and Grafana)
* Implement user authentication and authorization
* Optimize for higher concurrency and throughput

## Project Progress Videos

<!-- [![Video Title](https://img.youtube.com/vi/VIDEO_ID/0.jpg)](https://www.youtube.com/watch?v=VIDEO_ID) -->
[![Video Title](https://img.youtube.com/vi/Cw_Z3EUznmA/hqdefault.jpg)](https://www.youtube.com/watch?v=Cw_Z3EUznmA)
