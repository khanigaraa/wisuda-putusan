// Proxy (nama baru "middleware" di Next.js 16).
// Mengunci SELURUH website — halaman, foto, dan musik di folder public —
// sampai pengunjung memasukkan kode perkara yang benar di /akses.
import { NextResponse, type NextRequest } from "next/server";
import { COOKIE_AKSES, cookieValid } from "@/lib/akses";

// Boleh dibuka tanpa kode: halaman akses dan pengecek kodenya.
const BEBAS = ["/akses", "/api/akses"];

export function proxy(request: NextRequest) {
  const { pathname, search } = request.nextUrl;
  const sudahMasuk = cookieValid(request.cookies.get(COOKIE_AKSES)?.value);
  const bebas = BEBAS.some((p) => pathname === p || pathname.startsWith(p + "/"));

  // Sudah punya kode tapi membuka /akses → langsung ke berkas.
  if (sudahMasuk && pathname === "/akses") {
    return NextResponse.redirect(new URL("/", request.url));
  }

  if (sudahMasuk || bebas) return NextResponse.next();

  // Belum masuk: arahkan ke /akses, ingat tujuan awalnya.
  const url = new URL("/akses", request.url);
  if (pathname !== "/") url.searchParams.set("ke", pathname + search);
  return NextResponse.redirect(url);
}

export const config = {
  // Semua request kecuali file JS/CSS/font bawaan Next (dibutuhkan halaman /akses
  // itu sendiri; isinya tidak memuat foto atau musik) dan favicon.
  // _next/image (foto yang dioptimasi) dan semua file di public TETAP dikunci.
  matcher: ["/((?!_next/static|favicon.ico).*)"],
};
