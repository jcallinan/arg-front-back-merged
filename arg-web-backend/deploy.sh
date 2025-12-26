
#!/bin/bash

# deploy.sh: Simple deployment script example

# Parameters
BUILD_ID=$1
ACR_USERNAME=$2
ACR_PASSWORD=$3

echo "Starting deployment for build: $BUILD_ID"

# Login to Azure Container Registry (ACR)
echo "Logging into Azure Container Registry..."
docker login myregistry.azurecr.io -u "$ACR_USERNAME" -p "$ACR_PASSWORD"
if [ $? -ne 0 ]; then
  echo "Docker login failed!"
  exit 1
fi

# Pull the new Docker image (replace with your image name and tag)
IMAGE_NAME="myregistry.azurecr.io/myapp"
IMAGE_TAG="$BUILD_ID"

echo "Pulling Docker image: $IMAGE_NAME:$IMAGE_TAG"
docker pull "$IMAGE_NAME:$IMAGE_TAG"
if [ $? -ne 0 ]; then
  echo "Failed to pull Docker image!"
  exit 1
fi

# Stop and remove the old container (replace 'myapp-container' with your container name)
echo "Stopping old container..."
docker stop myapp-container || true
docker rm myapp-container || true

# Run the new container
echo "Starting new container..."
docker run -d --name myapp-container -p 80:80 "$IMAGE_NAME:$IMAGE_TAG"

if [ $? -eq 0 ]; then
  echo "Deployment successful!"
else
  echo "Deployment failed!"
  exit 1
fi

