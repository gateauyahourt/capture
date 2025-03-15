# Capture - Lambda Server

A high-performance Node.js server in TypeScript using Fastify for launching "home-made" lambda functions.

## Features

- Built with Fastify, one of the fastest HTTP frameworks for Node.js
- Written in TypeScript for type safety
- Supports both GET and POST methods for lambda invocation
- Containerized with Docker for easy deployment
- CI/CD with GitHub Actions

## Getting Started

### Prerequisites

- Node.js 18.x or later
- pnpm (recommended) or npm

### Installation

```bash
# Clone the repository
git clone <repository-url>
cd capture

# Install dependencies
pnpm install
```

### Development

```bash
# Start the development server
pnpm dev
```

The server will be available at http://localhost:3000.

### Building for Production

```bash
# Build the TypeScript project
pnpm build

# Start the production server
pnpm start
```

## API Endpoints

### GET /run/:lambda_name

Invokes a lambda function by name.

**Example:**
```bash
curl http://localhost:3000/run/my-lambda
```

**Response:**
```json
{
  "success": true,
  "message": "Lambda \"my-lambda\" was called successfully (GET)",
  "lambda": "my-lambda",
  "timestamp": "2025-03-15T16:30:58.241Z"
}
```

### POST /run/:lambda_name

Invokes a lambda function by name with a payload.

**Example:**
```bash
curl -X POST -H "Content-Type: application/json" -d '{"payload":{"name":"test-value","count":42}}' http://localhost:3000/run/my-lambda
```

**Response:**
```json
{
  "success": true,
  "message": "Lambda \"my-lambda\" was called successfully (POST)",
  "lambda": "my-lambda",
  "timestamp": "2025-03-15T16:31:03.014Z"
}
```

## Docker

### Building the Docker Image

```bash
docker build -t capture .
```

### Running the Docker Container

```bash
docker run -p 3000:3000 capture
```

## CI/CD

This project uses GitHub Actions for continuous integration and deployment:

- **Build and Test**: Runs on every push and pull request to main/master branches
- **Docker Build and Publish**: Builds and publishes a Docker image to GitHub Container Registry on every push to main/master branches and when tags are created

### Selecting Specific Runners

The GitHub Actions workflows are configured to use self-hosted runners with specific labels. You can modify the `runs-on` parameter in the workflow files to select different runners:

#### GitHub-hosted Runners

```yaml
# Use the latest Ubuntu runner
runs-on: ubuntu-latest

# Use a specific Ubuntu version
runs-on: ubuntu-22.04

# Use Windows
runs-on: windows-2022

# Use macOS
runs-on: macos-12
```

#### Self-hosted Runners

```yaml
# Use a self-hosted runner with specific labels
runs-on: [self-hosted, linux, x64]

# Target more specific runners with additional labels
runs-on: [self-hosted, linux, x64, production]
```

For detailed information on setting up and using runners, see our [GitHub Actions Runners Guide](./docs/github-runners.md).

## License

ISC
