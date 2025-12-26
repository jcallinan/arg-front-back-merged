#!/bin/bash

echo "🚀 Starting ARG Web Auth Development Environment..."

# Check if container is running
if [ "$(docker ps -q -f name=arg-web-auth)" ]; then
    echo "✅ Container is already running"
else
    echo "🔄 Starting container..."
    docker-compose -f docker-compose.yml up arg-web-auth redis -d --build
    echo "⏳ Waiting for dependencies to install..."
    echo "📦 Installing npm packages (this may take a minute)..."
    sleep 10
    # Wait for npm install to complete
    docker exec arg-web-auth bash -c "while [ ! -d /workspace/node_modules/@nestjs ]; do sleep 2; done" 2>/dev/null || sleep 20
    echo "✅ Dependencies installed!"
fi

echo "🎯 Entering development container..."
echo ""
echo "📋 Available commands:"
echo "  npm run build        - Build the application"
echo "  npm run start:dev    - Start with hot-reload (recommended)"
echo "  npm run start        - Start without hot-reload"
echo "  npm run start:debug  - Start with debugging"
echo ""
echo "💡 Tip: Run 'npm run build' first, then 'npm run start:dev'"
echo "💡 Press Ctrl+C to exit, then 'exit' to leave container"

# Enter the container
docker exec -it arg-web-auth bash 