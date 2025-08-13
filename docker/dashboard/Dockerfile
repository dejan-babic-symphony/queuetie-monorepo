# Stage 1: Build the Vite React App
FROM node:22-alpine as development

ENV VITE_ENV_EXAMPLE="PLACEHOLDER_VITE_ENV_EXAMPLE"

# Set the working directory in the container
WORKDIR /app

# Copy dependency files
COPY --chown=node:node package*.json ./

# Install application dependencies and update OS packages
RUN apk update && apk upgrade && npm ci --include=dev

# Copy the rest of your application code to the container
COPY apps/dashboard .

# Copy env file
COPY .env.docker .

COPY tsconfig.json .

# Build the Vite React App
RUN npm run build:dashboard

# Stage 2: Create the production-ready Nginx image
FROM nginx:alpine

RUN apk update && apk upgrade && apk add --upgrade expat

# Copy entrypoint scripts
COPY ./docker/dashboard/scripts/entrypoint.sh /entrypoint.sh
RUN chmod +x /entrypoint.sh

WORKDIR /usr/share/nginx/html/

# Copy the dist (built) Vite React App from the build stage to the Nginx container
COPY --from=development /app/dist .

COPY  ./docker/dashboard/scripts/nginx/default.conf /etc/nginx/conf.d/

# Expose port 80
EXPOSE 80

# Replace Runtime ENV vars and start Nginx when the container runs
ENTRYPOINT ["/entrypoint.sh"]
