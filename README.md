<img width="1182" height="913" alt="image" src="https://github.com/user-attachments/assets/3854bfa9-8eb2-4b6c-a0f3-b39ce99e88f1" />

## Project Structure

```
├── graphql-server/     # Go GraphQL server
└── frontend/           # Next.js React application
```

## Features

- **GraphQL Server (Go)**
  - Query: Fetch the saved ping timestamp
  - Mutation: Save the ping timestamp
  - Subscription: Real-time ping timestamp updates via WebSocket

- **Frontend (Next.js)**
  - TypeScript, ESLint, and Tailwind CSS
  - Apollo Client with HTTP and WebSocket support
  - Auto mutation with random intervals (1-3 seconds)
  - Real-time subscription to ping updates
  - Operations log showing all GraphQL queries, mutations, and subscriptions

## Prerequisites

- Go 1.24.1 or higher
- Node.js 20 or higher
- npm or yarn

## Setup & Installation

### 1. GraphQL Server

```bash
cd graphql-server
go mod download
go run server.go
```

The server will start on `http://localhost:8080`

- GraphQL Playground: `http://localhost:8080/`
- GraphQL Endpoint: `http://localhost:8080/query`

### 2. Frontend

```bash
cd frontend
npm install
npm run dev
```

The frontend will start on `http://localhost:3000`

## GraphQL Schema

```graphql
scalar Time

type Query {
  ping: Time
}

type Mutation {
  ping: Time!
}

type Subscription {
  ping: Time
}
```

## Usage

1. Start the GraphQL server first
2. Start the Next.js frontend
3. Open `http://localhost:3000` in your browser
4. The page will automatically:
   - Query the last ping timestamp on load
   - Trigger ping mutations every 1-3 seconds
   - Subscribe to real-time ping updates
   - Display all operations in the log

## Technology Stack

### Backend
- Go 1.24.1
- gqlgen (GraphQL server)
- gorilla/websocket (WebSocket support)

### Frontend
- Next.js 15.5.4
- React 19.1.0
- TypeScript 5
- Apollo Client 3.11.11
- Tailwind CSS 4
- graphql-ws 5.16.0

## Multiple Tabs

Each browser tab will independently:
- Ping mutations at random intervals
- Subscribe to the same ping stream
- Display all operations in its own log

This demonstrates real-time updates across multiple clients.
