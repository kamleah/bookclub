# ------------------------
# Development Stage (Hot Reload)
# ------------------------
FROM node:22-alpine

WORKDIR /app

# Copy dependency files and install dependencies
COPY package*.json ./
RUN npm install

# Copy the rest of your app
COPY . .

# Environment variable to ensure file changes are detected
ENV CHOKIDAR_USEPOLLING=true

# Expose Vite dev server port
EXPOSE 5173

# Start the app with hot reload
CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0"]


# # ------------------------
# # Stage 2: Production build
# # ------------------------
# FROM node:22-alpine AS build

# WORKDIR /app
# COPY package*.json ./
# RUN npm install
# COPY . .
# RUN npm run build

# # ------------------------
# # Stage 3: Nginx serve (static)
# # ------------------------
# FROM nginx:1.27-alpine
# COPY --from=build /app/dist /usr/share/nginx/html
# EXPOSE 80
# CMD ["nginx", "-g", "daemon off;"]


# FROM node:22-alpine
# WORKDIR /app
# COPY package*.json ./
# RUN npm install
# COPY . .
# EXPOSE 5173
# CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0"]