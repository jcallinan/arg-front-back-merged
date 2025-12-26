#!/bin/bash

# Exit immediately if a command exits with a non-zero status
set -e

# Get the environment from NODE_ENV, default to 'dev' if not set
ENV=${NODE_ENV:-dev}

# Map NODE_ENV to sequelize environment names
# Supported environments: dev, test, uat, prod
if [ "$ENV" = "dev" ]; then
  SEQUELIZE_ENV="dev"
elif [ "$ENV" = "test" ]; then
  SEQUELIZE_ENV="test"
elif [ "$ENV" = "uat" ]; then
  SEQUELIZE_ENV="uat"
elif [ "$ENV" = "prod" ]; then
  SEQUELIZE_ENV="prod"
else
  echo "⚠️  Warning: Unknown NODE_ENV='$ENV'. Supported values: dev, test, uat, prod. Defaulting to 'dev'."
  SEQUELIZE_ENV="dev"
fi

echo "🚀 Starting deployment process..."
echo "📋 Environment: $ENV"
echo "📋 Sequelize Environment: $SEQUELIZE_ENV"

# Wait for database to be ready (retry up to 30 times with 2 second intervals = 60 seconds max)
echo "⏳ Waiting for database to be ready..."
MAX_RETRIES=30
RETRY_COUNT=0
DB_READY=false

until npx sequelize-cli db:migrate:status --env "$SEQUELIZE_ENV" > /dev/null 2>&1 || [ $RETRY_COUNT -ge $MAX_RETRIES ]; do
  RETRY_COUNT=$((RETRY_COUNT + 1))
  echo "   Database not ready, waiting 2 seconds... (attempt $RETRY_COUNT/$MAX_RETRIES)"
  sleep 2
done

# Verify database connection was established
if npx sequelize-cli db:migrate:status --env "$SEQUELIZE_ENV" > /dev/null 2>&1; then
  echo "✅ Database is ready and connected"
  DB_READY=true
else
  echo "❌ ERROR: Could not establish database connection after $MAX_RETRIES attempts"
  echo "   Please check your database configuration and ensure the database is running"
  exit 1
fi

# Only proceed if database is ready
if [ "$DB_READY" = true ]; then
  # Run migrations (must succeed before seeders)
  echo "🔁 Running database migrations..."
  if npx sequelize-cli db:migrate --env "$SEQUELIZE_ENV"; then
    echo "✅ Migrations completed successfully"
  else
    echo "❌ ERROR: Migrations failed. Aborting startup."
    exit 1
  fi

  # Run seeders (must succeed before starting application)
  echo "🌱 Running seeders..."
  if npx sequelize-cli db:seed:all --env "$SEQUELIZE_ENV"; then
    echo "✅ Seeders completed successfully"
  else
    echo "❌ ERROR: Seeders failed. Aborting startup."
    exit 1
  fi

  echo "✅ All database setup completed successfully"
else
  echo "❌ ERROR: Database not ready. Cannot proceed with migrations and seeders."
  exit 1
fi

# Start the application
echo "🚀 Starting application..."
exec "$@"
