# Using Private Docker Registries with GitHub Actions

This guide provides detailed information on how to configure GitHub Actions to push Docker images to a private registry.

## Overview

While GitHub Container Registry (ghcr.io) is convenient for GitHub repositories, you may need to push Docker images to a private registry for various reasons:

- Using an existing private registry infrastructure
- Keeping images in a controlled environment
- Integration with existing deployment pipelines
- Compliance or security requirements

## Configuration

### Environment Variables

The workflow uses the following environment variables:

| Variable | Type | Description |
|----------|------|-------------|
| `PRIVATE_REGISTRY_URL` | Variable | URL of your private registry (e.g., `registry.example.com`) |
| `DOCKER_IMAGE_NAME` | Variable | Name of your image in the registry (e.g., `myorg/myapp`) |
| `PRIVATE_REGISTRY_USER` | Secret | Username for your private registry |
| `PRIVATE_REGISTRY_PASSWORD` | Secret | Password or token for your private registry |

### Setting Up Variables and Secrets

1. **Go to your GitHub repository**
2. **Navigate to Settings > Secrets and variables > Actions**
3. **Add repository variables**:
   - Click on "New repository variable"
   - Add `PRIVATE_REGISTRY_URL` with your registry URL
   - Add `DOCKER_IMAGE_NAME` with your image name
4. **Add repository secrets**:
   - Click on "New repository secret"
   - Add `PRIVATE_REGISTRY_USER` with your registry username
   - Add `PRIVATE_REGISTRY_PASSWORD` with your registry password or token

### Workflow Logic

The workflow is designed to:

1. Check if `PRIVATE_REGISTRY_URL` is set
2. If set, push to the private registry using the provided credentials
3. If not set, fall back to GitHub Container Registry

## Examples for Common Private Registries

### Docker Hub

```
PRIVATE_REGISTRY_URL: docker.io
DOCKER_IMAGE_NAME: yourusername/yourrepo
PRIVATE_REGISTRY_USER: yourusername
PRIVATE_REGISTRY_PASSWORD: yourpassword
```

### AWS Elastic Container Registry (ECR)

For AWS ECR, you'll need to modify the workflow to include AWS authentication. Add this step before the Docker login:

```yaml
- name: Configure AWS credentials
  uses: aws-actions/configure-aws-credentials@v4
  with:
    aws-access-key-id: ${{ secrets.AWS_ACCESS_KEY_ID }}
    aws-secret-access-key: ${{ secrets.AWS_SECRET_ACCESS_KEY }}
    aws-region: ${{ vars.AWS_REGION }}

- name: Login to Amazon ECR
  id: login-ecr
  uses: aws-actions/amazon-ecr-login@v2
```

Then set:
```
PRIVATE_REGISTRY_URL: <aws-account-id>.dkr.ecr.<region>.amazonaws.com
DOCKER_IMAGE_NAME: yourrepo
```

And add these secrets:
```
AWS_ACCESS_KEY_ID: your-access-key
AWS_SECRET_ACCESS_KEY: your-secret-key
```

### Google Container Registry (GCR)

```
PRIVATE_REGISTRY_URL: gcr.io
DOCKER_IMAGE_NAME: your-project-id/yourrepo
```

For authentication, you'll need to add a service account JSON key as a secret:
```
PRIVATE_REGISTRY_USER: _json_key
PRIVATE_REGISTRY_PASSWORD: <contents of your service account JSON key file>
```

### Azure Container Registry (ACR)

```
PRIVATE_REGISTRY_URL: yourregistry.azurecr.io
DOCKER_IMAGE_NAME: yourrepo
PRIVATE_REGISTRY_USER: yourusername
PRIVATE_REGISTRY_PASSWORD: yourpassword
```

## Troubleshooting

### Common Issues

1. **Authentication Failure**:
   - Verify your credentials are correct
   - Check if your token has the necessary permissions
   - Ensure your token hasn't expired

2. **Push Permission Denied**:
   - Verify you have write access to the repository
   - Check if the repository exists or needs to be created first

3. **Registry URL Format**:
   - Ensure the URL doesn't include `https://` or trailing slashes
   - Example: Use `registry.example.com` not `https://registry.example.com/`

### Debugging

To debug issues, you can add additional logging to your workflow:

```yaml
- name: Debug environment
  run: |
    echo "Registry URL: ${{ env.PRIVATE_REGISTRY_URL }}"
    echo "Image Name: ${{ env.IMAGE_NAME }}"
    # Don't echo secrets!
```

## Security Considerations

- **Never** commit secrets directly in your workflow files
- Use GitHub's secret storage for sensitive information
- Consider using OpenID Connect (OIDC) for cloud providers instead of long-lived credentials
- Regularly rotate your credentials
- Use the principle of least privilege when creating service accounts

## Resources

- [Docker Login Action Documentation](https://github.com/docker/login-action)
- [GitHub Actions Secrets Documentation](https://docs.github.com/en/actions/security-guides/encrypted-secrets)
- [GitHub Actions Variables Documentation](https://docs.github.com/en/actions/learn-github-actions/variables)
