
# 🖥️ Frontend - Simple Orders App

Frontend untuk "Simple Orders App". Dibuat dengan Vite, React, TypeScript, dan Tailwind CSS.

## ✨ Fitur

* Halaman Login & Register terpisah.
* *State management* global untuk Autentikasi (Auth Context) & Tema (Theme Context).
* *Instance* Axios terpusat dengan *interceptor* token otomatis.
* Rute terproteksi (Private Routes) & Rute publik.
* Halaman Produk dengan fitur "Tambah Produk" dan Keranjang Belanja.
* Halaman Riwayat Pesanan.
* UI *Dark Mode* (berbasis *class*).

## 🛠️ Tech Stack

* **Framework:** React 18
* **Bundler:** Vite
* **Bahasa:** TypeScript
* **Styling:** Tailwind CSS
* **Routing:** `react-router-dom`
* **Manajemen Form:** `react-hook-form`
- **Networking:** `axios`

---

## 🚀 Menjalankan Secara Lokal (Development)

Pastikan Anda memiliki [Node.js](https://nodejs.org/) (v18+).

**PENTING:** Backend API (`packages/backend`) harus sudah berjalan (di `http://localhost:5001`) agar frontend ini bisa berfungsi.

### 1. Instalasi Dependensi

```bash
# 1. Masuk ke direktori frontend
cd packages/frontend

# 2. Install semua package
npm install

# 3. Runing Localhost
npm run dev```

