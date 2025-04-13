# Stage 1: Base Builder
FROM node:lts-alpine AS base
WORKDIR /app
COPY package*.json ./
COPY nx.json .
COPY tsconfig.base.json .
RUN npm install

# Stage 2: Build React App
FROM base AS build
WORKDIR /app
COPY . .
RUN npx nx run frontend:build --configuration=production

# Stage 3: Production with Serve
FROM node:lts-alpine AS production
WORKDIR /app

# Copy the build output from the Nx build stage
COPY --from=build /app/dist/apps/frontend ./dist

# Install a lightweight HTTP static file server
RUN npm install -g serve

# Expose the port Serve will run on
EXPOSE 3000

# Start the app using serve
CMD ["serve", "-s", "dist", "-l", "3000"]
