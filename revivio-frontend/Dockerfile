# Stage 1: Build React application using Node 20
FROM node:20-alpine AS builder

WORKDIR /app

# Cache package dependencies
COPY package.json package-lock.json ./
RUN npm ci

# Copy source and compile bundle
COPY . .
RUN npm run build

# Stage 2: Serve optimized assets via Nginx
FROM nginx:1.25-alpine AS runner

# Remove default nginx welcome page
RUN rm -rf /usr/share/nginx/html/*

# Copy build artifacts and custom reverse-proxy config
COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
