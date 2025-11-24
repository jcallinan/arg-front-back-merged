#!/bin/bash

# Auto-start development environment with intelligent detection
# This script can be added to your shell profile for ultimate magic!

PROJECT_NAME="arg-web-backend"
CONTAINER_NAME="arg-backend"

# Check if we're in the project directory
if [[ ! -f "docker-compose.dev.yml" ]]; then
    echo "❌ Not in $PROJECT_NAME directory. Please cd to the project first."
    exit 1
fi

# Check if Docker is running
if ! docker info >/dev/null 2>&1; then
    echo "❌ Docker is not running. Please start Docker Desktop first."
    exit 1
fi

# Check if container exists and is running
if [ "$(docker ps -q -f name=$CONTAINER_NAME)" ]; then
    echo "✅ Development environment is already running!"
    echo "🎯 Entering development container..."
    docker exec -it $CONTAINER_NAME bash
elif [ "$(docker ps -aq -f name=$CONTAINER_NAME)" ]; then
    echo "🔄 Starting existing container..."
    docker start $CONTAINER_NAME
    echo "⏳ Waiting for container to be ready..."
    sleep 10
    docker exec -it $CONTAINER_NAME bash
else
    echo "🚀 Setting up development environment for the first time..."
    echo "📦 Building containers and installing dependencies..."
    docker-compose -f docker-compose.dev.yml up -d --build
    echo "⏳ Waiting for dependencies to install..."
    sleep 30
    echo "🎯 Entering development container..."
    docker exec -it $CONTAINER_NAME bash
fi 