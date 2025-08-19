# ADR-001: Docker-based Package Management

## Status
Accepted

## Context
This is a Docker-compose based project that uses Docker containers for consistent development environments. All package management operations should be performed within the Docker environment to ensure consistency across different developer machines and environments.

## Decision
All yarn commands must be executed through Docker Compose to maintain environment consistency.

### Commands to use:

**Install dependencies:**
```bash
docker-compose run --rm frontend yarn add <package-name>
```

**Remove dependencies:**
```bash
docker-compose run --rm frontend yarn remove <package-name>
```

**Install dev dependencies:**
```bash
docker-compose run --rm frontend yarn add -D <package-name>
```

**Run scripts:**
```bash
docker-compose run --rm frontend yarn <script-name>
```

## Consequences

### Positive
- Ensures consistent Node.js and yarn versions across all environments
- Prevents "works on my machine" issues
- Dependencies are installed in the correct container environment
- Maintains Docker volume consistency

### Negative  
- Slightly slower than running yarn directly on host machine
- Requires Docker to be running for package management operations

## Compliance
All team members and automation must use Docker-based yarn commands. Direct yarn execution on the host machine is prohibited for this project.