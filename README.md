# Sistem RME (Rekam Medis Elektronik) Klinik

CREATE BY HANAFI

Sistem Rekam Medis Elektronik sederhana untuk klinik dengan fitur lengkap manajemen pasien, dokter, jadwal, dan rekam medis.

## Fitur Utama

### 🏥 Dashboard
- Overview statistik klinik
- Jadwal hari ini
- Notifikasi penting
- Statistik real-time

### 👥 Manajemen Pasien
- Registrasi pasien baru
- Edit data pasien
- Pencarian pasien
- Generate nomor rekam medis otomatis
- Data lengkap: NIK, nama, alamat, telepon, dll

### 📅 Jadwal Kunjungan
- Buat jadwal appointment
- Update status kunjungan
- Filter berdasarkan tanggal
- Manajemen antrian pasien

### 👨‍⚕️ Manajemen Dokter  
- Tambah data dokter
- Spesialisasi dan SIP
- Status aktif/tidak aktif
- Manajemen jadwal dokter

### 📋 Rekam Medis
- Input pemeriksaan baru
- Riwayat medis lengkap
- Diagnosis dan terapi
- Catatan pemeriksaan

### 📊 Laporan
- Laporan kunjungan
- Laporan pasien baru
- Aktivitas dokter
- Export data

## Teknologi yang Digunakan

- **Frontend**: HTML5, CSS3, JavaScript (Vanilla)
- **UI Framework**: Bootstrap 5.3
- **Icons**: Font Awesome 6.4
- **Storage**: Local Storage (browser)
- **Responsive**: Mobile-friendly design

## Instalasi dan Penggunaan

1. **Download/Clone Project**
   ```bash
   git clone atau download file
   ```

2. **Buka di Web Server**
   - Letakkan di folder `htdocs` (XAMPP)
   - Atau buka langsung `index.html` di browser

3. **Akses Aplikasi**
   ```
   http://localhost/rme/
   atau
   file:///path/to/rme/index.html
   ```

## Struktur File

```
rme/
├── index.html          # Halaman utama
├── style.css           # Styling CSS
├── script.js           # Logika JavaScript
└── README.md          # Dokumentasi
```

## Panduan Penggunaan

### 1. Dashboard
- Melihat statistik klinik secara real-time
- Monitor jadwal hari ini
- Akses cepat ke semua fitur

### 2. Tambah Pasien Baru
1. Klik menu "Pasien" 
2. Klik tombol "Tambah Pasien"
3. Isi form lengkap
4. Nomor RM akan generate otomatis
5. Klik "Simpan"

### 3. Buat Jadwal Appointment
1. Klik menu "Jadwal"
2. Klik "Buat Jadwal"
3. Pilih pasien dan dokter
4. Set tanggal dan waktu
5. Tambahkan keluhan (opsional)
6. Klik "Simpan"

### 4. Input Rekam Medis
1. Di halaman Pasien, klik icon "Rekam Medis" 
2. Tab "Pemeriksaan Baru"
3. Isi form pemeriksaan
4. Masukkan diagnosis dan terapi
5. Klik "Simpan Rekam Medis"

### 5. Generate Laporan
1. Klik menu "Laporan"
2. Pilih rentang tanggal
3. Pilih jenis laporan
4. Klik "Generate"

## Fitur Keamanan

- ✅ Validasi form input
- ✅ Konfirmasi penghapusan data
- ✅ Auto-save ke localStorage
- ✅ Responsive design

## Data Sample

Sistem sudah dilengkapi dengan data sample:
- 3 Dokter dengan spesialisasi berbeda
- 2 Pasien contoh
- Template form yang lengkap

## Kustomisasi

### Mengubah Warna Theme
Edit file `style.css` pada bagian `:root`:
```css
:root {
    --primary-color: #0d6efd;  /* Ubah warna utama */
    --success-color: #198754;   /* Warna sukses */
    /* dst... */
}
```

### Menambah Field Baru
1. Tambah field di HTML form
2. Update JavaScript untuk save/load data
3. Sesuaikan CSS jika diperlukan

## Browser Support

- ✅ Chrome 80+
- ✅ Firefox 75+  
- ✅ Safari 13+
- ✅ Edge 80+

## Catatan Penting

⚠️ **Data disimpan di localStorage browser**
- Data akan hilang jika cache browser dibersihkan
- Untuk production, gunakan database server
- Backup data secara berkala

## Pengembangan Lanjutan

Untuk pengembangan production:

1. **Backend Database**
   - MySQL/PostgreSQL
   - API REST dengan Node.js/PHP
   - Authentikasi user

2. **Keamanan**
   - HTTPS
   - Role-based access
   - Data encryption

3. **Fitur Tambahan**
   - Print rekam medis
   - Export ke PDF/Excel
   - Notifikasi email/SMS
   - Inventory obat
   - Billing system

## Lisensi

MIT License - Bebas digunakan untuk keperluan pribadi dan komersial.

## Dukungan

Untuk pertanyaan atau bantuan:
- Email: support@rmeklinik.com
- WhatsApp: +62-xxx-xxx-xxxx

---

**Selamat menggunakan Sistem RME Klinik!** 🏥✨

