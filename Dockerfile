# Build stage for frontend and admin
FROM node:18-alpine AS build

WORKDIR /app

# Copy package files
COPY package*.json ./
COPY frontend/package*.json ./frontend/
COPY admin/package*.json ./admin/
COPY backend/package*.json ./backend/

# Install dependencies
RUN npm run install-backend && npm run install-frontend && npm run install-admin

# Copy source code
COPY frontend ./frontend
COPY admin ./admin
COPY backend ./backend

# Build frontend and admin
RUN npm run build-frontend && npm run build-admin

# Production stage
FROM node:18-alpine AS production

WORKDIR /app

# Copy backend and builds
COPY --from=build /app/backend ./backend
COPY --from=build /app/frontend/build ./frontend/build
COPY --from=build /app/admin/build ./admin/build

# Install only production dependencies
WORKDIR /app/backend
RUN npm ci --only=production

EXPOSE 10000

CMD ["npm", "start"]
