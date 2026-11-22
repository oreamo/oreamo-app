FROM node:25-slim AS builder

WORKDIR /app

# Step 1. Install pnpm
RUN npm install -g pnpm@12.3.4

# Step 2. Install dependencies
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
RUN pnpm install --frozen-lockfile --ignore-scripts

# Step 3. Build the application
COPY . .

ARG VITE_API_URL
RUN pnpm build

# Step 4. Serve the build with nginx
FROM nginx:alpine

COPY docker/nginx/default.conf /etc/nginx/conf.d/default.conf
COPY --from=builder /app/dist /usr/share/nginx/html

EXPOSE 3000
