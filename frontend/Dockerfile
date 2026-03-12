# ┌─────────────────────────────────────────────────────────────────────────────┐
# │  frontend/Dockerfile  —  multi-stage build (Vite)                         │
# │                                                                           │
# │  Stage 1 (builder) : Node → npm ci → npm run build                       │
# │  Stage 2 (runtime) : nginx → serve the built static files                │
# └─────────────────────────────────────────────────────────────────────────────┘

# ── Stage 1: Build ────────────────────────────────────────────────────────────
FROM node:20-alpine AS builder

WORKDIR /app

# Declare build argument (passed from docker-compose build.args)
ARG VITE_API_URL=http://localhost:8000
ENV VITE_API_URL=$VITE_API_URL

# Install dependencies first (better layer caching)
COPY package.json package-lock.json ./
RUN npm ci --silent

# Copy source and build (VITE_* env vars are baked in at build time)
COPY . .
RUN npm run build


# ── Stage 2: Serve with nginx ──────────────────────────────────────────────────
FROM nginx:1.27-alpine AS runtime

# Remove default nginx config
RUN rm /etc/nginx/conf.d/default.conf

# Copy our custom nginx config
COPY nginx.conf /etc/nginx/conf.d/app.conf

# Copy the production build from stage 1
COPY --from=builder /app/dist /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
