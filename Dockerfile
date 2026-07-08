# Multi-stage build for TapTask

# Stage 1: Build backend
FROM node:20-alpine AS backend-builder
WORKDIR /app
COPY package*.json ./
COPY packages/backend/package*.json packages/backend/
RUN npm ci --workspaces
COPY packages/backend packages/backend/
RUN cd packages/backend && npm run build

# Stage 2: Build frontend
FROM node:20-alpine AS frontend-builder
WORKDIR /app
COPY package*.json ./
COPY packages/frontend/package*.json packages/frontend/
RUN npm ci --workspaces --omit=dev
COPY packages/frontend packages/frontend/
RUN cd packages/frontend && npm run build

# Stage 3: Production runtime
FROM node:20-alpine
WORKDIR /app

# Install dumb-init to handle signals properly
RUN apk add --no-cache dumb-init

# Copy backend from builder
COPY --from=backend-builder /app/packages/backend/dist /app/backend/dist
COPY --from=backend-builder /app/packages/backend/package*.json /app/backend/
RUN cd /app/backend && npm ci --omit=dev

# Copy frontend from builder
COPY --from=frontend-builder /app/packages/frontend/dist /app/frontend/dist

# Create data directory
RUN mkdir -p /app/data

# Environment variables
ENV NODE_ENV=production
ENV PORT=3000

EXPOSE 3000

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
  CMD node -e "require('http').get('http://localhost:3000/health', (r) => {if (r.statusCode !== 200) throw new Error(r.statusCode)})"

ENTRYPOINT ["/usr/sbin/dumb-init", "--"]
CMD ["node", "/app/backend/dist/index.js"]
