# Stage 1: Build Stage (Handles installation)
# Uses a lean Node.js image with Alpine Linux for minimal size
FROM node:20-alpine AS builder

# Set the working directory inside the container
WORKDIR /usr/src/app

# Copy the package files first to leverage Docker's build cache
COPY package*.json ./

# Install only production dependencies (excluding devDependencies like nodemon)
# 'npm ci' ensures a clean, repeatable install based on package-lock.json
RUN npm ci --omit=dev

# Copy the rest of the application code
COPY . .

# --- Stage 2: Production Runtime Stage (Smallest possible image) ---
# Start from a fresh, clean base image
FROM node:20-alpine

# Set the final working directory
WORKDIR /usr/src/app

# Copy only the production node_modules from the builder stage
COPY --from=builder /usr/src/app/node_modules ./node_modules
# Copy the application files (like server.js)
COPY --from=builder /usr/src/app .

# Expose the port. Your app listens on 5000 based on your .env/config.
EXPOSE 5000

# Define the command to run the application when the container starts.
# This uses your "start" script: "start": "node server.js"
CMD ["npm", "start"]