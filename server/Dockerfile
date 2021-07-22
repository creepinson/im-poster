FROM creepinson/alpine-pnpm

WORKDIR /app
COPY . .
RUN pnpm install
RUN pnpm run build
EXPOSE 8000
CMD ["pnpm", "run", "start"]