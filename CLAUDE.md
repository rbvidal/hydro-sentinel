# CLAUDE.md

## Build / Run

```bash
# Build all modules
./mvnw clean package

# Run the API server (the bootable module)
# -am builds dependent modules first; required unless already installed
./mvnw -pl hydro-sentinel-api -am spring-boot:run

# Run tests
./mvnw test

# Run tests for a single module
./mvnw -pl hydro-sentinel-api test
```

## Project overview

Hydro Sentinel is a real-time flood monitoring and alert management platform. It's a Java 21 / Spring Boot 3.3.5 multi-module Maven project (group `com.hydrosentinel`, version `0.1.0-SNAPSHOT`).

## Module architecture

```
hydro-sentinel (root pom, packaging=pom)
├── hydro-sentinel-domain   ← Core domain model, enums, service interfaces
├── hydro-sentinel-sensor   ← Telemetry ingestion and processing
├── hydro-sentinel-alert    ← Breach detection, alert rules, notifications
└── hydro-sentinel-api      ← REST API, WebSocket endpoints, app assembly (bootable)
```

Dependency flow: `api` depends on all three; `sensor` and `alert` each depend on `domain`; `domain` has no internal dependencies (only `jakarta.validation-api`).

## Tech stack

- **Java 21**, **Spring Boot 3.3.5**, **Maven**
- **Persistence**: Spring Data JPA, PostgreSQL (prod), H2 (test)
- **Web**: Spring MVC (REST + server-rendered pages via Thymeleaf), WebSocket
- **Validation**: Jakarta Validation API

## Configuration

- `application.yml` — PostgreSQL datasource with env-var overrides (`DB_URL`, `DB_USERNAME`, `DB_PASSWORD`), debug logging for `com.hydrosentinel`
- `application-test.yml` — H2 in-memory database with PostgreSQL compatibility mode
- Test profile disables whitelabel error pages

## Project state

Early scaffold: package structure is laid out (`domain.model`, `domain.enums`, `api.web`, `api.service`, `api.config`) but no domain classes, controllers, or services have been implemented yet.

## Conventions

- Follow existing package layout when adding new classes
- Place entities under `com.hydrosentinel.domain.model`
- Place enums under `com.hydrosentinel.domain.enums`
- Place REST/page controllers under `com.hydrosentinel.api.web`
- Place business logic under `com.hydrosentinel.api.service`
- Place configuration beans under `com.hydrosentinel.api.config`
- Component scanning, entity scanning, and JPA repositories all scan from `com.hydrosentinel`
