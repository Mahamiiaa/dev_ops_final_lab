# ===== Build Stage =====
FROM node:18-alpine AS builder

WORKDIR /app

# Copy dependency files
COPY package*.json ./

# Install ALL dependencies (including devDependencies needed for build)
RUN npm install

# Copy source and build
COPY . .
RUN npm run build

# ===== Production Stage =====
FROM nginx:1.25-alpine

# Copy nginx config
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copy built static files from builder stage
COPY --from=builder /app/dist /usr/share/nginx/html

# Nginx listens on 80 by default
EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]