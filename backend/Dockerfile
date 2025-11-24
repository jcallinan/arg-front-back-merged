# Use an official Node.js image as the base with platform specification
FROM node:22-bullseye

# Set the working directory inside the container
WORKDIR /app

# Install dependencies for ODBC
RUN apt-get update && apt-get install -y \
    build-essential \
    libodbc1 \
    odbcinst \
    unixodbc \
    unixodbc-dev \
    curl \
    git \
    gettext \
    lsb-release \
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/*

# Install IBM i Access ODBC driver
RUN curl https://public.dhe.ibm.com/software/ibmi/products/odbc/debs/dists/1.1.0/ibmi-acs-1.1.0.list | tee /etc/apt/sources.list.d/ibmi-acs-1.1.0.list
RUN apt-get update && apt-get install -y ibm-iaccess

# Create ODBC configuration directory if it doesn't exist
RUN mkdir -p /etc/odbc

# Copy package.json and package-lock.json to leverage Docker layer caching
COPY package*.json ./

# Install Node.js dependencies
RUN npm install

# Copy the rest of the application files
COPY . .

# Copy and configure ODBC settings
COPY ./src/shared/infrastructure/odbc/odbc.ini /etc/odbc.ini
RUN chmod 644 /etc/odbc.ini

# Build the NestJS application
RUN npm run build

# Install PM2 globally
RUN npm install -g pm2

# Expose the application port
EXPOSE 5001

# Run the app using PM2 in cluster mode on all CPU cores
CMD ["pm2-runtime", "dist/src/main.js", "-i", "max"]
