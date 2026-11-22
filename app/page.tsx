"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import confetti from "canvas-confetti";
import { content } from "@/lib/content";
import Image from "next/image";

// ─── Reusable Section Wrapper ───────────────────────────────────────
function Section({
  children,
  className = "",
  id,
}: {
  children: React.ReactNode;
  className?: string;
  id?: string;
}) {
  const ref = useRef<HTMLElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.15 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <section
      ref={ref}
      id={id}
      className={`transition-all duration-700 ${
        visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
      } ${className}`}
    >
      {children}
    </section>
  );
}

// ─── Decorative Divider ─────────────────────────────────────────────
function Divider() {
  return (
    <div className="flex items-center justify-center gap-3 my-8 md:my-12">
      <span className="block h-px w-12 md:w-20 bg-gold/40" />
      <span className="text-gold text-lg">⚜</span>
      <span className="block h-px w-12 md:w-20 bg-gold/40" />
    </div>
  );
}

// ─── Horizontal Rule like in legal docs ─────────────────────────────
function LegalHr() {
  return (
    <div className="my-6 md:my-8 border-t border-dashed border-gold/30" />
  );
}

function getAudioContextClass(): typeof AudioContext | undefined {
  return (
    window.AudioContext ||
    (window as unknown as { webkitAudioContext?: typeof AudioContext })
      .webkitAudioContext
  );
}

// ─── Suara ketuk palu, dibuat langsung dengan Web Audio (tanpa file) ──
function playGavelKnocks(times = 3, gap = 0.32) {
  const Ctx = getAudioContextClass();
  if (!Ctx) return;
  const ctx = new Ctx();
  const start = ctx.currentTime + 0.05;

  // Potongan "noise" pendek untuk bunyi kayu beradu
  const len = Math.floor(ctx.sampleRate * 0.12);
  const noise = ctx.createBuffer(1, len, ctx.sampleRate);
  const data = noise.getChannelData(0);
  for (let i = 0; i < len; i++) {
    data[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / len, 4);
  }

  for (let k = 0; k < times; k++) {
    const t = start + k * gap;

    // Dentuman rendah ("tok")
    const osc = ctx.createOscillator();
    osc.type = "sine";
    osc.frequency.setValueAtTime(180, t);
    osc.frequency.exponentialRampToValueAtTime(70, t + 0.12);
    const body = ctx.createGain();
    body.gain.setValueAtTime(0.0001, t);
    body.gain.exponentialRampToValueAtTime(0.9, t + 0.004);
    body.gain.exponentialRampToValueAtTime(0.0001, t + 0.18);
    osc.connect(body).connect(ctx.destination);
    osc.start(t);
    osc.stop(t + 0.2);

    // Klik kayu di atasnya
    const src = ctx.createBufferSource();
    src.buffer = noise;
    const band = ctx.createBiquadFilter();
    band.type = "bandpass";
    band.frequency.value = 1800;
    band.Q.value = 1.5;
    const click = ctx.createGain();
    click.gain.value = 0.7;
    src.connect(band).connect(click).connect(ctx.destination);
    src.start(t);
  }

  setTimeout(() => ctx.close(), (times * gap + 0.6) * 1000);
}

