FROM node:lts-alpine AS base
WORKDIR /app
COPY package*.json ./
COPY nx.json .
COPY tsconfig.base.json .
RUN npm install

FROM base AS build
WORKDIR /app
ARG VITE_SIMULATION_URL=http://localhost:4000
ARG VITE_MANAGEMENT_URL=http://localhost:3000
ENV VITE_SIMULATION_URL=$VITE_SIMULATION_URL
ENV VITE_MANAGEMENT_URL=$VITE_MANAGEMENT_URL
COPY . .
RUN npx nx run frontend:build --configuration=production

FROM node:lts-alpine AS production
WORKDIR /app

COPY --from=build /app/dist/apps/frontend ./dist

RUN npm install -g serve

EXPOSE 3000

CMD ["serve", "-s", "dist", "-l", "3000"]
