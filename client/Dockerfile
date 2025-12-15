# ================================
# Smart Queue - Frontend Dockerfile
# ================================

# Stage 1: Build Angular app
FROM node:20-alpine AS build

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .
RUN npm run build

# Stage 2: Serve with Nginx
FROM nginx:alpine

# Copy nginx config
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copy built app
COPY --from=build /app/dist/smart-queue-client/browser /usr/share/nginx/html

EXPOSE 80

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=10s --retries=3 \
  CMD test -f /usr/share/nginx/html/index.html || exit 1

CMD ["nginx", "-g", "daemon off;"]

