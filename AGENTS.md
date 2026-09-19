# AGENTS.md — SIGAP AI

Panduan untuk AI coding agent (Claude Code, Cursor, Copilot, dll.) yang bekerja di repo ini. Baca file ini sebelum membuat perubahan apa pun. Referensi lengkap requirement produk ada di `PRD-SistemGempaAI.md` di root repo — file ini adalah turunan teknisnya untuk keperluan development sehari-hari.

## Ringkasan Proyek

SIGAP AI adalah platform kesiapsiagaan gempa untuk Indonesia: live earthquake map (USGS), analisis risiko lokasi, asisten evakuasi AI generatif, dan pelaporan komunitas. Dibangun dalam 15 hari oleh tim 3 orang untuk kompetisi software development bertema AI.

## Tech Stack

- **Framework**: Next.js 14+ (App Router, TypeScript)
- **Database**: PostgreSQL (hosted di Neon/Supabase)
- **ORM**: Prisma
- **Auth**: NextAuth.js (Credentials Provider, JWT session)
- **Styling**: Tailwind CSS + shadcn/ui
- **Peta**: React-Leaflet
- **AI/LLM**: Claude API (`@anthropic-ai/sdk`)
- **Data gempa**: USGS Earthquake GeoJSON feed (tanpa API key)
- **Upload gambar**: Uploadthing / Cloudinary
- **Data fetching**: TanStack Query
- **Hosting**: Vercel

## Setup & Perintah

```bash
# Install dependencies
npm install

# Setup environment variables (lihat bagian "Environment Variables")
cp .env.example .env

# Generate Prisma client & jalankan migrasi
npx prisma generate
npx prisma migrate dev

# Jalankan dev server
npm run dev

# Buka Prisma Studio untuk cek data
npx prisma studio

# Build production
npm run build

# Lint
npm run lint

# Type check
npm run type-check
```

Selalu jalankan `npm run lint` dan `npm run type-check` sebelum menganggap sebuah task selesai. Jika ada `npm run test`, jalankan juga sebelum menyelesaikan perubahan yang menyentuh logic (khususnya Risk Scoring Engine).

## Environment Variables

Jangan pernah hardcode secret di kode. Semua kredensial lewat `.env` (tidak di-commit — pastikan ada di `.gitignore`).

```
DATABASE_URL=
NEXTAUTH_SECRET=
NEXTAUTH_URL=
ANTHROPIC_API_KEY=
UPLOADTHING_TOKEN=      # atau CLOUDINARY_URL
```

Jika menambah integrasi baru yang butuh API key, tambahkan ke `.env.example` (dengan value kosong) — jangan hanya ke `.env`.

## Struktur Folder (target)

```
/app
  /(public)
    /page.tsx                  # Landing page
  /(auth)
    /login/page.tsx
    /register/page.tsx
  /(private)                   # protected route group
    /dashboard/page.tsx        # Live gempa map
    /risk-analysis/page.tsx
    /evacuation-assistant/page.tsx
    /community/page.tsx
  /api
    /auth/[...nextauth]/route.ts
    /earthquakes/route.ts      # proxy + cache USGS data
    /risk-analysis/route.ts
    /evacuation-assistant/route.ts
    /community/route.ts
/components
  /ui                          # shadcn components
  /map                         # peta & marker
  /chat                        # UI asisten evakuasi
/lib
  /prisma.ts                   # Prisma client singleton
  /usgs.ts                     # fetch & normalisasi data USGS
  /risk-engine.ts              # perhitungan skor risiko (rule-based, deterministik)
  /ai
    /claude.ts                 # wrapper client Claude API
    /prompts.ts                # system prompt terpusat
/prisma
  /schema.prisma
/types
```

Ikuti struktur ini kecuali ada alasan kuat untuk menyimpang — jika menyimpang, jelaskan alasannya di PR description.

## Konvensi Kode

- TypeScript strict mode, hindari `any`.
- Komponen React: functional component + hooks, PascalCase untuk nama file komponen (`EvacuationChat.tsx`).
- Server logic (fetch USGS, kalkulasi risiko, panggilan Claude API) selalu di server (Route Handler atau Server Action) — **jangan** panggil Claude API atau expose `ANTHROPIC_API_KEY` dari client.
- Gunakan Zod untuk validasi input di setiap API route/server action.
- Nama tabel/model Prisma: PascalCase singular (`User`, `RiskAnalysis`) — sudah didefinisikan di PRD bagian 9, jangan ubah struktur inti tanpa update PRD juga.
- Commit message: `feat:`, `fix:`, `chore:`, `docs:` prefix (conventional commits), singkat & jelas.

## Prinsip Desain AI (WAJIB DIPATUHI)

Ini bagian paling kritis dari proyek — pelanggaran terhadap prinsip ini bisa membuat output AI tidak reliable saat demo, atau berpotensi menyesatkan pengguna soal keselamatan.

