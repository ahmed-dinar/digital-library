#!/bin/bash

# Build and run services using docker-compose
docker-compose up --build -d

# Wait for the services to start
sleep 10

docker-compose exec prisma migrate save --name initial

docker-compose exec prisma prisma migrate deploy

# Display logs for both services
docker-compose logs -f