// ─── Tombol "Ajukan Banding" yang selalu kabur ──────────────────────
function TombolBanding({
  label,
  zoneRef,
  avoidRef,
}: {
  label: string;
  zoneRef: React.RefObject<HTMLDivElement | null>;
  avoidRef: React.RefObject<HTMLElement | null>;
}) {
  const btnRef = useRef<HTMLButtonElement>(null);
  const [pos, setPos] = useState<{ x: number; y: number } | null>(null);

  // Pindah ke posisi acak di dalam area, jauh dari jari/kursor
  // dan tidak menutupi tombol "Terima Putusan".
  const kabur = useCallback(
    (px?: number, py?: number) => {
      const zone = zoneRef.current;
      const btn = btnRef.current;
      if (!zone || !btn) return;
      const z = zone.getBoundingClientRect();
      const bw = btn.offsetWidth;
      const bh = btn.offsetHeight;
      const avoid = avoidRef.current?.getBoundingClientRect();

      for (let i = 0; i < 40; i++) {
        const x = Math.random() * Math.max(0, z.width - bw);
        const y = Math.random() * Math.max(0, z.height - bh);
        const left = z.left + x;
        const top = z.top + y;
        if (
          px !== undefined &&
          py !== undefined &&
          Math.hypot(left + bw / 2 - px, top + bh / 2 - py) < 120
        )
          continue;
        if (
          avoid &&
          !(
            left > avoid.right + 8 ||
            left + bw < avoid.left - 8 ||
            top > avoid.bottom + 8 ||
            top + bh < avoid.top - 8
          )
        )
          continue;
        setPos({ x, y });
        return;
      }
    },
    [zoneRef, avoidRef]
  );

  // Kabur kalau kursor mendekat (mouse)
  useEffect(() => {
    const zone = zoneRef.current;
    if (!zone) return;
    const onMove = (e: PointerEvent) => {
      if (e.pointerType !== "mouse") return;
      const b = btnRef.current?.getBoundingClientRect();
      if (!b) return;
      const dist = Math.hypot(
        e.clientX - (b.left + b.width / 2),
        e.clientY - (b.top + b.height / 2)
      );
      if (dist < 90) kabur(e.clientX, e.clientY);
    };
    zone.addEventListener("pointermove", onMove);
    return () => zone.removeEventListener("pointermove", onMove);
  }, [zoneRef, kabur]);

  return (
    <button
      ref={btnRef}
      type="button"
      onPointerEnter={(e) => kabur(e.clientX, e.clientY)}
      onPointerDown={(e) => {
        e.preventDefault();
        kabur(e.clientX, e.clientY);
      }}
      onTouchStart={(e) => {
        const t = e.touches[0];
        kabur(t?.clientX, t?.clientY);
      }}
      onMouseDown={(e) => {
        e.preventDefault();
        kabur(e.clientX, e.clientY);
      }}
      onFocus={() => kabur()}
      onClick={(e) => e.preventDefault()}
      style={pos ? { left: pos.x, top: pos.y } : undefined}
      className={`absolute whitespace-nowrap bg-white border-2 border-ink-light/40 text-ink-light font-semibold
                  py-2.5 px-4 rounded-lg text-sm md:text-base shadow-md select-none touch-none
                  transition-[left,top] duration-300 ease-out ${
                    pos
                      ? ""
                      : "bottom-6 left-1/2 -translate-x-1/2 md:bottom-auto md:top-[calc(50%-1.375rem)] md:left-auto md:right-4 md:translate-x-0"
                  }`}
    >
      {label}
    </button>
  );
}

