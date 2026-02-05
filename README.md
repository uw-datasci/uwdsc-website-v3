# UWDSC Website v3 - Developer Onboarding Guide

Welcome to the UW Data Science Club website repository! This guide will help you understand the codebase architecture, setup process, and development workflow.

## 🚀 Quick Setup

> 📖 For detailed setup instructions and environment configuration, visit **[docs.uwdatascience.ca/getting-started](https://docs.uwdatascience.ca/getting-started)**

### Prerequisites

- Node.js >= 20
- pnpm >= 10.26.0

### Quick Start

```bash
# 1. Clone the repository
git clone https://github.com/uwdsc/uwdsc-website-v3.git
cd uwdsc-website-v3

# 2. Install dependencies
pnpm install

# 3. Set up environment variables
pnpm pull-secrets

# 4. Start development servers
pnpm dev
```

### Common Commands

```bash
pnpm dev                       # Start all apps
pnpm dev:web                   # Start main website only
pnpm dev:admin                 # Start admin app only
pnpm build                     # Build all packages
pnpm lint                      # Lint all packages
pnpm ui:add <component-name>   # Add shadcn components
```

## 📚 Documentation

For comprehensive documentation including architecture, development workflows, and best practices, visit **[docs.uwdatascience.ca](https://docs.uwdatascience.ca)**.

### Key Documentation Sections

- **[Getting Started](https://docs.uwdatascience.ca/getting-started)** - Complete environment setup and installation guide
- **[Architecture](https://docs.uwdatascience.ca/architecture)** - Monorepo structure, design system, and API architecture
- **[Guides](https://docs.uwdatascience.ca/guides)** - Step-by-step development guides for common tasks
- **[Packages](https://docs.uwdatascience.ca/packages)** - Detailed package documentation

## 🆘 Getting Help

- Check the [documentation](https://docs.uwdatascience.ca) for detailed guides and architecture information
- Review the [Getting Started guide](https://docs.uwdatascience.ca/getting-started) for setup help
- Reach out to your VPs for more questions/clarifications

Happy coding! 🚀
