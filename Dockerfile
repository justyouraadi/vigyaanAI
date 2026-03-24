# Stage 1: Build the React app
FROM node:23-alpine AS build

WORKDIR /app

# Enable corepack to make yarn available
RUN corepack enable

# Copy dependency files
COPY package.json yarn.lock ./

# Install dependencies
RUN yarn install --frozen-lockfile

# Copy the rest of the application source
COPY . .

# Build the production bundle
RUN yarn build

# Stage 2: Serve with a lightweight static server
FROM node:23-alpine

WORKDIR /app

# Enable corepack to make yarn available
RUN corepack enable

# Install 'serve' globally to serve static files
RUN yarn global add serve

# Copy the build output from the build stage
COPY --from=build /app/build ./build

# Expose port 8002
EXPOSE 8002

# Serve the build folder on port 8002
CMD ["serve", "-s", "build", "-l", "8002"]