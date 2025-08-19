# Stage 1: Build the Vite React app
FROM node:20-alpine AS build

WORKDIR /app

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
