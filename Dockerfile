FROM node:20-alpine as builder

RUN npm install -g pnpm

COPY . .

RUN pnpm install

RUN pnpm build

FROM node:20-alpine as runner

COPY --from=builder dist/app.js app.js

CMD ["node", "app.js"]
