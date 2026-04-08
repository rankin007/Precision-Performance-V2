---
name: GitHub Workflow
description: Operational workflow for version control, CI/CD actions, and repository hygiene.
tags: [git, github, cicd, actions]
---

# GitHub Workflow Skill

## Objective
To maintain the integrity, traceability, and automated reliability of the Precision Performance codebase.

## Scope
- Managing the repository structure, branches, and tags.
- Maintaining GitHub Actions (`.github/workflows/`).
- Enforcing pull request standards and code quality.
- Managing repository secrets and environments.

## Standard Workflows

### 1. Version Control Patterns
- Branch name convention: `feature/name`, `fix/name`, `hotfix/name`.
- Protected branch: `main` (only merge via PR).
- Commit messages: Use the format `prefix: description` (e.g., `fix: resolve login redirect loop`).

### 2. CI/CD Management
- The `deploy.yml` workflow governs database migrations (Supabase) and alerts for Vercel/Railway deployments.
- Ensure that `SUPABASE_ACCESS_TOKEN`, `SUPABASE_DB_PASSWORD`, and other critical secrets are configured in the repository's Settings → Secrets and Variables.

### 3. Repository Hygiene
- No sensitive data (API keys, passwords) should EVER be committed to Git.
- Use `.gitignore` to protect local development environment files.

## Troubleshooting
- **Workflow Failure**: Check the "Actions" tab. Failures are often caused by missing secrets or linting errors.
- **Merge Conflicts**: Resolve locally on the feature branch before merging to `main`.

## References
- `.github/workflows/deploy.yml`
- `.gitignore`
- [GitHub Docs](https://docs.github.com/en)
