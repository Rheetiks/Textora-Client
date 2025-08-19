# Stage 1: Build the Vite React app
FROM node:20-alpine AS build

WORKDIR /app

# Define build arguments for environment variables
ARG VITE_API_URL
ARG VITE_PARTYKIT_HOST

# Set environment variables during the build process
ENV VITE_API_URL=$VITE_API_URL
ENV VITE_PARTYKIT_HOST=$VITE_PARTYKIT_HOST

# Copy package.json and package-lock.json / yarn.lock
COPY package*.json ./

# Install dependencies
RUN npm ci --legacy-peer-deps

# Copy all source files
COPY . .

# Build the Vite app
RUN npm run build

# Stage 2: Serve the built app using NGINX
FROM nginx:1.27-alpine

# Copy the built files from the build stage
COPY --from=build /app/dist /usr/share/nginx/html

# Optional: Replace default nginx config for SPA routing
# This ensures React Router works without 404 issues
RUN rm /etc/nginx/conf.d/default.conf
COPY nginx.conf /etc/nginx/conf.d

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