// ═════════════════════════════════════════════════════════════════════
// MAIN PAGE
// ═════════════════════════════════════════════════════════════════════
export default function Home() {
  const [opened, setOpened] = useState(false);
  const [gavelHit, setGavelHit] = useState(false);
  const [showStamp, setShowStamp] = useState(false);
  const [accepted, setAccepted] = useState(false);
  const [musicOn, setMusicOn] = useState(false);
  const [volume, setVolume] = useState(content.musik.volumeAwal);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  // Volume diatur lewat Web Audio supaya juga berfungsi di iPhone
  // (Safari iOS mengabaikan audio.volume).
  const audioCtxRef = useRef<AudioContext | null>(null);
  const gainRef = useRef<GainNode | null>(null);
  const zonaTombolRef = useRef<HTMLDivElement>(null);
  const terimaRef = useRef<HTMLButtonElement>(null);

  // Hentikan musik kalau halaman ditutup / komponen dilepas
  useEffect(
    () => () => {
      audioRef.current?.pause();
      audioCtxRef.current?.close();
    },
    []
  );

  // ── Buka berkas + mulai musik ───────────────────────────────────
  const bukaBerkas = () => {
    // Tanpa musik: langsung buka berkas.
    if (!content.musik.src) {
      setOpened(true);
      return;
    }
    const audio = new Audio(content.musik.src);
    audio.loop = true;
    audioRef.current = audio;
    try {
      const Ctx = getAudioContextClass();
      if (!Ctx) throw new Error("no web audio");
      const ctx = new Ctx();
      const gain = ctx.createGain();
      gain.gain.value = volume / 100;
      ctx.createMediaElementSource(audio).connect(gain).connect(ctx.destination);
      audioCtxRef.current = ctx;
      gainRef.current = gain;
    } catch {
      audio.volume = volume / 100;
    }
    audio
      .play()
      .then(() => setMusicOn(true))
      .catch(() => setMusicOn(false));
    setOpened(true);
  };

  const toggleMusik = () => {
    const audio = audioRef.current;
    if (!audio) return;
    if (audio.paused) {
      audioCtxRef.current?.resume();
      audio
        .play()
        .then(() => setMusicOn(true))
        .catch(() => setMusicOn(false));
    } else {
      audio.pause();
      setMusicOn(false);
    }
  };

  const ubahVolume = (v: number) => {
    setVolume(v);
    if (gainRef.current) gainRef.current.gain.value = v / 100;
    else if (audioRef.current) audioRef.current.volume = v / 100;
  };

  // ── Confetti burst ──────────────────────────────────────────────
  const fireConfetti = () => {
    const duration = 3000;
    const end = Date.now() + duration;

    const frame = () => {
      confetti({
        particleCount: 3,
        angle: 60,
        spread: 55,
        origin: { x: 0, y: 0.7 },
        colors: ["#b8860b", "#daa520", "#8b0000", "#ffd700", "#ffffff"],
      });
      confetti({
        particleCount: 3,
        angle: 120,
        spread: 55,
        origin: { x: 1, y: 0.7 },
        colors: ["#b8860b", "#daa520", "#8b0000", "#ffd700", "#ffffff"],
      });
      if (Date.now() < end) requestAnimationFrame(frame);
    };
    frame();

    // Big center burst
    setTimeout(() => {
      confetti({
        particleCount: 100,
        spread: 100,
        origin: { y: 0.6 },
        colors: ["#b8860b", "#daa520", "#8b0000", "#ffd700", "#ffffff"],
      });
    }, 300);
  };

  const handleGavel = () => {
    if (gavelHit) return;
    setGavelHit(true);
    setTimeout(() => setShowStamp(true), 400);
    fireConfetti();
  };

  // ── Terima putusan: tok tok tok, lalu confetti ──────────────────
  const handleTerima = () => {
    if (accepted) return;
    setAccepted(true);
    playGavelKnocks(3, 0.32);
    setTimeout(fireConfetti, 3 * 320 + 100);
  };

  // ── Cover Screen ────────────────────────────────────────────────
  if (!opened) {
    return (
      <main className="min-h-dvh flex items-center justify-center px-4 py-8 parchment-bg">
        <div className="document-border bg-parchment rounded-lg p-8 md:p-14 max-w-md w-full text-center">
          {/* Emblem */}
          <div className="text-6xl md:text-7xl mb-6 animate-fade-in">
            {content.header.emblem}
          </div>

          {/* Headline */}
          <h1 className="font-[family-name:var(--font-serif)] text-2xl md:text-3xl font-bold text-ink tracking-wide mb-3 animate-fade-in-up">
            {content.pembuka.headline}
          </h1>

          {/* Nomor perkara */}
          <p className="text-sm text-ink-light font-mono tracking-wider mb-6 animate-fade-in-up animation-delay-200">
            {content.header.nomor}
          </p>

          <LegalHr />

          {/* Keterangan */}
          <p className="text-ink-light text-sm md:text-base leading-relaxed mb-2 animate-fade-in-up animation-delay-400 italic">
            {content.pembuka.keterangan}
          </p>

          <p className="text-ink-light text-xs mb-8 animate-fade-in-up animation-delay-400">
            {content.pembuka.tanggal}
          </p>

          {/* Button */}
          <button
            onClick={bukaBerkas}
            className="animate-pulse-gold bg-gold hover:bg-gold-light text-white font-semibold 
                       py-3 px-8 rounded-lg text-base md:text-lg transition-all duration-300 
                       hover:scale-105 active:scale-95 cursor-pointer shadow-lg animate-fade-in-up animation-delay-600"
          >
            {content.pembuka.tombol}
          </button>
        </div>
      </main>
    );
  }

  // ── Main Document ───────────────────────────────────────────────
  return (
    <main className="min-h-dvh parchment-bg">
      <div className="max-w-2xl mx-auto px-4 py-8 pb-24 md:py-14 md:pb-24">
        <div className="document-border bg-parchment rounded-lg p-6 md:p-10 lg:p-14">
          {/* ═══ KEPALA PUTUSAN ═══ */}
          <Section className="text-center mb-8">
            <div className="text-5xl md:text-6xl mb-4">{content.header.emblem}</div>
            <h1 className="font-[family-name:var(--font-serif)] text-3xl md:text-4xl font-extrabold text-ink tracking-[0.15em] mb-2">
              {content.header.title}
            </h1>
            <p className="text-sm text-ink-light font-mono tracking-widest mb-4">
              {content.header.nomor}
            </p>
            <p className="font-[family-name:var(--font-serif)] text-sm md:text-base font-semibold text-red-accent tracking-wider uppercase">
              {content.header.subtitle}
            </p>
          </Section>

          {/* ═══ IDENTITAS ═══ */}
          <Section className="mt-8 text-center">
            <p className="text-ink-light text-xs md:text-sm italic mb-2">
              {content.terdakwa.label}
            </p>
            <p className="font-[family-name:var(--font-serif)] text-lg md:text-2xl font-bold text-ink break-words">
              {content.terdakwa.nama}
            </p>
            <p className="mt-2 text-ink-light text-sm md:text-base leading-relaxed">
              {content.terdakwa.alias.map((a, i) => (
                <span key={i}>
                  <span className="italic text-ink-light/70"> alias </span>
                  <span className="font-semibold text-ink whitespace-nowrap">{a}</span>
                </span>
              ))}
            </p>
          </Section>

          <Divider />

          {/* ═══ MENIMBANG ═══ */}
          <Section className="mb-8" id="menimbang">
            <h2 className="font-[family-name:var(--font-serif)] text-xl md:text-2xl font-bold text-ink mb-6 tracking-wide">
              {content.menimbang.judul}
            </h2>

            {/* Poin-poin menimbang, masing-masing dengan foto bukti */}
            <div className="space-y-8">
              {content.menimbang.poin.map((poin, i) => (
                <div key={i}>
                  <div className="flex gap-3 items-start mb-3">
                    <span className="flex-shrink-0 w-6 h-6 md:w-7 md:h-7 bg-gold/10 border border-gold/30 rounded-full flex items-center justify-center text-gold text-xs font-bold mt-0.5">
                      {String.fromCharCode(97 + i)}
                    </span>
                    <p className="text-ink-light text-sm md:text-base leading-relaxed">
                      {poin.teks}
                    </p>
                  </div>

                  <figure className="md:ml-10">
                    {/* Foto tampil utuh sesuai bentuk aslinya (tidak dipotong).
                        Foto portrait dibuat lebih sempit supaya tidak terlalu panjang di HP. */}
                    <div
                      className={`relative rounded-lg overflow-hidden border-2 border-gold/30 shadow-md bg-cream-dark/50 ${
                        poin.foto && poin.tinggi > poin.lebar
                          ? "w-3/4 max-w-xs mx-auto"
                          : "w-full"
                      } ${poin.foto ? "" : "aspect-[4/3]"}`}
                    >
                      {poin.foto ? (
                        <Image
                          src={poin.foto}
                          alt={poin.fotoAlt}
                          width={poin.lebar}
                          height={poin.tinggi}
                          className="block w-full h-auto"
                          sizes="(max-width: 768px) 90vw, 560px"
                          priority={i === 0}
                        />
                      ) : (
                        <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 border-2 border-dashed border-gold/40 m-2 rounded-md text-gold/70">
                          <span className="text-3xl">📷</span>
                          <span className="text-xs italic">Foto menyusul</span>
                        </div>
                      )}
                      <span className="absolute top-2 left-2 bg-red-accent text-white text-[10px] md:text-xs font-bold tracking-wider px-2 py-1 rounded shadow">
                        {poin.bukti}
                      </span>
                    </div>
                  </figure>
                </div>
              ))}
            </div>
          </Section>

          <Divider />

          {/* ═══ MENGINGAT ═══ */}
          <Section className="mb-8" id="mengingat">
            <h2 className="font-[family-name:var(--font-serif)] text-xl md:text-2xl font-bold text-ink mb-6 tracking-wide">
              {content.mengingat.judul}
            </h2>

            <div className="space-y-6">
              {content.mengingat.pasal.map((pasal, i) => (
                <div
                  key={i}
                  className="bg-cream/60 border border-gold/20 rounded-lg p-4 md:p-6"
                >
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-gold text-lg">§</span>
                    <h3 className="font-[family-name:var(--font-serif)] font-bold text-ink text-base md:text-lg">
                      {pasal.nomor}
                    </h3>
                  </div>
                  <p className="text-ink-light text-sm md:text-base leading-relaxed">
                    {pasal.isi}
                  </p>
                </div>
              ))}
            </div>
          </Section>

          <Divider />

          {/* ═══ MENGADILI ═══ */}
          <Section className="mb-8" id="mengadili">
            <h2 className="font-[family-name:var(--font-serif)] text-xl md:text-2xl font-bold text-ink mb-6 tracking-wide">
              {content.mengadili.judul}
            </h2>

            {/* Pernyataan mengadili */}
            <div className="space-y-3 mb-8">
              {content.mengadili.pernyataan.map((item, i) => (
                <div key={i} className="flex gap-3 items-start">
                  <span className="flex-shrink-0 text-red-accent font-bold text-sm mt-0.5">
                    {i + 1}.
                  </span>
                  <p className="text-ink-light text-sm md:text-base leading-relaxed">
                    {item}
                  </p>
                </div>
              ))}
            </div>

            {/* Tombol Palu */}
            <div className="text-center">
              {!gavelHit ? (
                <button
                  onClick={handleGavel}
                  className="bg-red-accent hover:bg-red-accent/90 text-white font-bold 
                             py-4 px-10 rounded-lg text-lg md:text-xl transition-all duration-300 
                             hover:scale-105 active:scale-95 cursor-pointer shadow-xl
                             animate-pulse-gold"
                >
                  {content.mengadili.tombolPalu}
                </button>
              ) : (
                <div className="relative">
                  {/* Stempel SAH: di HP tampil di atas pesan, di layar lebar menempel di pojok */}
                  {showStamp && (
                    <div className="inline-block mb-4 md:mb-0 md:absolute md:-top-4 md:right-4 animate-stamp pointer-events-none">
                      <div className="border-4 border-red-accent text-red-accent font-[family-name:var(--font-serif)] font-extrabold text-3xl md:text-4xl px-4 py-1 rounded-md opacity-70">
                        SAH
                      </div>
                    </div>
                  )}

                  {/* Pesan setelah palu */}
                  <div className="animate-fade-in-up">
                    <p className="font-[family-name:var(--font-serif)] text-2xl md:text-3xl font-extrabold text-gold mb-4">
                      {content.mengadili.pesanSetelahPalu}
                    </p>
                    <div className="text-5xl md:text-6xl animate-shake">🎓</div>
                  </div>
                </div>
              )}
            </div>

            {/* Terima / Banding */}
            <div
              ref={zonaTombolRef}
              className="relative mt-10 h-56 md:h-40 w-full rounded-lg border border-dashed border-gold/30 bg-cream/40"
            >
              <button
                ref={terimaRef}
                type="button"
                onClick={handleTerima}
                disabled={accepted}
                className="absolute z-10 top-6 left-1/2 -translate-x-1/2 md:top-[calc(50%-1.375rem)] md:left-4 md:translate-x-0 whitespace-nowrap bg-gold hover:bg-gold-light text-white font-semibold
                           py-2.5 px-4 rounded-lg text-sm md:text-base shadow-md transition-all duration-300
                           active:scale-95 cursor-pointer disabled:opacity-80 disabled:cursor-default"
              >
                {content.mengadili.tombolTerima}
              </button>
              <TombolBanding
                label={content.mengadili.tombolBanding}
                zoneRef={zonaTombolRef}
                avoidRef={terimaRef}
              />
            </div>
            {accepted && (
              <p className="mt-4 text-center font-[family-name:var(--font-serif)] text-base md:text-lg font-bold text-gold animate-fade-in-up">
                {content.mengadili.pesanDiterima}
              </p>
            )}
          </Section>

          <Divider />

          {/* ═══ BARANG BUKTI ═══ */}
          <Section className="mb-8" id="barang-bukti">
            <h2 className="font-[family-name:var(--font-serif)] text-xl md:text-2xl font-bold text-ink mb-6 tracking-wide">
              {content.barangBukti.judul}
            </h2>

            <div className="space-y-8">
              {content.barangBukti.item.map((item, i) => (
                <figure key={i}>
                  <div
                    className={`relative rounded-lg overflow-hidden border-2 border-gold/30 shadow-md bg-cream-dark/50 ${
                      item.tinggi > item.lebar ? "w-3/4 max-w-xs mx-auto" : "w-full"
                    }`}
                  >
                    <Image
                      src={item.foto}
                      alt={item.fotoAlt}
                      width={item.lebar}
                      height={item.tinggi}
                      className="block w-full h-auto"
                      sizes="(max-width: 768px) 90vw, 560px"
                    />
                    <span className="absolute top-2 left-2 bg-red-accent text-white text-[10px] md:text-xs font-bold tracking-wider px-2 py-1 rounded shadow">
                      {item.bukti}
                    </span>
                  </div>
                  <figcaption className="mt-3 text-center text-ink-light text-sm md:text-base">
                    <span className="font-bold text-ink">{item.bukti}:</span>{" "}
                    <span className="italic">{item.keterangan}</span>
                  </figcaption>
                </figure>
              ))}
            </div>
          </Section>

          <Divider />

          {/* ═══ SURAT PENUTUP ═══ */}
          <Section className="mb-4" id="penutup">
            <h2 className="font-[family-name:var(--font-serif)] text-xl md:text-2xl font-bold text-ink mb-6 tracking-wide">
              {content.penutup.judul}
            </h2>

            <div className="bg-cream/40 border border-gold/20 rounded-lg p-5 md:p-8">
              <div className="whitespace-pre-line text-ink-light text-sm md:text-base leading-relaxed">
                {content.penutup.isi}
              </div>
              <p className="mt-6 text-right font-[family-name:var(--font-serif)] text-lg md:text-xl font-bold italic text-ink">
                {content.penutup.pengirim}
              </p>
            </div>

            <LegalHr />

            {/* Tanda tangan */}
            <div className="text-center text-ink-light text-xs md:text-sm space-y-1">
              <p className="italic">{content.penutup.ditandatangani}</p>
              <p>{content.penutup.tanggalPutusan}</p>
            </div>
          </Section>

          {/* ═══ FOOTER ═══ */}
          <div className="mt-8 pt-4 border-t border-gold/20 text-center">
            <p className="text-ink-light/50 text-xs">
              Dokumen ini dibuat dengan sepenuh hati ❤️
            </p>
          </div>
        </div>
      </div>

      {/* Kontrol musik di pojok: nyala/mati + volume 0–100 */}
      {content.musik.src && (
      <div
        className="fixed bottom-4 right-4 z-50 flex items-center gap-2 rounded-full bg-parchment/95 border-2 border-gold
                   shadow-lg pl-1 pr-3 py-1 backdrop-blur-sm"
      >
        <button
          type="button"
          onClick={toggleMusik}
          aria-label={musicOn ? "Matikan musik" : "Nyalakan musik"}
          className="w-9 h-9 rounded-full text-lg flex items-center justify-center active:scale-90 transition-transform cursor-pointer"
        >
          {musicOn && volume > 0 ? "🔊" : "🔇"}
        </button>
        <input
          type="range"
          min={0}
          max={100}
          step={1}
          value={volume}
          onChange={(e) => ubahVolume(Number(e.target.value))}
          aria-label="Volume musik"
          className="w-20 md:w-28 accent-gold cursor-pointer"
        />
        <span className="w-7 text-right text-xs font-semibold text-ink-light tabular-nums">
          {volume}
        </span>
      </div>
      )}
    </main>
  );
}
