#!/bin/bash

echo "🚀 Starting ARG Backend Development Environment..."

# Check SSH environment variables (only these 4 are required)
echo ""
echo "📁 File Upload Configuration:"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

SSH_VARS_SET=0
SSH_VARS_MISSING=0

echo "🔍 Checking SSH environment variables..."

if [ -n "$SSH_PASSWORD" ]; then
    echo "   ✅ SSH_PASSWORD: Set"
    SSH_VARS_SET=$((SSH_VARS_SET + 1))
else
    echo "   ⚠️  SSH_PASSWORD: Not set"
    SSH_VARS_MISSING=$((SSH_VARS_MISSING + 1))
fi

if [ -n "$SSH_USER" ]; then
    echo "   ✅ SSH_USER: Set"
    SSH_VARS_SET=$((SSH_VARS_SET + 1))
else
    echo "   ⚠️  SSH_USER: Not set"
    SSH_VARS_MISSING=$((SSH_VARS_MISSING + 1))
fi

if [ -n "$SSH_HOST" ]; then
    echo "   ✅ SSH_HOST: Set"
    SSH_VARS_SET=$((SSH_VARS_SET + 1))
else
    echo "   ⚠️  SSH_HOST: Not set"
    SSH_VARS_MISSING=$((SSH_VARS_MISSING + 1))
fi

if [ -n "$SSH_REMOTE_PATH" ]; then
    echo "   ✅ SSH_REMOTE_PATH: Set"
    SSH_VARS_SET=$((SSH_VARS_SET + 1))
else
    echo "   ⚠️  SSH_REMOTE_PATH: Not set"
    SSH_VARS_MISSING=$((SSH_VARS_MISSING + 1))
fi

echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

# Verify SSH connection if all variables are set
if [ $SSH_VARS_MISSING -eq 0 ]; then
    echo "🧪 Testing SSH connection to ARG Dev server..."
    
    if sshpass -p "$SSH_PASSWORD" ssh -o ConnectTimeout=10 -o StrictHostKeyChecking=no ${SSH_USER}@${SSH_HOST} "echo 'Connection test successful'" >/dev/null 2>&1; then
        echo "✅ Successfully connected to ARG Dev server!"
        echo "📁 Files will be saved to: ${SSH_USER}@${SSH_HOST}:${SSH_REMOTE_PATH}"
    else
        echo "⚠️  Warning: Could not connect to ARG Dev server"
        echo "💡 Your application will still work, but files won't be saved to the remote server"
        echo "💡 Check your network connection and SSH credentials"
    fi
elif [ $SSH_VARS_SET -gt 0 ]; then
    echo "⚠️  Some SSH environment variables are missing ($SSH_VARS_MISSING of 4)"
    echo "💡 Set the following in your terminal before running this script:"
    echo ""
    echo "   export SSH_PASSWORD=\"your_ssh_password\""
    echo "   export SSH_USER=\"administrator\""
    echo "   export SSH_HOST=\"172.16.30.10\""
    echo "   export SSH_REMOTE_PATH=\"/srv/samba/share/G-Drive\""
    echo ""
    echo "💡 Your application will still work, but files won't be saved to the remote server"
else
    echo "⚠️  SSH environment variables are not set (optional for local development)"
    echo "💡 To enable file uploads to remote server, set these variables in your terminal:"
    echo ""
    echo "   export SSH_PASSWORD=\"your_ssh_password\""
    echo "   export SSH_USER=\"administrator\""
    echo "   export SSH_HOST=\"172.16.30.10\""
    echo "   export SSH_REMOTE_PATH=\"/srv/samba/share/G-Drive\""
    echo ""
    echo "💡 Your application will still work without these variables"
fi

# Check if container is running
echo ""
if [ "$(docker ps -q -f name=arg-backend)" ]; then
    echo "✅ Container is already running"
else
    echo "🔄 Starting container..."
    docker-compose -f docker-compose.yml up arg-backend-dev upload-worker-dev redis -d --build
    echo "⏳ Waiting for dependencies to install..."
    sleep 30
fi

echo "🎯 Entering development container..."
echo "💡 Run 'npm run start:dev' to start the application with hot-reload"
echo "💡 Run 'npm run start' for regular start"
echo "💡 Press Ctrl+C to exit, then 'exit' to leave container"

# Enter the container
docker exec -it arg-backend-dev bash