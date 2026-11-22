"use client";

import { useState } from "react";

// Halaman kunci: bertema sama dengan berkas putusan.
export default function AksesPage() {
  const [kode, setKode] = useState("");
  const [pesan, setPesan] = useState("");
  const [memeriksa, setMemeriksa] = useState(false);

  const kirim = async (e: React.FormEvent) => {
    e.preventDefault();
    if (memeriksa) return;
    setMemeriksa(true);
    setPesan("");
    try {
      const res = await fetch("/api/akses", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ kode }),
      });
      const data = (await res.json().catch(() => ({}))) as { pesan?: string };
      if (res.ok) {
        // Kembali ke halaman tujuan awal (hanya path di website ini sendiri).
        const ke = new URLSearchParams(window.location.search).get("ke") ?? "/";
        const aman = ke.startsWith("/") && !ke.startsWith("//") ? ke : "/";
        window.location.replace(aman);
        return;
      }
      setPesan(data.pesan ?? "Kode perkara tidak dikenali");
    } catch {
      setPesan("Gagal menghubungi server. Coba lagi.");
    }
    setMemeriksa(false);
  };

  return (
    <main className="min-h-dvh flex items-center justify-center px-4 py-8 parchment-bg">
      <form
        onSubmit={kirim}
        className="document-border bg-parchment rounded-lg p-8 md:p-12 max-w-md w-full text-center"
      >
        <div className="text-6xl mb-5 animate-fade-in">🔒</div>

        <h1 className="font-[family-name:var(--font-serif)] text-2xl md:text-3xl font-bold text-ink tracking-wide mb-3">
          Masukkan Kode Perkara
        </h1>

        <div className="my-5 border-t border-dashed border-gold/30" />

        <label htmlFor="kode" className="block text-ink-light text-sm md:text-base italic mb-4">
          Masukkan tanggal spesial kita (format DDMMYYYY)
        </label>

        <input
          id="kode"
          name="kode"
          type="password"
          inputMode="numeric"
          autoComplete="off"
          autoFocus
          maxLength={10}
          value={kode}
          onChange={(e) => {
            setKode(e.target.value);
            if (pesan) setPesan("");
          }}
          placeholder="••••••••"
          aria-invalid={pesan ? true : undefined}
          aria-describedby={pesan ? "pesan-akses" : undefined}
          className={`w-full text-center font-mono text-2xl tracking-[0.4em] text-ink bg-cream/70 rounded-lg
                      border-2 px-3 py-3 outline-none transition-colors placeholder:text-ink-light/30
                      focus:border-gold ${pesan ? "border-red-accent" : "border-gold/40"}`}
        />

        <p
          id="pesan-akses"
          role="alert"
          className="min-h-6 mt-3 text-sm font-semibold text-red-accent"
        >
          {pesan}
        </p>

        <button
          type="submit"
          disabled={memeriksa || kode.replace(/\D/g, "").length === 0}
          className="mt-2 w-full bg-gold hover:bg-gold-light text-white font-semibold py-3 px-8 rounded-lg
                     text-base md:text-lg transition-all duration-300 active:scale-95 cursor-pointer shadow-lg
                     disabled:opacity-60 disabled:cursor-not-allowed disabled:active:scale-100"
        >
          {memeriksa ? "Memeriksa…" : "📂 Buka Berkas"}
        </button>
      </form>
    </main>
  );
}
