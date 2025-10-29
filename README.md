# 📋 Simple Orders App Monorepo

Oleh: **Romie Agung Nugraha**

Aplikasi sederhana untuk manajemen produk dan pesanan. Proyek ini diatur sebagai **Monorepo** dengan backend **Express.js** dan frontend **React.js**.

## ✨ Fitur Utama

- **Autentikasi**: Login dan Register (dengan JWT).
- **Produk**: Melihat daftar produk, menambahkan produk baru (untuk kemudahan testing), dan mengelola stok.
- **Pesanan**: Membuat pesanan baru (keranjang) dan melihat riwayat pesanan.
- **UI/UX**: Desain modern dengan dukungan Dark Mode dan responsif.

## 🛠️ Tech Stack

| Bagian   | Teknologi                  | Detail                                     |
| :------- | :------------------------- | :----------------------------------------- |
| Backend  | Node.js, Express.js        | API RESTful dengan Service Layer.          |
| Database | PostgreSQL                 | Koneksi dengan node-postgres (Raw Query SQL). |
| Frontend | React, Vite, TypeScript    | Single Page Application (SPA).             |
| Styling  | Tailwind CSS               | Desain modern, responsif, dan Dark Mode.   |
| DevOps   | Docker, Docker Compose     | Kemampuan run proyek dengan satu perintah. |

## 🚀 Opsi 1: Menjalankan dengan Docker Compose (Direkomendasikan)

Cara termudah dan tercepat untuk menjalankan seluruh proyek (DB, Backend, Frontend) dengan sekali jalan.

### 1. Prasyarat

Pastikan Anda telah menginstal:
- Docker
- Docker Compose (biasanya sudah termasuk dalam Docker Desktop)

### 2. Jalankan Proyek

Buka terminal di folder root proyek (`/simple-orders-app`) dan jalankan:

```bash
docker-compose up --build
```

### 3. Akses Aplikasi

| Layanan          | URL                   | Keterangan                               |
| :--------------- | :-------------------- | :--------------------------------------- |
| Frontend (React) | `http://localhost:8080` | Aplikasi yang siap digunakan.            |
| Backend (API)    | `http://localhost:5001` | Base URL untuk testing API (Gunakan Postman). |
| Database (Postgres) | `localhost:5432`      | Akses untuk maintenance/debugging DB.    |

## ⚙️ Opsi 2: Menjalankan Secara Lokal (Non-Docker)

Jika Anda ingin menjalankan Backend dan Frontend secara terpisah untuk debugging.

### Prasyarat

- Node.js (v18+)
- Server PostgreSQL yang berjalan.

### 1. Setup Database

**a. Buat Database:**
Buat database baru, misalnya `simple_orders_db`.

**b. Jalankan Skrip SQL:**
Jalankan skrip SQL berikut di database `simple_orders_db` Anda untuk membuat semua tabel:

```sql
-- Aktifkan ekstensi pgcrypto
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- 1. FUNGSI UNTUK OTOMATIS UPDATE TIMESTAMP 'updated_at'
CREATE OR REPLACE FUNCTION trigger_set_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 2. TABEL USERS
CREATE TABLE users (
       id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
       email VARCHAR(255) NOT NULL UNIQUE,
       password TEXT NOT NULL,
       created_at TIMESTAMPTZ DEFAULT NOW(),
       updated_at TIMESTAMPTZ DEFAULT NOW()
);
CREATE TRIGGER set_timestamp BEFORE UPDATE ON users FOR EACH ROW EXECUTE FUNCTION trigger_set_timestamp();

-- 3. TABEL PRODUCTS
CREATE TABLE products (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      name VARCHAR(255) NOT NULL,
      price DECIMAL(10, 2) NOT NULL,
      stock INTEGER NOT NULL DEFAULT 0,
      created_at TIMESTAMPTZ DEFAULT NOW(),
      updated_at TIMESTAMPTZ DEFAULT NOW()
);
CREATE TRIGGER set_timestamp BEFORE UPDATE ON products FOR EACH ROW EXECUTE FUNCTION trigger_set_timestamp();

-- 4. TABEL ORDERS
CREATE TABLE orders (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    total_amount DECIMAL(10, 2) NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);
CREATE TRIGGER set_timestamp BEFORE UPDATE ON orders FOR EACH ROW EXECUTE FUNCTION trigger_set_timestamp();

-- 5. TABEL ORDER_ITEMS
CREATE TABLE order_items (
     id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
     order_id UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
     product_id UUID NOT NULL REFERENCES products(id),
     quantity INTEGER NOT NULL,
     price_at_time DECIMAL(10, 2) NOT NULL
);

-- 6. INDEXES
CREATE INDEX idx_orders_user_id ON orders(user_id);
CREATE INDEX idx_order_items_order_id ON order_items(order_id);
CREATE INDEX idx_order_items_product_id ON order_items(product_id);

-- 7. INSERT PRODUCT DATA

INSERT INTO products (name, price, stock) VALUES
('Laptop Pro 14"', 15000000, 50),
('Wireless Mouse', 250000, 200),
('Mechanical Keyboard', 800000, 100);
```

### 2. Setup Backend (`packages/backend`)

```bash
cd packages/backend
npm install
```

Buat file `.env` dengan isi (sesuaikan `DATABASE_URL` jika perlu):

```env
PORT=5001
JWT_SECRET="ganti_dengan_kunci_rahasia_anda_yang_sangat_aman"
JWT_EXPIRES_IN="1d"
DATABASE_URL="postgresql://postgres:secret@localhost:5432/simple_orders_db?schema=public"
```

Jalankan:

```bash
npm run dev
```

### 3. Setup Frontend (`packages/frontend`)

```bash
cd ../frontend
npm install
```

Buat file `.env` dengan isi (pastikan port API sesuai):

```env
VITE_API_BASE_URL=http://localhost:5001/api
```

Jalankan:

```bash
npm run dev
```

Aplikasi akan berjalan di `http://localhost:5173`.

## 📝 Dokumentasi Fitur

### Backend API Endpoints

Semua endpoint berada di bawah prefix `/api`.

| Endpoint         | Method | Keterangan                   | Protection |
| :--------------- | :----- | :--------------------------- | :--------- |
| `/auth/register` | `POST` | Mendaftarkan user baru.      | Public     |
| `/auth/login`    | `POST` | Login dan mendapatkan token. | Public     |
| `/products`      | `GET`  | Melihat semua produk.        | Protected  |
| `/products`      | `POST` | Menambahkan produk baru.     | Protected  |
| `/orders`        | `POST` | Membuat pesanan baru.        | Protected  |
| `/orders`        | `GET`  | Melihat riwayat pesanan user.| Protected  |

### Cara Kerja dan Ekstensi Fitur

- **Modularitas**: Logika dibagi menjadi **Routes** (URL definition), **Middlewares** (Authentication, Validation), **Controllers** (HTTP logic), dan **Services** (Database/Business logic).
- **Database**: Semua query SQL berada di layer `services/`. Untuk menambahkan atau memodifikasi query, cukup ubah file di `src/services/*`.
- **Frontend State**: Global state (Auth) dan form state (Product/Login) dikelola secara terpisah menggunakan Context dan React Hook Form.