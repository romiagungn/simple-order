# --- STAGE 1: BUILD ---
FROM node:20-alpine AS builder
WORKDIR /app

# Salin package.json dan package-lock.json (atau yarn.lock)
COPY package*.json ./

# Salin tsconfig.json (penting agar 'tsc' tahu cara kerjanya)
COPY tsconfig.json ./

# Instal SEMUA dependensi
RUN npm install

# Salin sisa source code
COPY . .

# Jalankan script 'build' (tsc)
RUN npm run build

# --- STAGE 2: PRODUCTION ---
FROM node:20-alpine

WORKDIR /app

# Salin package.json
COPY package*.json ./

# Instal HANYA dependensi production
RUN npm install --production

# Salin folder 'dist' (hasil build) dari stage 'builder'
COPY --from=builder /app/dist ./dist

# Ekspos port yang digunakan aplikasi
EXPOSE 5001

# Perintah untuk menjalankan aplikasi
CMD ["npm", "start"]