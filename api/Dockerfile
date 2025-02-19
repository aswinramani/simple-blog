# Use an official Node.js 18 image as a base
FROM node:18

# Set the working directory to /app
WORKDIR /app

# Copy the package*.json files to the working directory
COPY package*.json ./

# Install the dependencies
RUN npm install

# Copy the application code to the working directory
COPY . .

# Expose port 3010 for the NestJS development server
EXPOSE 3010

# Run the command to start the NestJS development server
CMD ["npm", "run", "start:docker"]