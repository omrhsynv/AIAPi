FROM node:20-alpine AS development-dependencies-env
RUN apk add --no-cache openssl
COPY . /app
WORKDIR /app
RUN npm ci

FROM node:20-bookworm-slim AS migrate-env
RUN apt-get update \
	&& apt-get install -y --no-install-recommends openssl ca-certificates \
	&& rm -rf /var/lib/apt/lists/*
COPY . /app
WORKDIR /app
RUN npm ci

FROM node:20-bookworm-slim AS production-dependencies-env
RUN apt-get update \
	&& apt-get install -y --no-install-recommends openssl ca-certificates \
	&& rm -rf /var/lib/apt/lists/*
COPY ./package.json package-lock.json /app/
WORKDIR /app
RUN npm ci --omit=dev

FROM node:20-bookworm-slim AS build-env
RUN apt-get update \
	&& apt-get install -y --no-install-recommends openssl ca-certificates \
	&& rm -rf /var/lib/apt/lists/*
COPY . /app/
COPY --from=development-dependencies-env /app/node_modules /app/node_modules
WORKDIR /app
RUN npx prisma generate
RUN npm run build

FROM node:20-bookworm-slim
RUN apt-get update \
	&& apt-get install -y --no-install-recommends openssl ca-certificates \
	&& rm -rf /var/lib/apt/lists/*
COPY ./package.json package-lock.json /app/
COPY --from=production-dependencies-env /app/node_modules /app/node_modules
COPY --from=build-env /app/node_modules/.prisma /app/node_modules/.prisma
COPY --from=build-env /app/node_modules/@prisma /app/node_modules/@prisma
COPY --from=build-env /app/build /app/build
WORKDIR /app
CMD ["npm", "run", "start"]