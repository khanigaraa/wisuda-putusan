# Putusan Wisuda — Ucapan Wisuda Bertema Putusan Pengadilan

Website ucapan wisuda interaktif yang dikemas seperti **surat putusan pengadilan**: ada bagian *Menimbang*, *Mengingat*, *Mengadili*, tombol ketuk palu, stempel **SAH**, confetti, dan musik latar. Cocok sebagai kado digital untuk wisudawan Sarjana Hukum, dan seluruh website dikunci dengan kode akses supaya hanya penerima yang bisa membukanya.

🎓 **Coba demo live:** https://wisuda-putusan-demo.vercel.app (kode akses demo: `01012026`)

> Repo ini adalah **versi template**: semua nama, cerita, dan foto di dalamnya hanya contoh. Versi aslinya dibuat sebagai hadiah pribadi.

Dibuat dengan **Next.js 16**, **React 19**, **TypeScript**, dan **Tailwind CSS 4**.

## Fitur

- **Kunci akses di seluruh website.** Halaman, foto, dan musik baru bisa dibuka setelah pengunjung memasukkan kode yang benar di `/akses`.
- **Tampilan surat putusan.** Kertas perkamen, nomor perkara, poin-poin *Menimbang* lengkap dengan foto "barang bukti".
- **Ketuk palu.** Stempel SAH muncul, confetti meledak, dan suara palu dibuat langsung dengan Web Audio API, tanpa file suara.
- **Tombol "Ajukan Banding" yang selalu kabur** saat didekati kursor atau jari.
- **Musik latar** dengan tombol nyala/mati dan pengatur volume (tetap berfungsi di iPhone).
- **Semua teks dan foto diatur dari satu file**: [`lib/content.ts`](lib/content.ts).
- Responsif untuk HP dan desktop.

## Keamanan kunci akses

Kode akses tidak pernah ditulis di kode program. Kode diambil dari environment variable `KODE_AKSES`, lalu:

- dicek di server (`app/api/akses/route.ts`), bukan di browser;
- yang disimpan di cookie hanya **tanda tangan HMAC-SHA256**, bukan kodenya. Cookie dibuat `httpOnly`, dan `secure` di production;
- dibandingkan dengan `timingSafeEqual` supaya waktu proses tidak membocorkan petunjuk;
- setiap tebakan salah diberi jeda 600 ms supaya tebak-tebakan cepat jadi lambat;
- seluruh request (kecuali file bawaan Next.js) dijaga oleh [`proxy.ts`](proxy.ts), jadi foto dan musik di folder `public` juga ikut terkunci;
- kalau `KODE_AKSES` diganti, semua cookie lama otomatis tidak berlaku.

## Cara menjalankan

Butuh **Node.js 20 atau lebih baru**.

```bash
# 1. Pasang dependensi
npm install

# 2. Siapkan kode akses
cp .env.example .env.local      # lalu ganti nilai KODE_AKSES

# 3. Jalankan
npm run dev
```

Buka http://localhost:3000, lalu masukkan kode akses (contoh di `.env.example`: `01012026`).

## Cara mengganti isi

1. Edit teks di [`lib/content.ts`](lib/content.ts): nama, alias, poin *Menimbang*, pasal *Mengingat*, isi *Mengadili*, dan surat penutup.
2. Taruh foto di folder `public/`, lalu isi `foto`, `lebar`, dan `tinggi` di `content.ts`. Kalau `foto` dikosongkan, yang tampil kotak "Foto menyusul".
3. (Opsional) Taruh lagu di `public/` (misalnya `public/lagu.mp3`), lalu isi `musik.src` dengan `"/lagu.mp3"`. Kalau dikosongkan, website berjalan tanpa musik.
4. Ganti petunjuk di halaman kunci lewat [`app/akses/page.tsx`](app/akses/page.tsx).

## Deploy ke Vercel

1. Import repo ini di [vercel.com/new](https://vercel.com/new).
2. Di **Settings → Environment Variables**, tambahkan `KODE_AKSES`.
3. Deploy.

## Struktur proyek

```text
.
├── app/
│   ├── page.tsx              # Halaman utama (surat putusan)
│   ├── akses/page.tsx        # Halaman masukkan kode akses
│   └── api/akses/route.ts    # Pengecek kode di server
├── lib/
│   ├── content.ts            # Semua teks & foto (edit di sini)
│   └── akses.ts              # HMAC, cookie, pembanding aman
├── proxy.ts                  # Penjaga akses seluruh website
└── public/                   # Foto (contoh) dan musik
```

## Mau dibuatkan versi sendiri?

Saya menerima pesanan website seperti ini: undangan dan ucapan digital, landing page, company profile, portofolio, sampai aplikasi web.

- LinkedIn: [khanigaraa](https://www.linkedin.com/in/khanigaraa)
- Instagram: [@khanigaraa](https://www.instagram.com/khanigaraa)

## Lisensi

[MIT](LICENSE) © 2026 Kanta Khanigara
