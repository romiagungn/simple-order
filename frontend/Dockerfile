# --- STAGE 1: BUILD ---
FROM node:20-alpine AS builder

WORKDIR /app

ARG VITE_API_BASE_URL
ENV VITE_API_BASE_URL=$VITE_API_BASE_URL

COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

# --- STAGE 2: SERVER (Node.js + 'serve') ---
FROM node:20-alpine

WORKDIR /app

# Install 'serve' secara global di dalam image
RUN npm install -g serve

# Salin folder 'dist' (hasil build) dari stage 'builder'
COPY --from=builder /app/dist ./dist

# Ekspos port 3000 (port default 'serve')
EXPOSE 3000

# Perintah untuk menjalankan server
CMD ["serve", "-s", "dist", "-l", "3000"]