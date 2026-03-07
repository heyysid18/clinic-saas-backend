FROM node:18-alpine

# Create app directory
WORKDIR /usr/src/app

# Install app dependencies
COPY package*.json ./
RUN npm install

# Bundle app source
COPY . .

# Expose port (5000 as requested via user compose mapping)
EXPOSE 5000

# Start command
CMD [ "npm", "run", "start" ]
