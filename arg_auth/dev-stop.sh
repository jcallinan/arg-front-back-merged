#!/bin/bash

echo "🛑 Stopping ARG web auth Development Environment..."

docker-compose -f docker-compose.yml down

echo "✅ Development environment stopped" 