#!/bin/bash

# Start the Docker database container
docker-compose -f docker-compose-db.yml up -d

# Wait for database to initialize (adjust sleep time according to your setup)
sleep 15

# Change directory to server and execute commands
cd server

# Install server dependencies
yarn install

# Run Prisma migration
npx prisma migrate dev --name init

# Start the server
yarn run start:dev &

# Change directory to client and execute commands
cd ../client

# Install client dependencies
yarn install

# Start the client
yarn dev
