# Use the official Node.js image as a base image
FROM node:17

# Set the working directory in the container
WORKDIR /usr/src/app

# Copy package.json and package-lock.json to the working directory
COPY package*.json ./

# Install the project dependencies
RUN npm install

# Copy the entire application to the container
COPY . .

RUN npx prisma generate

RUN yarn build

# Expose the port your application runs on
EXPOSE 3000

# Command to run your application
CMD ["npm", "run", "start:migrate:prod"]
