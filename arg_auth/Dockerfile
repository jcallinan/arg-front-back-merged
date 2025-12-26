# Use an official Node.js image as the base with platform specification
FROM node:22-bullseye

# Set the working directory inside the container
WORKDIR /app

# Copy package.json and package-lock.json to leverage Docker layer caching
COPY package*.json ./

# Install Node.js dependencies
RUN npm install

# Copy the rest of the application files
COPY . .

# Build the NestJS application
RUN npm run build

# Install PM2 globally
RUN npm install -g pm2

# Copy and make entrypoint script executable
COPY docker-entrypoint.sh /usr/local/bin/
RUN chmod +x /usr/local/bin/docker-entrypoint.sh

# Expose the application port
EXPOSE 8000

# Use entrypoint script to run migrations/seeders before starting the app
ENTRYPOINT ["docker-entrypoint.sh"]

# Run the app using PM2 in cluster mode on all CPU cores
CMD ["pm2-runtime", "dist/src/main.js", "-i", "max"]
