#!/bin/bash

echo "🛑 Stopping ARG Backend Development Environment..."

docker-compose -f docker-compose.yml down

echo "✅ Development environment stopped" 