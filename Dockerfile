# Use the official Node.js image
FROM node:18

# Set the working directory
WORKDIR /usr/src/app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application code
COPY . .

# Install ngrok globally
#RUN npm install -g ngrok

# Set the ngrok auth token
#RUN ngrok config add-authtoken 2kVig7mAohx5kdCIWmlrdf0UOAC_2y1dsr28t4BE8VSQkLvbF

# Expose the application port
EXPOSE 3000

# Start the application
CMD ["node", "server.mjs"]
