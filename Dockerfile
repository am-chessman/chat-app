# Use official Node.js image
FROM node:18-alpine

# Set working directory
WORKDIR /app

# Copy package files first for better caching
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy all application files
COPY . .

# Build the app (if needed)
# RUN npm run build

# Expose the application port
EXPOSE 3000

# Set environment variables
ENV DB_HOST=db
ENV DB_PORT=5432
ENV DB_USER=postgres
ENV DB_PASSWORD=chessman
ENV DB_NAME=chat_app

# Command to run the application
CMD ["npm", "start"]