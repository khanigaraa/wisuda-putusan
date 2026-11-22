// ============================================================
// KONTEN WEBSITE WISUDA - Edit semua teks dan foto di sini
// Semua isi di bawah ini hanya CONTOH. Ganti dengan cerita kamu sendiri.
// ============================================================

export const content = {
  // --- Header / Kepala Putusan ---
  header: {
    emblem: "⚖️",
    title: "PUTUSAN",
    nomor: "Nomor: 001/Pdt.Cinta/2026/PN.Hati",
    subtitle: "DEMI KEADILAN BERDASARKAN CINTA YANG MAHA ESA",
  },

  // --- Identitas (ditampilkan seperti di dokumen pengadilan) ---
  terdakwa: {
    label: "Dalam perkara atas nama:",
    nama: "Nama Wisudawan, S.H.",
    alias: ["Si Paling Rajin", "Calon Hakim", "Pejuang Skripsi"],
  },

  // --- Bagian Pembuka ---
  pembuka: {
    // Teks di layar pertama sebelum membuka "berkas"
    headline: "PUTUSAN PENGADILAN TINGGI HATI",
    tanggal: "Nama Kota, 1 Januari 2026",
    keterangan:
      "Perkara ini telah diperiksa dan diadili oleh Majelis Hakim Perasaan dalam persidangan yang terbuka untuk umum.",
    tombol: "📂 Buka Berkas Perkara",
  },

  // --- Bagian Menimbang ---
  menimbang: {
    judul: "MENIMBANG",
    // Cara pasang foto: taruh file di folder /public (misal: public/bukti-1.jpg),
    // lalu isi `foto` dengan "/bukti-1.jpg" dan `lebar`/`tinggi` dengan ukuran fotonya
    // (supaya foto tampil utuh tanpa terpotong). Kalau `foto` kosong, tampil kotak placeholder.
    poin: [
      {
        teks: "Bahwa Terdakwa telah menyelesaikan ratusan halaman bacaan dan tetap tersenyum di akhir semester.",
        bukti: "Bukti P-1",
        foto: "/contoh-bukti-1.svg",
        lebar: 1600,
        tinggi: 900,
        fotoAlt: "Contoh foto bukti pertama",
      },
      {
        teks: "Bahwa Terdakwa telah menjalani kegiatan lapangan dengan penuh semangat.",
        bukti: "Bukti P-2",
        foto: "/contoh-bukti-2.svg",
        lebar: 900,
        tinggi: 1600,
        fotoAlt: "Contoh foto bukti kedua",
      },
      {
        teks: "Bahwa Terdakwa telah tampil berani dalam sidang skripsi, seolah sudah lama berdiri di ruang sidang.",
        bukti: "Bukti P-3",
        foto: "",
        lebar: 1600,
        tinggi: 900,
        fotoAlt: "",
      },
    ],
  },

  // --- Bagian Mengingat ---
  mengingat: {
    judul: "MENGINGAT",
    pasal: [
      {
        nomor: "Pasal 1",
        isi: "Setiap begadang demi revisi ditetapkan sebagai bukti kesungguhan yang sah.",
      },
      {
        nomor: "Pasal 2",
        isi: "Setiap kopi yang diminum saat mengerjakan skripsi dianggap sebagai saksi yang meringankan.",
      },
      {
        nomor: "Pasal 3",
        isi: "Dukungan keluarga dan sahabat diakui sebagai alat bukti yang tidak dapat dibantah.",
      },
    ],
  },

  // --- Bagian Mengadili ---
  mengadili: {
    judul: "MENGADILI",
    pernyataan: [
      "Menyatakan Terdakwa SAH dan meyakinkan LULUS sebagai Sarjana Hukum.",
      "Menghukum Terdakwa untuk tetap bahagia, makan teratur, dan istirahat setelah perjuangan panjang ini.",
      "Menetapkan Pengirim sebagai pendukung tetap untuk perkara-perkara berikutnya.",
    ],
    tombolPalu: "🔨 Ketuk Palu",
    pesanSetelahPalu: "SAH! SELAMAT WISUDA, SARJANA HUKUM! 🎓",
    // Tombol di bawah Mengadili
    tombolTerima: "✅ Terima Putusan",
    tombolBanding: "📝 Ajukan Banding",
    pesanDiterima: "Tok tok tok! Putusan diterima dan berkekuatan hukum tetap. 💛",
  },

  // --- Barang Bukti (tampil sebelum Surat Penutup) ---
  barangBukti: {
    judul: "BARANG BUKTI",
    item: [
      {
        bukti: "Bukti T-1",
        keterangan: "foto kenangan pertama",
        foto: "/contoh-barang-1.svg",
        lebar: 1200,
        tinggi: 1600,
        fotoAlt: "Contoh foto barang bukti pertama",
      },
      {
        bukti: "Bukti T-2",
        keterangan: "foto kenangan kedua",
        foto: "/contoh-barang-2.svg",
        lebar: 1600,
        tinggi: 1067,
        fotoAlt: "Contoh foto barang bukti kedua",
      },
    ],
  },

  // --- Musik (diputar saat tombol "Buka Berkas Perkara" diklik) ---
  // Taruh file lagu di /public (misal: public/lagu.mp3) lalu isi src dengan "/lagu.mp3".
  // Kosongkan src kalau tidak pakai musik.
  musik: {
    src: "",
    volumeAwal: 50, // 0 sampai 100
  },

  // --- Surat Penutup ---
  penutup: {
    judul: "SURAT PENUTUP",
    isi: `Setelah melalui persidangan panjang bernama skripsi, dengan ini diputuskan: Terdakwa SAH dan meyakinkan menjadi Sarjana Hukum.

Putusan ini final dan tidak dapat diganggu gugat.

Selamat wisuda, aku bangga banget sama kamu.`,
    pengirim: "— Nama Pengirim",
    ditandatangani: "Diputuskan dalam rapat permusyawaratan Majelis Hakim Perasaan",
    tanggalPutusan: "pada hari Kamis, tanggal 1 Januari 2026",
  },
};
