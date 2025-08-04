# Data Ijazah - GitHub Pages Web App

Aplikasi web untuk mengelola data ijazah siswa yang dapat di-host di GitHub Pages dan terhubung dengan Google Apps Script untuk penyimpanan data di Google Sheets.

## 📋 Fitur

- ✅ Interface web yang responsif (mobile, tablet, desktop)
- ✅ Pencarian siswa berdasarkan nomor induk
- ✅ Form input data ijazah
- ✅ Tampilan nilai mata pelajaran dengan perhitungan otomatis
- ✅ Toggle "Sudah Ditulis" dengan indikator visual
- ✅ Sistem checkbox untuk kesalahan data
- ✅ Integrasi dengan Google Sheets melalui Google Apps Script
- ✅ Hosting gratis di GitHub Pages

## 🚀 Setup dan Deployment

### 1. Setup Google Apps Script

1. **Buka Google Apps Script**
   - Kunjungi [script.google.com](https://script.google.com)
   - Klik "New Project"

2. **Setup Spreadsheet**
   - Buat Google Spreadsheet baru atau gunakan yang sudah ada
   - Copy ID Spreadsheet dari URL (contoh: `1abc123def456...`)
   - Buat sheet dengan nama "DATABASE"

3. **Setup Code.gs**
   - Copy seluruh kode dari file `Code.gs`
   - Paste ke Apps Script Editor
   - Ganti `YOUR_SPREADSHEET_ID_HERE` dengan ID spreadsheet Anda
   - Save project dengan nama "Data Ijazah API"

4. **Deploy Web App**
   - Klik "Deploy" > "New Deployment"
   - Pilih type: "Web app"
   - Description: "Data Ijazah API"
   - Execute as: "Me"
   - Who has access: "Anyone"
   - Klik "Deploy"
   - Copy Web App URL yang diberikan

### 2. Setup GitHub Pages

1. **Fork/Upload Repository**
   - Fork repository ini atau upload file `index.html` ke repository GitHub baru
   - Pastikan file berada di root directory atau folder `docs/`

2. **Enable GitHub Pages**
   - Masuk ke Settings repository
   - Scroll ke "Pages" section
   - Source: "Deploy from a branch"
   - Branch: "main" (atau "master")
   - Folder: "/ (root)" atau "/docs"
   - Klik "Save"

3. **Get GitHub Pages URL**
   - URL akan tersedia di: `https://username.github.io/repository-name`
   - Atau `https://username.github.io/repository-name/index.html`

### 3. Konfigurasi Koneksi

1. **Buka GitHub Pages URL**
   - Akses aplikasi web di browser
   - Akan muncul section "Konfigurasi Koneksi" di atas

2. **Masukkan Google Apps Script URL**
   - Paste Web App URL dari Google Apps Script
   - Format: `https://script.google.com/macros/s/YOUR_SCRIPT_ID/exec`
   - Klik "Test Koneksi"

3. **Verifikasi Koneksi**
   - Status harus berubah menjadi "Terhubung" (hijau)
   - Jika gagal, periksa URL dan permissions Google Apps Script

## 🛠️ Struktur Database

Aplikasi menggunakan Google Sheets dengan struktur kolom berikut:

| Kolom | Nama Field | Tipe | Keterangan |
|-------|------------|------|------------|
| A | NO URUT | Number | Auto increment |
| B | NO INDUK | String | Primary key |
| C | NAMA | String | Nama siswa |
| D | ASRAMA | String | Nama asrama |
| E | KELAS | String | Kelas siswa |
| F | NAMA IJAZAH | String | Nama lengkap di ijazah |
| G | WALI IJAZAH | String | Nama wali |
| H | NISN | String | Nomor Induk Siswa Nasional |
| I | TTL | String | Tempat Tanggal Lahir |
| J-S | Mata Pelajaran | Number | 10 mata pelajaran (Tauhid, Akhlaq, dll) |
| T | JUMLAH | Number | Auto calculated |
| U | RATA RATA | Number | Auto calculated |
| V | CEK BERKAS | String | URL file berkas |
| W-AA | Error Flags | Boolean | 5 jenis kesalahan data |
| AB | SUDAH DITULIS | Boolean | Status penulisan |

## 🔧 Penggunaan

### Mencari Siswa
1. Masukkan nomor induk di field "No Induk"
2. Klik "Cari Siswa"
3. Data siswa akan muncul jika ditemukan

### Mengisi Data
1. Lengkapi field yang tersedia (NISN, Nama Ijazah, TTL, Nama Wali)
2. Nilai mata pelajaran akan ditampilkan otomatis (read-only)
3. Toggle "Sudah Ditulis" jika data sudah selesai
4. Klik "Kesalahan Data" untuk menandai jenis kesalahan
5. Klik "Simpan" untuk menyimpan perubahan

### Menghapus Data
1. Pilih siswa yang akan dihapus
2. Klik "Hapus"
3. Konfirmasi penghapusan
4. Data akan dihapus permanen dari spreadsheet

## 🔒 Keamanan

- ✅ Google Apps Script berjalan dengan permissions user
- ✅ CORS headers configured untuk akses dari GitHub Pages
- ✅ Data tersimpan di Google Sheets milik user
- ✅ Tidak ada data sensitive yang tersimpan di client
- ✅ URL connection disimpan di localStorage browser

## 🐛 Troubleshooting

### Koneksi Gagal
- Pastikan Google Apps Script sudah di-deploy dengan benar
- Cek permissions: "Execute as: Me", "Access: Anyone"
- Verifikasi URL Web App sudah benar
- Coba hard refresh browser (Ctrl+F5)

### Data Tidak Muncul
- Pastikan sheet bernama "DATABASE" sudah ada
- Cek struktur kolom sesuai dokumentasi
- Jalankan fungsi `setupSpreadsheet()` di Apps Script Editor
- Periksa Execution Transcript untuk error logs

### Error CORS
- Pastikan Apps Script menggunakan CORS headers yang benar
- Browser modern mungkin memblok mixed content (HTTP/HTTPS)
- Gunakan HTTPS untuk kedua aplikasi

## 📱 Responsive Design

Aplikasi mendukung berbagai ukuran layar:
- **Mobile** (< 480px): Layout single column
- **Tablet** (480px - 1024px): Layout adaptif
- **Desktop** (> 1024px): Layout optimal

## 🔄 API Endpoints

Google Apps Script menerima POST requests dengan format:

```json
{
  "action": "searchStudent|saveStudent|deleteStudent",
  "noInduk": "string",
  "data": { ... }
}
```

Response format:
```json
{
  "success": boolean,
  "message": "string",
  "student": { ... }
}
```

## 📄 License

MIT License - Bebas digunakan untuk keperluan pendidikan dan komersial.

## 🤝 Kontribusi

Pull requests dan issues sangat welcome! Silakan berkontribusi untuk meningkatkan aplikasi ini.

---

**Happy Coding! 🚀**