FROM node:20-alpine as builder

COPY . .

RUN npm install -g pnpm

RUN pnpm install

RUN pnpm build

FROM node:20-alpine as runner

COPY --from=builder dist/app.js app.js

CMD ["node", "app.js"]
