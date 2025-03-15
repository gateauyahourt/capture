# GitHub Actions Runners Guide

This document provides detailed information on how to select and configure specific runners for your GitHub Actions workflows.

## Types of Runners

GitHub Actions supports two types of runners:

1. **GitHub-hosted runners**: Managed by GitHub, ready to use
2. **Self-hosted runners**: Managed by you, offering more control and customization

## GitHub-hosted Runners

GitHub-hosted runners are virtual machines maintained by GitHub. They come with a variety of pre-installed software and are ready to use without any setup.

### Available GitHub-hosted Runners

| Runner | YAML Label | Notes |
|--------|------------|-------|
| Ubuntu 22.04 | `ubuntu-22.04` or `ubuntu-latest` | Default Linux environment |
| Ubuntu 20.04 | `ubuntu-20.04` | Older Ubuntu version |
| Windows Server 2022 | `windows-2022` or `windows-latest` | Default Windows environment |
| Windows Server 2019 | `windows-2019` | Older Windows version |
| macOS 12 | `macos-12` or `macos-latest` | Default macOS environment |
| macOS 11 | `macos-11` | Older macOS version |

### Using GitHub-hosted Runners

To use a GitHub-hosted runner, specify the label in your workflow file:

```yaml
jobs:
  build:
    runs-on: ubuntu-latest
```

## Self-hosted Runners

Self-hosted runners are machines that you set up and manage yourself. They offer several advantages:

- **Custom hardware**: Use specific CPU, memory, or GPU configurations
- **Persistent software**: Install software once and reuse across workflows
- **Network access**: Access internal resources that aren't publicly accessible
- **Cost control**: Avoid GitHub-hosted runner usage limits and costs

### Setting Up Self-hosted Runners

1. **Create the runner**:
   - Go to your GitHub repository or organization settings
   - Navigate to "Actions" > "Runners"
   - Click "New self-hosted runner"
   - Follow the instructions to download and configure the runner

2. **Add labels** (optional but recommended):
   During setup, you can add custom labels to your runner. These labels can be used to target specific runners in your workflows.

   Example:
   ```bash
   ./config.sh --labels linux,x64,production,gpu
   ```

3. **Start the runner**:
   ```bash
   ./run.sh
   ```

### Using Self-hosted Runners

To use a self-hosted runner, specify the labels in your workflow file:

```yaml
jobs:
  build:
    runs-on: [self-hosted, linux, x64]
```

You can use multiple labels to target specific runners:

```yaml
jobs:
  build:
    runs-on: [self-hosted, linux, x64, production]
```

## Runner Selection Strategy

When deciding which runner to use, consider:

1. **Performance requirements**: CPU, memory, disk I/O, network
2. **Software requirements**: Pre-installed tools, custom software
3. **Security considerations**: Access to sensitive data
4. **Cost implications**: GitHub-hosted runners have usage limits

## Advanced Configuration

### Runner Groups

For organization-level runners, you can create runner groups to limit which repositories can use which runners:

1. Go to your organization settings
2. Navigate to "Actions" > "Runner groups"
3. Create and configure runner groups

### Auto-scaling Runners

For dynamic workloads, consider setting up auto-scaling runners using tools like:

- [actions-runner-controller](https://github.com/actions-runner-controller/actions-runner-controller) for Kubernetes
- [philips-labs/terraform-aws-github-runner](https://github.com/philips-labs/terraform-aws-github-runner) for AWS

## Troubleshooting

Common issues with self-hosted runners:

1. **Runner offline**: Check network connectivity and runner service status
2. **Job queued**: Ensure runner labels match workflow configuration
3. **Permission issues**: Verify runner has necessary permissions

## Resources

- [GitHub Docs: About self-hosted runners](https://docs.github.com/en/actions/hosting-your-own-runners/about-self-hosted-runners)
- [GitHub Docs: Adding self-hosted runners](https://docs.github.com/en/actions/hosting-your-own-runners/adding-self-hosted-runners)
- [GitHub Docs: Using labels with self-hosted runners](https://docs.github.com/en/actions/hosting-your-own-runners/using-labels-with-self-hosted-runners)
