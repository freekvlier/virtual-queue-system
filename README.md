# Virtual Queue System

A simple virtual queue system built using Node.js, Express, and Socket.IO. This system allows users to join a virtual queue and get access to a page after a specified start time. The queue system prioritizes users based on their position in the queue, and users are granted access for a predefined duration.

## Getting Started

### 1. Clone the Repository:
```bash
git clone https://github.com/freekvlier/virtual-queue-system.git
cd virtual-queue-system
```

### 2. Install Dependencies:
```bash
npm install
```

### 3. Run the Application:

```bash
node app.js
```
### 4. Access the Queue System:
Open the application URL http://localhost:3000 in multiple browser windows or tabs.

*As users connect to the virtual queue system, each browser window or tab will represent a separate client. Observe the queue status, including the position in the queue and the total number of people waiting, for each client.*

## Functionality
- Users can join the virtual queue.
- The queue starts at a specified time.
- Users are prioritized based on their position in the queue.
- Each user is granted access for a predefined duration (e.g., 15 minutes).
- Users can see their position in the queue and the total number of people waiting.
- When a user disconnects, they are removed from the queue, and the status updates for remaining users.

## Project Structure

- **app.js**:  The main server file with the Node.js and Express application setup.
- **index.html**: The HTML file served to clients, providing the interface for the virtual queue system.

## Dependencies
- Express: Fast, unopinionated, minimalist web framework for Node.js.
- Socket.IO: Real-time bidirectional event-based communication library.

## Configuration
- QUEUE_START_TIME: Set the start time for the virtual queue.
- VISIT_DURATION: Set the duration each user is granted access.

## Acknowledgments
Inspired by the need for a virtual queue system for testing purposes.
