# ================================
# Smart Queue - Backend Dockerfile
# ================================
FROM node:20-alpine

WORKDIR /app

# Install dependencies
COPY package*.json ./
RUN npm ci

# Copy source code
COPY . .

# Expose port
EXPOSE 5000

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=40s --retries=5 \
  CMD node -e "require('http').get('http://localhost:5000/api/health', (r) => process.exit(r.statusCode === 200 ? 0 : 1))"

# Start
CMD ["npm", "start"]

