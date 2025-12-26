# Startup Walkthrough for ARG Application

This guide explains how to start the backend, authentication service, and frontend applications required to run the automated tests.

## Prerequisites

- Node.js (v18+ recommended)
- Docker Desktop (for containerized backend/auth if using Dev Containers)
- Git

## 0. Start Redis (Critical Dependency)

Redis is required for the backend and caching. You must run it locally for tests to work.

1.  Open a terminal.
2.  Navigate to the backend directory:
    ```bash
    cd arg-web-backend
    ```
3.  Start Redis in the background:
    ```bash
    docker-compose -f docker-compose.yml up -d redis
    ```
    *This starts Redis on localhost:6379.*

## 1. Start the Backend Service (`arg-web-backend`)

The backend service runs on port **5001**.

1.  Open a terminal.
2.  Navigate to the backend directory:
    ```bash
    cd arg-web-backend
    ```
3.  Install dependencies (first time only):
    ```bash
    npm install
    ```
4.  Start the server:
    ```bash
    npm run dev
    ```
    *Alternatively, if using VS Code Dev Containers, open the folder in container and it may auto-start or press F5.*

**Verification:**
Open [http://localhost:5001/health-check](http://localhost:5001/health-check) in your browser. You should see a success response.

---

## 2. Start the Auth Service (`arg_auth`)

The auth service runs on port **8000**.

1.  Open a **new** terminal tab/window.
2.  Navigate to the auth directory:
    ```bash
    cd arg_auth
    ```
3.  Install dependencies (first time only):
    ```bash
    npm install
    ```
4.  Start the server:
    ```bash
    npm run dev
    ```

**Verification:**
Open [http://localhost:8000/health-check](http://localhost:8000/health-check) (if available) or check the console logs for "Nest application successfully started".

---

## 3. Start the Frontend Application (`arg-web-frontend`)

The frontend application typically runs on port **5173**.

1.  Open a **new** terminal tab/window.
2.  Navigate to the frontend directory:
    ```bash
    cd arg-web-frontend
    ```
3.  Install dependencies (first time only):
    ```bash
    npm install
    ```
4.  Start the development server:
    ```bash
    npm run dev
    ```

**Verification:**
Check the terminal output for the local URL (usually `http://localhost:5173`). Open it in your browser to verify the app loads.

---

## 4. Run Automated Tests (`arg-automated-tests`)

Once all three services are running, you can proceed to run the Selenium automation tests.

1.  Open a **new** terminal.
2.  Navigate to the test project:
    ```bash
    cd arg-automated-tests
    ```
3.  Run the tests using Maven:
    ```bash
    mvn clean test
    ```

**Note:** Ensure the base URL in your test configuration matches the running frontend URL (e.g., `http://localhost:5173`).
