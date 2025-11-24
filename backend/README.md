# 📌 ARG-WEB-BACKEND

## 🎯 Table of Contents
- [Overview](#️-overview)
- [Getting Started](#-getting-started)
- [Architecture](#-architecture)
- [API Documentation](#-api-documentation)
- [Type Generation](#-type-generation)
- [Development](#-development)
- [Testing](#-testing)
- [Deployment](#-deployment)

## 🛠️ Overview

ARG-WEB-BACKEND is a **NestJS-based application** that integrates **Sequelize, Redis, Swagger, and Jest** for building a scalable, modular backend. It is designed to provide a robust foundation for developing enterprise-level applications with a focus on performance, maintainability, and ease of use.

### 🔹 Key Features

- **Sequelize ORM** (with DB2 ODBC): Efficiently manage database operations with a powerful ORM.
- **Redis Caching**: Enhance performance with in-memory data storage and caching.
- **Swagger API Documentation**: Automatically generate and maintain API documentation.
- **Type Generation**: Generate TypeScript types from Swagger/OpenAPI specifications.
- **Winston Logging**: Implement comprehensive logging for better debugging and monitoring.
- **Jest for Testing**: Ensure code quality and reliability with a robust testing framework.

## 🚀 Getting Started

### **1️⃣ Prerequisites**

Ensure you have the following installed:

- **Node.js** (`v22.x` recommended)
- **Docker** and **Docker Compose**
- **Yarn** package manager
- **IBM i Access ODBC Driver** (if connecting to DB2)

### **2️⃣ Installation**

Clone the repository and install dependencies:

```sh
git clone https://AmericanRefiningGroup@dev.azure.com/AmericanRefiningGroup/AmericanRefiningGroup/_git/arg-web-backend
cd arg-web-backend
yarn
```

### **3️⃣ Environment Setup**

Create a `.env` file in the root directory with the following variables:

```env
NODE_ENV=development
PORT=5001
DB_HOST=your_db_host
DB_USER=your_db_user
DB_PASSWORD=your_db_password
REDIS_URL=redis://localhost:6379
```

### **4️⃣ Docker Setup**

1. **Start Redis Container**:
```sh
docker-compose up -d redis
```

2. **Build and Start Application**:
```sh
# Build the Docker image
docker build -t arg-web-backend .

# Run the container
docker run -p 5001:5001 --env-file .env arg-web-backend
```

Or use Docker Compose to start everything at once:
```sh
docker-compose up -d
```

To stop all containers:
```sh
docker-compose down
```

## 🏗️ Architecture

### **Directory Structure**

```
src/                           → Root directory containing all backend logic
│
├── main/                      → Main application modules
│   ├── account-payable/       → Account Payable module
│   │   ├── application/       → Application layer
│   │   │   ├── voucher/       → Voucher submodule
│   │   │   │   ├── controllers/
│   │   │   │   │   ├── voucher.controller.ts
│   │   │   │   │   └── voucher.controller.spec.ts
│   │   │   │   ├── usecases/
│   │   │   │   │   ├── add-voucher-entry/
│   │   │   │   │   │   ├── add-voucher-entry.use-case.ts
│   │   │   │   │   │   └── add-voucher-entry.use-case.spec.ts
│   │   │   │   │   ├── flexi-voucher-entry/
│   │   │   │   │   │   ├── add-voucher-entry.use-case.ts
│   │   │   │   │   │   └── add-voucher-entry.use-case.spec.ts
│   │   │   │   │   ├── delete-voucher-entry/
│   │   │   │   │   │   ├── delete-voucher-entry.use-case.ts
│   │   │   │   │   │   └── delete-voucher-entry.use-case.spec.ts
│   │   │   │   │   └── cancel-voucher-entry/
│   │   │   │   │       ├── cancel-voucher-entry.use-case.ts
│   │   │   │   │       └── cancel-voucher-entry.use-case.spec.ts
│   │   │   │   ├── shared-services/
│   │   │   │   │   └── voucher-shared.service.ts
│   │   │   │   ├── dto/
│   │   │   │   │   └── voucher.dto.ts
│   │   │   │   └── voucher.module.ts
│   │   │   │
│   │   │   └── purchase-journal/  → Purchase Journal submodule
│   │   │       ├── controllers/
│   │   │       │   ├── purchase-journal.controller.ts
│   │   │       │   └── purchase-journal.controller.spec.ts
│   │   │       ├── services/
│   │   │       │   └── add-voucher.service.ts
│   │   │       ├── usecases/
│   │   │       │   ├── add-invoice/
│   │   │       │   │   ├── add-invoice.use-case.ts
│   │   │       │   │   └── add-invoice.use-case.spec.ts
│   │   │       │   ├── delete-invoice/
│   │   │       │   │   ├── delete-invoice.use-case.ts
│   │   │       │   │   └── delete-invoice.use-case.spec.ts
│   │   │       │   └── cancel-invoice/
│   │   │       │       ├── cancel-invoice.use-case.ts
│   │   │       │       └── cancel-invoice.use-case.spec.ts
│   │   │       ├── dto/
│   │   │       │   └── purchase-journal.dto.ts
│   │   │       └── purchase-journal.module.ts
│   │   │
│   │   ├── domain/           → Domain layer
│   │   │   ├── entities/     → Domain entities
│   │   │   │   ├── vendor.entity.ts
│   │   │   │   ├── voucher.entity.ts
│   │   │   │   └── company.entity.ts
│   │   │   └── interface/    → Domain interfaces
│   │   │       ├── vendor.interface.ts
│   │   │       ├── voucher.interface.ts
│   │   │       └── company.interface.ts
│   │   │
│   │   ├── data/            → Data access layer
│   │   │   ├── models/      → Database models
│   │   │   │   ├── vendor.model.ts
│   │   │   │   ├── voucher.model.ts
│   │   │   │   └── company.model.ts
│   │   │   ├── repositories/ → Repository implementations
│   │   │   │   ├── vendor.repository.ts
│   │   │   │   ├── voucher.repository.ts
│   │   │   │   └── company.repository.ts
│   │   │   └── mappers/     → Data mappers
│   │   │       ├── vendor.mappers.ts
│   │   │       ├── voucher.mappers.ts
│   │   │       └── company.mappers.ts
│   │   │
│   │   └── account-payable.module.ts
│   │
│   └── shared/              → Shared resources
│       ├── cache/           → Caching mechanisms
│       ├── config/          → Configuration
│       │   ├── constants/   → Constants
│       │   │   └── table-registry.ts
│       │   ├── env-library-config.ts
│       │   └── model-initializer.ts
│       ├── infrastructure/  → Infrastructure setup
│       │   ├── odbc/       → ODBC configuration
│       │   │   └── odbc.ini
│       │   └── connection.ts
│       └── utils/          → Utility functions
│           ├── date-time.utils.ts
│           ├── string.utils.ts
│           └── number.utils.ts
│
├── types/                  → TypeScript type definitions
│   ├── sequelize.d.ts
│   └── types.ts
│
├── app.controller.ts      → Root controller
├── app.module.ts         → Root module
├── app.service.ts        → Root service
└── main.ts              → Application entry point

├── dist/                → Compiled output
├── docker-compose.yml   → Docker compose configuration
├── Dockerfile          → Docker configuration
├── eslint.config.mjs   → ESLint configuration
├── jest.config.ts      → Jest configuration
├── nest-cli.json       → NestJS CLI configuration
├── package.json        → Project dependencies
├── tsconfig.json       → TypeScript configuration
└── tsconfig.build.json → TypeScript build configuration
```

### **Architecture Overview**

The project follows a **Domain-Driven Design (DDD)** and **Clean Architecture** approach with the following layers:

1. **Application Layer** (`application/`)
   - Controllers: Handle HTTP requests
   - Use Cases: Implement business logic
   - DTOs: Data transfer objects
   - Shared Services: Business logic shared across use cases

2. **Domain Layer** (`domain/`)
   - Entities: Core business objects
   - Interfaces: Contracts for repositories and services

3. **Data Layer** (`data/`)
   - Models: Database models
   - Repositories: Data access implementations
   - Mappers: Convert between domain and data models

4. **Shared Layer** (`shared/`)
   - Configuration
   - Infrastructure
   - Utilities
   - Caching

### **Module Structure**

Each module (e.g., `account-payable`) follows this structure:
- Controllers for HTTP endpoints
- Use cases for business logic
- DTOs for data validation
- Domain entities and interfaces
- Data access implementations

## 📚 API Documentation

### **Swagger UI**

Access the Swagger API documentation at:
```
http://localhost:5001/api-docs
```

### **Generating API Documentation**

```sh
# Generate Swagger documentation
yarn generate:all
```

## 🔄 Type Generation

### **Generating Types from Swagger**

```sh
# Generate TypeScript types from Swagger
yarn generate:api-types
```

The generated types will be available in:
```
src/api-schemas/types/
```

## 💻 Development

### **Available Scripts**

```sh
# Start development server
yarn run start:dev

# Build the application
yarn run build

# Start production server
yarn run start:prod

# Run linting
yarn run lint

# Format code
yarn run format
```

## 🧪 Testing

### **Running Tests**

```sh
# Run unit tests
yarn run test
```

## 🐞 Debugging & IBM i Diagnostics

Refer to [docs/DEBUGGING.md](docs/DEBUGGING.md) for a deep dive into tracing requests through NestJS, Bull/BullMQ, Sequelize, and the IBM i (ODBC, RPG stored procedures, and spooled output queues). For symptom-specific incident guides (starting with 504 Gateway Timeouts) browse the [error playbooks](docs/errors/README.md). Need a tool-by-tool walkthrough to reproduce and fix the bug quickly? Use the [debugging workflows index](docs/debugging/workflows/README.md) for hands-on instructions that link VS Code sessions with IBM Navigator, Data Studio, ACS, and 5250/PDM evidence gathering.

## 📋 Delivery, QA, and IBM i Playbooks

Need to sign off on requirements, RPG migrations, or UAT? Start with the [delivery playbook index](docs/delivery/README.md) for role-specific checklists that map each operational responsibility (BRD approval, QA case review, go-live, etc.) to the exact modules, scripts, and IBM i assets inside this repo. When you need “which tool do I use?” guidance, jump to the [tool-specific delivery guides](docs/delivery/tools/README.md) that walk through the same tasks inside VS Code, IBM Navigator, IBM Data Studio, and 5250/PDM. Looking for a concrete example of a finished task? The [end-to-end example set](docs/delivery/examples/README.md) shows real scenarios with artifacts you can mirror.

## 🚀 Deployment

### **Environment-Specific Deployment**

The application supports multiple environments:
- Development (`dev`)
- Testing (`test`)
- User Acceptance Testing (`uat`)
- Production (`prod`)

Each environment has its own configuration in `env-library-config.ts`.

### **Deployment Steps**

1. Build the application:
```sh
yarn run build
```

2. For Docker deployment:
```sh
# Build the Docker image
docker build -t arg-web-backend .

# Run the container
docker run -p 5001:5001 --env-file .env arg-web-backend
```

## 📦 Package Management

### **Publishing Types**

To publish generated types to your package registry:

```sh
# Build types
yarn run types:build

# Publish types
yarn run types:publish
```

## 🔐 Security

- All API endpoints are protected with appropriate authentication
- Environment variables are used for sensitive data
- Input validation is implemented using DTOs
- Rate limiting is configured for API endpoints

## 👥 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request
