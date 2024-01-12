# Builder stage
FROM node:20-alpine as builder

COPY . .

RUN pnpm install

RUN pnpm build

# Runner stage
FROM --platform=linux/arm64 node:20-alpine as runner

COPY --from=builder dist/app.js app.js

CMD ["node", "app.js"]
