FROM node:slim AS builder

WORKDIR /app

COPY ./package-lock.json ./package-lock.json
COPY ./package.json ./package.json
COPY ./tsconfig.json ./tsconfig.json

RUN npm install

COPY ./src/ ./src/

RUN npm run build


FROM node:slim

WORKDIR /app

COPY ./package-lock.json ./package-lock.json
COPY ./package.json ./package.json

RUN npm install --only=production

COPY --from=builder /app/dist/ ./dist/

CMD ["node", "."]

EXPOSE 8080
