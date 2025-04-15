# Stage 1: Dependencies installation
FROM docker.io/node:lts-alpine as deps
RUN apk add --no-cache libc6-compat
WORKDIR /usr/src/app
COPY package.json package-lock.json ./
RUN npm install --only=production

FROM docker.io/node:lts-alpine as builder
WORKDIR /usr/src/app

COPY . ./
RUN npm install


RUN npx nx run-many -t build


FROM docker.io/node:lts-alpine as production
RUN apk add --no-cache dumb-init

ENV NODE_ENV production
ENV PORT 3000
ENV HOST 0.0.0.0
ENV NEXT_TELEMETRY_DISABLED 1

WORKDIR /app

RUN addgroup --system management && \
    adduser --system -G management management

COPY --from=builder /usr/src/app/dist/apps/management ./management/

RUN chown -R management:management ./management

WORKDIR /app/management
RUN npm install --omit=dev --production

USER management

CMD [ "node", "." ]
