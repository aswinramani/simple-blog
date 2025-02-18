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

# Expose port 4200 for the Angular development server
EXPOSE 4200

# Run the command to start the Angular development server
CMD ["npm", "run", "start:local"]
