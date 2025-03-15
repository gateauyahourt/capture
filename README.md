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

- **Docker Build and Publish**: Builds and publishes multi-architecture Docker images (AMD64 and ARM64) to GitHub Container Registry or a private registry on every push to main/master branches and when tags are created. See our [Multi-Architecture Docker Guide](./docs/multi-arch-docker.md) for details.

> Note: A build-only workflow (build.yml.disabled) is included in the repository but is disabled by default. To enable it, rename the file from `build.yml.disabled` to `build.yml`.

### Pushing to a Private Registry

The Docker workflow is configured to support pushing to a private registry using environment variables. To use this feature:

1. Go to your GitHub repository settings
2. Navigate to "Secrets and variables" > "Actions"
3. Add the following repository variables:
   - `PRIVATE_REGISTRY_URL`: URL of your private registry (e.g., `registry.example.com`)
   - `DOCKER_IMAGE_NAME`: Name of your image in the private registry (e.g., `myorg/myapp`)

4. Add the following repository secrets:
   - `PRIVATE_REGISTRY_USER`: Username for your private registry
   - `PRIVATE_REGISTRY_PASSWORD`: Password or token for your private registry

When these variables are set, the workflow will automatically push to your private registry instead of GitHub Container Registry.

For detailed information on using private registries with different providers (Docker Hub, AWS ECR, Google GCR, Azure ACR), see our [Private Registry Guide](./docs/private-registry.md).

### Verifying Docker Image Pushes

To verify that your Docker image has been successfully pushed to the registry, you can use the following commands:

```bash
# Log in to the registry
docker login registry.example.com -u username -p password

# Check if the image exists in the registry using the API
curl -X GET https://registry.example.com/v2/your-image/tags/list -u username:password

# Pull the image to verify it's accessible
docker pull registry.example.com/your-image:tag

# List local images to confirm the pull
docker image ls | grep your-image

# Inspect the image details (only works after pulling)
docker inspect registry.example.com/your-image:tag
```

For more detailed verification commands and troubleshooting tips, see our [Docker Push Verification Guide](./docs/verify-docker-push.md).

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
