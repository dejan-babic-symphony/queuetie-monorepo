# Base image
FROM node:22.12.0-alpine3.21 AS development

# Set working directory
WORKDIR /usr/src/app

# Copy dependency files
COPY --chown=node:node package*.json ./

# Install dependencies
# RUN npm ci --only=production
RUN npm ci --include=dev

# Copy the entire monorepo, but build only the necessary app
COPY --chown=node:node . .

# Build the specific app
ARG APP_NAME
RUN npm run build ${APP_NAME}

# Production image
FROM node:22.12.0-alpine3.21 AS production

USER node

# Set working directory
WORKDIR /usr/src/app

# Copy build output and dependencies
COPY --from=development /usr/src/app/dist ./dist
COPY package.json package-lock.json ./

# Install only production dependencies
RUN npm ci --only=production

# Expose app port
EXPOSE 3000 9229

# Command to run the app
CMD ["node", "dist/main.js"]
