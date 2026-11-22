import { NextResponse } from "next/server";
import {
  COOKIE_AKSES,
  COOKIE_MAX_AGE,
  kodeDariEnv,
  samaAman,
  tokenAkses,
} from "@/lib/akses";

// Cek kode perkara di server, lalu simpan cookie httpOnly kalau benar.
export async function POST(request: Request) {
  const kodeBenar = kodeDariEnv();
  if (!kodeBenar) {
    return NextResponse.json(
      { ok: false, pesan: "Kode akses belum diatur di server (KODE_AKSES)." },
      { status: 500 }
    );
  }

  let masukan = "";
  try {
    const body = (await request.json()) as { kode?: unknown };
    // Terima juga "12-03-2023" atau "12/03/2023": ambil angkanya saja.
    masukan = String(body.kode ?? "").replace(/\D/g, "");
  } catch {
    // body kosong / bukan JSON → dianggap salah
  }

  // Bandingkan tanda tangannya (panjang selalu sama) supaya waktu prosesnya rata.
  if (!masukan || !samaAman(tokenAkses(masukan), tokenAkses(kodeBenar))) {
    // Jeda kecil supaya tebak-tebakan cepat lebih lambat.
    await new Promise((r) => setTimeout(r, 600));
    return NextResponse.json(
      { ok: false, pesan: "Kode perkara tidak dikenali" },
      { status: 401 }
    );
  }

  const res = NextResponse.json({ ok: true });
  res.cookies.set({
    name: COOKIE_AKSES,
    value: tokenAkses(kodeBenar),
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: COOKIE_MAX_AGE,
  });
  return res;
}
