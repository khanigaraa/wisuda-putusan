// ============================================================
// Kunci akses website. Kode asli TIDAK ditulis di sini:
// diambil dari environment variable KODE_AKSES (.env.local / Vercel).
// ============================================================
import { createHmac, timingSafeEqual } from "node:crypto";

export const COOKIE_AKSES = "akses_perkara";
export const COOKIE_MAX_AGE = 60 * 60 * 24 * 365; // 1 tahun (detik)

/** Kode dari environment, hanya angka. Kosong = belum diatur. */
export function kodeDariEnv(): string {
  return (process.env.KODE_AKSES ?? "").replace(/\D/g, "");
}

/**
 * Isi cookie: tanda tangan HMAC, bukan kodenya sendiri.
 * Kalau KODE_AKSES diganti, semua cookie lama otomatis tidak berlaku.
 */
export function tokenAkses(kode: string): string {
  return createHmac("sha256", kode).update("wisuda-putusan:akses").digest("hex");
}

/** Bandingkan dua string tanpa membocorkan info lewat lama waktu proses. */
export function samaAman(a: string, b: string): boolean {
  const ba = Buffer.from(a);
  const bb = Buffer.from(b);
  if (ba.length !== bb.length) return false;
  return timingSafeEqual(ba, bb);
}

/** Cek isi cookie terhadap KODE_AKSES saat ini. */
export function cookieValid(nilai: string | undefined): boolean {
  const kode = kodeDariEnv();
  if (!kode || !nilai) return false;
  return samaAman(nilai, tokenAkses(kode));
}
