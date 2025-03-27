# Adjust NODE_VERSION as desired
ARG NODE_VERSION=20.0.0
FROM node:20-alpine AS base

WORKDIR /app

# Set production environment
ENV NODE_ENV="production"

# Install pnpm
RUN npm install -g pnpm

# Throw-away build stage to reduce size of final image
FROM base AS build

# Install node modules
COPY package.json pnpm-lock.yaml ./
RUN pnpm install --prod=false

# Copy application code
COPY . .

# Build application
RUN pnpm run build

# Remove development dependencies
# RUN pnpm prune --prod

# Final stage for app image
FROM base

# Copy built application
COPY --from=build /app /app

# Start the server by default, this can be overwritten at runtime
EXPOSE 3000
CMD [ "pnpm", "run", "start" ]
