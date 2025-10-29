# Arsitektur Aplikasi dan Penerapan Microservice

## 1. Pola Arsitektur Backend

Kode backend (Node.js/Express) menggunakan pola **Service Layer**, yang merupakan arsitektur yang efektif dan *maintainable* untuk API:

1.  **Controllers (`product.controller.ts`):** Bertanggung jawab hanya untuk menangani permintaan HTTP, validasi dasar, dan mengirim respons.
2.  **Services (`product.service.ts`):** Berisi semua **logika bisnis** (misalnya, menghitung total pesanan, memvalidasi stok) dan berinteraksi langsung dengan database. Ini berfungsi sebagai lapisan **Model** dan **Repository**.

Pola ini efektif karena memisahkan logika bisnis dari lapisan transport (HTTP), menjadikannya lebih mudah diuji (**testable**) dan lebih mudah diukur (**scalable**).

---

## 2. Struktur Microservice Jika Backend dan Frontend Dipisah

Saat Backend dan Frontend sudah dipisah (yang sudah kita lakukan), struktur *monolith* Backend dapat dipecah lagi menjadi beberapa **Microservice**.

### Struktur Microservice yang Disarankan

Dalam kasus "Simple Orders App", ini dapat dibagi menjadi dua Microservice utama yang berkomunikasi melalui **API Gateway**:

| Microservice | Tugas Utama | Teknologi Komunikasi |
| :--- | :--- | :--- |
| **1. User/Auth Service** | Mengelola pendaftaran, login, token JWT, dan data dasar user. | Asynchronous (Message Queue) untuk notifikasi, Synchronous (HTTP/gRPC) untuk validasi token. |
| **2. Order/Catalog Service** | Mengelola data Produk (stok, harga) dan semua Logika Pesanan (membuat, melihat riwayat). | Synchronous (HTTP/gRPC) untuk mendapatkan data produk saat membuat pesanan. |



### Cara Kerja Komunikasi

1.  **Frontend ke API Gateway:** Frontend (`http://localhost:8080`) hanya akan tahu satu alamat, yaitu **API Gateway**.
2.  **API Gateway:** Bertindak sebagai *reverse proxy*. Gateway akan meneruskan permintaan `/api/auth/login` ke **Auth Service** dan `/api/orders` ke **Order Service**.
3.  **Order Creation (Contoh):**
    * **Frontend** mengirim `POST /orders` ke API Gateway.
    * **API Gateway** meneruskannya ke **Order Service**.
    * **Order Service** (Service A) perlu memverifikasi token dan informasi user, sehingga ia akan membuat panggilan **Synchronous** (HTTP) ke **Auth Service** (Service B) untuk validasi token.
    * **Order Service** memproses pesanan dan memotong stok produk.

Pemisahan ini membuat setiap service dapat di-*deploy* secara independen, meningkatkan **ketersediaan** dan **skalabilitas** sistem secara keseluruhan.