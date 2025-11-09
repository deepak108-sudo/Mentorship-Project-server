# Stage 1: Build Stage (Handles dependency installation)
FROM node:20-alpine AS builder

# Set the working directory
WORKDIR /usr/src/app

# Copy package.json and install all production dependencies
# This is done first to leverage Docker's build cache
COPY package*.json ./
RUN npm ci --omit=dev

# Copy the rest of the application code (including index.js)
COPY . .

# --- Stage 2: Production Runtime Stage (Creates the smallest final image) ---
FROM node:20-alpine

# Set the final working directory
WORKDIR /usr/src/app

# Copy only the necessary node_modules and code from the builder stage
COPY --from=builder /usr/src/app/node_modules ./node_modules
COPY --from=builder /usr/src/app .

# Expose the port your Gateway listens on (e.g., 5000)
EXPOSE 5000

# Define the command to run the application (assuming your package.json has a "start" script)
CMD ["npm", "start"]