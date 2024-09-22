# Node.js API Cluster with Rate Limiting

This project implements a Node.js API cluster with rate limiting and task queueing capabilities using TypeScript, Express, and Redis.

## Features

- Node.js cluster with multiple workers
- Rate limiting (20 requests per minute per user)
- Task queueing (1 task per second per user)
- Redis for distributed rate limiting and task queueing
- TypeScript implementation
- Docker support

## Prerequisites

- Node.js (v14+)
- Redis
- Docker and Docker Compose (optional)

## Installation

1. Clone the repository:
   ```
   git clone https://github.com/yourusername/nodejs-api-cluster.git
   cd nodejs-api-cluster
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
```json
{
  "userId": "string"
}
```

**Response:**
- 200 OK: Task queued successfully
- 400 Bad Request: User ID is required
- 429 Too Many Requests: Rate limit exceeded
- 500 Internal Server Error: Server error

## Architecture Decisions

- Used TypeScript for improved type safety and developer experience.
- Implemented a custom task queue using Redis to ensure one task per second per user across multiple workers.
- Used Redis for distributed rate limiting across multiple worker processes.
- Containerized the application for easy deployment and scaling.

## Future Improvements

- Implement comprehensive unit and integration tests
- Add monitoring and alerting (e.g., Prometheus and Grafana)
- Implement user authentication and authorization
- Optimize for higher concurrency and throughput