1. **Pisahkan perhitungan dari narasi.** Skor risiko dihitung di `lib/risk-engine.ts` (deterministik, rule-based: frekuensi gempa historis, magnitudo rata-rata, kedalaman, jarak). Claude API HANYA dipanggil untuk menjelaskan angka yang sudah dihitung, bukan untuk menghasilkan angka. Jangan pernah minta LLM "hitung risikonya berapa persen" secara langsung tanpa data numerik yang sudah pasti sebagai konteks.
2. **Tidak ada klaim prediksi gempa.** Setiap output (UI maupun system prompt) harus tegas: ini estimasi risiko historis/statistik, bukan prediksi kapan gempa terjadi. Cek `lib/ai/prompts.ts` — jangan hapus baris disclaimer di system prompt.
3. **Guardrail keselamatan di system prompt asisten evakuasi** (`lib/ai/prompts.ts`):
   - Tidak boleh menyarankan tindakan berbahaya (mis. menggunakan lift saat gempa, kembali ke bangunan yang belum dinyatakan aman).
   - Harus selalu mengarahkan pengguna mengikuti arahan resmi BPBD/BNPB/petugas setempat sebagai otoritas utama, AI adalah pelengkap bukan pengganti.
   - Prioritaskan keselamatan fisik langsung (drop-cover-hold, dsb) sebelum instruksi soal barang bawaan.
4. **Gunakan structured output** (JSON) dari Claude untuk asisten evakuasi agar UI bisa merender `immediate_actions[]`, `items_to_bring[]`, `evacuation_direction` secara konsisten — jangan parse teks bebas dengan regex.
5. **Fallback wajib ada.** Jika panggilan ke Claude API atau USGS API gagal/timeout, tampilkan pesan fallback yang jelas ke pengguna — jangan biarkan halaman blank, error tanpa penanganan, atau infinite loading. Ini penting khususnya untuk demo langsung di depan juri.
6. **Batasi context window** percakapan asisten evakuasi (kirim beberapa pesan terakhir saja ke API, bukan seluruh histori) untuk kontrol biaya & latensi.

## Integrasi USGS

- Endpoint dasar: `https://earthquake.usgs.gov/fdsnws/event/1/query` (format GeoJSON).
- Untuk dashboard live: filter bounding box Indonesia — `minlatitude=-11&maxlatitude=6&minlongitude=95&maxlongitude=141`.
- Untuk analisis risiko historis: gunakan parameter radius (`latitude`, `longitude`, `maxradiuskm`) dan rentang waktu panjang (`starttime`/`endtime`).
- **Selalu cache** hasil fetch di server (mis. 5 menit) via route handler — jangan fetch langsung dari client tiap render, dan jangan spam request ke USGS saat development/testing.
- Verifikasi parameter aktual di dokumentasi resmi USGS FDSN Event Web Service sebelum implementasi karena skema publik bisa berubah dari waktu ke waktu.

## Auth & Proteksi Route

- Semua route di bawah `/dashboard`, `/risk-analysis`, `/evacuation-assistant`, `/community` (untuk aksi POST) harus dilindungi middleware NextAuth — redirect ke `/login` jika belum autentikasi.
- Landing page (`/`) dan feed komunitas (GET, read-only) tetap bisa diakses publik sesuai PRD bagian 8.1 dan 8.6.
- Password wajib di-hash dengan bcrypt sebelum disimpan — jangan pernah simpan plaintext, bahkan untuk data dummy/testing.

## Yang HARUS dihindari agent

- Jangan expose `ANTHROPIC_API_KEY` atau `DATABASE_URL` ke bundle client-side.
- Jangan menambah dependency besar tanpa alasan kuat — tim hanya punya 15 hari, prioritaskan library yang sudah ditentukan di PRD.
- Jangan mengubah skema Prisma inti (`User`, `RiskAnalysis`, `EvacuationSession`, `Message`, `CommunityPost`) tanpa menyesuaikan PRD bagian 9 juga, supaya dokumentasi & kode tidak drift.
- Jangan hardcode string system prompt di banyak tempat — selalu pusatkan di `lib/ai/prompts.ts`.
- Jangan implementasi fitur di luar scope MVP (lihat PRD bagian 5) kecuali diminta eksplisit — fokus ke penyelesaian MVP dulu mengingat timeline 15 hari.

## Testing Manual Sebelum Demo (checklist minimum)

- [ ] Dashboard menampilkan data gempa real-time (bukan data basi/cache lama)
- [ ] Analisis risiko diuji untuk minimal 3 kota (mis. Jakarta, Bekasi, Padang) dan hasilnya masuk akal
- [ ] Asisten evakuasi diuji dengan beberapa skenario konteks berbeda (indoor/outdoor, dekat pantai, ada lansia/bayi)
- [ ] Halaman komunitas ada data dummy agar tidak kosong saat demo
- [ ] Semua protected route benar-benar redirect ke login jika belum autentikasi
- [ ] Tidak ada API key yang bocor di client bundle (cek Network tab browser)
