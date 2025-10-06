FROM node:22-alpine

WORKDIR /app

# Create uploads folder
RUN mkdir -p /app/uploads

COPY package*.json ./
RUN npm install

COPY . .

RUN npx prisma generate

EXPOSE 3000

# Run Prisma migrations before starting Fastify server
CMD sh -c "npx prisma migrate deploy && node index.js"
