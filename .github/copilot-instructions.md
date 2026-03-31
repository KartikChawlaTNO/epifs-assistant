<!-- Auto-generated guidance for AI coding agents. Update when project files exist. -->
# Copilot / AI Agent Instructions

Purpose
- Provide immediate, actionable guidance for AI coding agents working on this repository.

Repo status
- This repository currently contains no source files or manifest (folder is empty). Before making code changes, confirm the intended language and provide the project files (e.g., `pyproject.toml`, `package.json`, `README.md`, `src/`, `tests/`).

How to start (must-do checks)
- List files and repo state: `git status --porcelain`, `git rev-parse --show-toplevel`, or on Windows `dir /b`.
- Search for common manifests: look for `pyproject.toml`, `requirements.txt`, `package.json`, `Cargo.toml`, `go.mod`, `pom.xml`, `setup.cfg`.
- If none exist, ask the repository owner what language/framework to scaffold or which existing repo this should mirror.

What to document when code exists
- Identify the application entry points (examples: `src/main.py`, `src/index.js`, `cmd/`, `bin/`).
- Note build and run commands from manifests or CI: `python -m`, `npm run`, `cargo build`, `mvn package`, Docker commands in `Dockerfile` or `docker-compose.yml`.
- Record test commands and coverage: `pytest -q`, `npm test`, `go test ./...` and any custom test runners.
- Capture CI workflows: inspect `.github/workflows/*.yml` for build/test/deploy steps and caching patterns.

Project-specific patterns to look for
- Language-specific layout: `src/` for Python/JS, `pkg/` or `cmd/` for Go, `lib/` for Ruby. If present, prefer the established layout.
- Packaging: prefer project manifest scripts (e.g., `scripts` in `package.json`, `console_scripts` in `setup.cfg`).
- Configuration: look for `.env`, `config/*.yaml`, `settings.py` or `config.go` and respect runtime overrides.

Integration points & external dependencies
- Detect external services by reading config and CI files (examples: Docker images, cloud infra, database URLs, queues). List exact file locations where credentials or endpoints are defined.

> If you encounter compiled artifacts (dist/, build/, node_modules/), avoid editing them — make changes to source files instead.

Agent behavior and constraints for this repo
- Do not guess language or build system when repository is empty — ask the owner.
- When files exist, prefer minimal, focused changes with tests and CI updates where appropriate.
- Always run available tests and lint commands before proposing a PR. If tests are absent, propose adding a simple test harness and document how to run it.

Examples to include in future updates
- If Python: a sample `pyproject.toml` location and `pytest` usage lines.
- If Node: `package.json` script examples and `npm ci` in CI workflows.

Next steps for human maintainers
- Add at least a `README.md` and one manifest (`pyproject.toml` / `package.json`) so agents can detect language and workflows.
- If you want me to scaffold a minimal project structure for a specific language, specify the language and intended runtime.

Feedback
- If any section is unclear or you want this tailored to a specific language/framework, tell me which one and I'll update this file.
