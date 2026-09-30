# GTek

GTek adalah platform kesiapsiagaan gempa untuk masyarakat Indonesia. Aplikasi ini menggabungkan peta dan informasi gempa, analisis risiko lokasi, asisten evakuasi, serta laporan komunitas dalam satu aplikasi web.

> **Penting:** GTek bukan alat prediksi gempa dan tidak menggantikan BMKG, BNPB/BPBD, petugas lapangan, atau sumber informasi resmi lainnya. Saat keadaan darurat, utamakan keselamatan fisik dan ikuti arahan resmi setempat.

## Daftar Isi

- [Fitur](#fitur)
- [Teknologi](#teknologi)
- [Prasyarat](#prasyarat)
- [Menjalankan Secara Lokal](#menjalankan-secara-lokal)
- [Environment Variable](#environment-variable)
- [Struktur Aplikasi](#struktur-aplikasi)
- [Halaman Aplikasi](#halaman-aplikasi)
- [Referensi API](#referensi-api)
- [Model Data](#model-data)
- [Autentikasi dan Proteksi Route](#autentikasi-dan-proteksi-route)
- [Alur Fitur Utama](#alur-fitur-utama)
- [Deployment](#deployment)
- [Validasi dan Checklist Demo](#validasi-dan-checklist-demo)
- [Keterbatasan Saat Ini](#keterbatasan-saat-ini)
- [Troubleshooting](#troubleshooting)

## Fitur

- **Dashboard gempa:** menampilkan peta dan data gempa pada antarmuka berbasis React-Leaflet.
- **Analisis risiko:** menyimpan hasil analisis berdasarkan kota pengguna, skor kerentanan, kategori, dan fitur gempa.
- **Penjelasan Gemini:** menerjemahkan hasil analisis menjadi penjelasan Bahasa Indonesia terstruktur tanpa membuat skor baru.
- **Asisten evakuasi:** menghasilkan panduan berdasarkan situasi pengguna, kondisi khusus, dan konteks gempa.
- **Fallback keselamatan:** asisten evakuasi memiliki protokol rule-based jika layanan AI gagal.
- **Komunitas:** pengguna dapat membaca, mencari, memfilter, mengurutkan, membuat, mengubah, menghapus, dan memverifikasi laporan komunitas.
- **Profil:** pengguna dapat mengubah nama, avatar, kota pilihan, dan password.
- **Autentikasi:** registrasi/login email-password, Google OAuth, dan alur OAuth GitHub custom.

## Teknologi

- Next.js `16.3.5` dengan App Router
- React `19`
- TypeScript
- Prisma `6` dan PostgreSQL
- NextAuth `5` untuk Google OAuth
- JWT custom untuk login email-password dan integrasi OAuth custom
- Google Gemini melalui `@google/genai`
- React-Leaflet dan Leaflet
- ONNX Runtime Node untuk kesiapan integrasi model ML
- Biome untuk lint dan formatting
- Tailwind CSS `4`

## Prasyarat

- Node.js versi LTS yang kompatibel dengan Next.js 16
- npm
- PostgreSQL yang dapat diakses dari aplikasi
- Kredensial Google OAuth jika login Google ingin digunakan
- API key Gemini jika penjelasan analisis AI ingin digunakan

## Menjalankan Secara Lokal

1. Clone repository dan masuk ke folder project.
2. Install dependency:

   ```bash
   npm install
   ```

3. Buat file `.env` di root project dan isi variabel sesuai bagian [Environment Variable](#environment-variable).
4. Generate Prisma Client:

   ```bash
   npx prisma generate
   ```

5. Jalankan migration database:

   ```bash
   npx prisma migrate dev
   ```

6. Jalankan server development:

   ```bash
   npm run dev
   ```

7. Buka [http://localhost:3000](http://localhost:3000).

Untuk melihat isi database melalui Prisma Studio:

```bash
npx prisma studio
```

## Environment Variable

| Variabel               | Wajib                            | Kegunaan                                                                                         |
| ---------------------- | -------------------------------- | ------------------------------------------------------------------------------------------------ |
| `DATABASE_URL`         | Ya                               | Connection string PostgreSQL untuk Prisma.                                                       |
| `AUTH_SECRET`          | Ya untuk NextAuth                | Secret utama NextAuth. Kode juga menerima `NEXTAUTH_SECRET` atau `JWT_SECRET` sebagai fallback.  |
| `JWT_SECRET`           | Ya untuk JWT custom              | Secret signing token email-password dan OAuth custom jika `AUTH_SECRET` tidak digunakan bersama. |
| `NEXT_PUBLIC_APP_URL`  | Disarankan                       | URL publik aplikasi untuk membentuk callback OAuth. Contoh lokal: `http://localhost:3000`.       |
| `GOOGLE_CLIENT_ID`     | Jika Google OAuth digunakan      | Client ID dari Google Cloud OAuth.                                                               |
| `GOOGLE_CLIENT_SECRET` | Jika Google OAuth digunakan      | Client secret dari Google Cloud OAuth.                                                           |
| `GEMINI_API_KEY`       | Jika penjelasan Gemini digunakan | API key Google Gemini.                                                                           |

Contoh minimal:

```dotenv
DATABASE_URL="postgresql://user:password@localhost:5432/sigap_ai"
AUTH_SECRET="ganti-dengan-secret-acak-yang-panjang"
JWT_SECRET="ganti-dengan-secret-jwt-yang-berbeda"
NEXT_PUBLIC_APP_URL="http://localhost:3000"
GOOGLE_CLIENT_ID=""
GOOGLE_CLIENT_SECRET=""
GEMINI_API_KEY=""
```

Jangan commit file `.env` atau menaruh secret di client-side. Untuk deployment, masukkan variable melalui dashboard provider hosting.

### Konfigurasi Google OAuth

Tambahkan redirect URI berikut di Google Cloud Console:

```text
http://localhost:3000/api/auth/callback/google
```

Untuk production, gunakan domain production:

```text
https://domain-anda.example/api/auth/callback/google
```

## Struktur Aplikasi

```text
src/
  app/
    page.tsx                         Landing page
    dashboard/page.tsx               Dashboard gempa
    risk-analysis/                   Halaman analisis risiko
    evacuation-assistant/            Halaman asisten evakuasi
    community/                       Halaman laporan komunitas
    profile/                         Halaman profil pengguna
    login/                           Login
    register/                        Registrasi
    api/                             Route handler API
  components/                        Komponen UI per fitur
  lib/
    prisma.ts                        Singleton Prisma Client
    auth.ts                          Hash, verifikasi password, dan JWT
    server-auth.ts                   Resolusi user dari session atau token
    oauth.ts                         Helper OAuth custom
    namaDaerah/                      Daftar kota dan pencarian kota
    ml/                              Artefak model ONNX
  auth.ts                             Konfigurasi NextAuth
  proxy.ts                            Proteksi halaman berdasarkan token
prisma/
  schema.prisma                       Schema database
  migrations/                         Migration PostgreSQL
public/                               Asset publik
```

## Halaman Aplikasi

| Path                    | Akses       | Fungsi                                                 |
| ----------------------- | ----------- | ------------------------------------------------------ |
| `/`                     | Publik      | Landing page dan pengenalan SIGAP AI.                  |
| `/login`                | Belum login | Login email-password atau Google.                      |
| `/register`             | Belum login | Membuat akun baru.                                     |
| `/dashboard`            | Login       | Peta dan dashboard gempa.                              |
| `/risk-analysis`        | Login       | Menjalankan dan melihat analisis risiko kota pengguna. |
| `/evacuation-assistant` | Login       | Mendapatkan panduan evakuasi berbasis situasi.         |
| `/community`            | Login       | Membaca dan mengelola laporan komunitas.               |
| `/profile`              | Login       | Mengubah profil, kota, avatar, dan password.           |

## Referensi API

Semua endpoint menggunakan JSON jika menerima body. Endpoint yang membutuhkan login menerima session cookie atau token JWT custom melalui cookie `auth_token` atau header `Authorization: Bearer <token>`.

### Autentikasi

| Method        | Endpoint                    | Login | Ringkasan                                                                                          |
| ------------- | --------------------------- | ----- | -------------------------------------------------------------------------------------------------- |
| `POST`        | `/api/auth/register`        | Tidak | Registrasi dengan `nama`, `email`, `password`, dan `confirmPassword`. Password minimal 8 karakter. |
| `POST`        | `/api/auth/login`           | Tidak | Login email-password dan mengembalikan JWT custom.                                                 |
| `GET`, `POST` | `/api/auth/[...nextauth]`   | Tidak | Handler NextAuth, termasuk session Google.                                                         |
| `GET`         | `/api/auth/google`          | Tidak | Memulai alur Google OAuth custom.                                                                  |
| `GET`         | `/api/auth/google/callback` | Tidak | Callback Google OAuth custom.                                                                      |
| `GET`         | `/api/auth/github`          | Tidak | Memulai alur GitHub OAuth custom.                                                                  |
| `GET`         | `/api/auth/github/callback` | Tidak | Callback GitHub OAuth custom.                                                                      |

Respons login berhasil berisi `success`, `message`, `token`, dan data user. Token custom dapat dikirim sebagai:

```http
Authorization: Bearer <token>
```

### Kota dan profil

| Method | Endpoint            | Login | Ringkasan                                                                     |
| ------ | ------------------- | ----- | ----------------------------------------------------------------------------- |
| `GET`  | `/api/cities`       | Tidak | Mengambil daftar kota yang tersedia untuk pilihan lokasi.                     |
| `GET`  | `/api/user/profile` | Ya    | Mengambil profil user aktif.                                                  |
| `PUT`  | `/api/user/profile` | Ya    | Mengubah nama, avatar, kota, atau password. Password baru minimal 8 karakter. |

Saat mengisi `cityName`, kota harus berasal dari daftar yang tersedia. Aplikasi menyimpan nama serta latitude/longitude kota secara bersamaan.

### Analisis risiko dan Gemini

| Method | Endpoint             | Login | Ringkasan                                                                                |
| ------ | -------------------- | ----- | ---------------------------------------------------------------------------------------- |
| `GET`  | `/api/risk-analysis` | Ya    | Mengambil analisis tersimpan terbaru untuk kota user beserta penjelasan Gemini jika ada. |
| `POST` | `/api/risk-analysis` | Ya    | Membuat dan menyimpan analisis untuk kota user. User harus sudah memilih kota di profil. |
| `POST` | `/api/ai-gemini`     | Ya    | Membuat penjelasan Gemini untuk `analysisId` milik user.                                 |

Contoh body untuk membuat penjelasan Gemini:

```json
{
  "analysisId": 1
}
```

Output terstruktur Gemini memiliki field:

```json
{
  "summary": "...",
  "riskInterpretation": "...",
  "keyFactors": ["...", "...", "...", "...", "...", "..."],
  "disclaimer": "..."
}
```

Gemini hanya menjelaskan hasil yang sudah tersimpan. Skor, kategori, dan fitur ML tidak boleh dibuat ulang oleh model. Jika Gemini gagal, hasil analisis tetap tersimpan dan status advice menjadi `FAILED`.

### Asisten evakuasi

| Method | Endpoint                    | Login                                | Ringkasan                                                  |
| ------ | --------------------------- | ------------------------------------ | ---------------------------------------------------------- |
| `POST` | `/api/evacuation-assistant` | Ditentukan oleh implementasi halaman | Menghasilkan panduan evakuasi AI atau fallback rule-based. |

Input mendukung konteks berikut:

```json
{
  "magnitude": 5.8,
  "depthKm": 32.8,
  "distanceKm": 68.2,
  "userSituation": "indoor",
  "specialConditions": ["ada_lansia"],
  "locationName": "Bandung"
}
```

Nilai `userSituation` yang tersedia: `indoor`, `highrise`, `outdoor`, `coastal`, dan `driving`. Output mencakup tingkat urgensi, tindakan segera, peringatan bahaya, barang penting, arah evakuasi, kontak darurat, disclaimer, dan sumber output (`ai` atau `protocol_fallback`).

### Komunitas

| Method   | Endpoint                     | Login                    | Ringkasan                                                                  |
| -------- | ---------------------------- | ------------------------ | -------------------------------------------------------------------------- |
| `GET`    | `/api/community`             | Tidak wajib              | Feed laporan dengan filter `search`, `damageLevel`, `sortBy`, dan `limit`. |
| `POST`   | `/api/community`             | Ya                       | Membuat laporan baru. Field wajib: `title`, `description`, `locationName`. |
| `GET`    | `/api/community/[id]`        | Tidak/tergantung handler | Mengambil detail laporan.                                                  |
| `PUT`    | `/api/community/[id]`        | Ya                       | Mengubah laporan milik user.                                               |
| `DELETE` | `/api/community/[id]`        | Ya                       | Menghapus laporan milik user.                                              |
| `POST`   | `/api/community/[id]/verify` | Ya                       | Menambah verifikasi komunitas pada laporan.                                |

Nilai `damageLevel` yang diterima: `RINGAN`, `SEDANG`, `BERAT`, dan `DARURAT`. Nilai `sortBy` yang tersedia adalah `recent` dan `verified`. `limit` dibatasi maksimal 100 item.

Contoh query:

```text
/api/community?search=Bandung&damageLevel=BERAT&sortBy=verified&limit=20
```

## Model Data

Database PostgreSQL dikelola menggunakan Prisma. Model utama:

- **`User`**: identitas, kredensial ter-hash, avatar, dan kota pilihan.
- **`RiskAnalysis`**: hasil analisis per user, lokasi, skor, kategori, lima fitur risiko, versi model, dan output mentah.
- **`GeminiAdvice`**: status dan output terstruktur penjelasan Gemini untuk satu analisis risiko.
- **`CommunityPost`**: laporan komunitas, tingkat kerusakan, lokasi, gambar, dan jumlah verifikasi.

Relasi penting:

```text
User 1 ─── * RiskAnalysis 1 ─── 0..1 GeminiAdvice
User 1 ─── * CommunityPost
```

Setelah mengubah `prisma/schema.prisma`, jalankan:

```bash
npx prisma migrate dev --name nama-perubahan
npx prisma generate
```

## Autentikasi dan Proteksi Route

Resolusi user di server dilakukan oleh `src/lib/server-auth.ts` dengan urutan:

1. Session NextAuth, terutama Google OAuth.
2. Cookie `auth_token`.
3. Header `Authorization: Bearer <token>`.

`src/proxy.ts` melindungi `/dashboard`, `/community`, `/risk-analysis`, `/evacuation-assistant`, dan `/profile`. Halaman `/login`, `/register`, dan `/auth` mengarahkan user yang sudah login ke dashboard.

Password email-password di-hash menggunakan bcryptjs. Password tidak disimpan dalam bentuk plaintext.

## Alur Fitur Utama

### Analisis risiko

1. User memilih kota di halaman profil.
2. Client memanggil `POST /api/risk-analysis`.
3. Server menghasilkan hasil analisis, menyimpan `RiskAnalysis`, lalu mengembalikan `analysisId`.
4. Client dapat memanggil `POST /api/ai-gemini` menggunakan `analysisId`.
5. Penjelasan Gemini disimpan sebagai `GeminiAdvice` dan dapat diambil melalui `GET /api/risk-analysis`.

### Asisten evakuasi

1. User memasukkan situasi fisik dan konteks gempa.
2. Server mencoba menghasilkan output AI terstruktur.
3. Jika AI gagal, server menggunakan panduan rule-based yang tetap menyediakan tindakan keselamatan.
4. Pengguna tetap harus mengikuti instruksi BMKG, BNPB/BPBD, dan petugas setempat.

### Laporan komunitas

1. Pengunjung dapat membaca feed laporan.
2. User login dapat membuat laporan dengan kota dari daftar yang tersedia.
3. Komunitas dapat memfilter dan mengurutkan laporan.
4. User dapat memverifikasi laporan melalui endpoint verifikasi.

## Script NPM

| Command          | Fungsi                                  |
| ---------------- | --------------------------------------- |
| `npm run dev`    | Menjalankan Next.js development server. |
| `npm run build`  | Membuat build production.               |
| `npm run start`  | Menjalankan build production.           |
| `npm run lint`   | Menjalankan `biome check`.              |
| `npm run format` | Memformat source menggunakan Biome.     |

Validasi TypeScript dapat dijalankan langsung dengan:

```bash
npx tsc --noEmit
```

Repository ini belum menyediakan script `test` khusus.

## Deployment

Deployment yang disarankan adalah Vercel dengan PostgreSQL managed seperti Neon atau Supabase.

1. Push repository ke provider Git.
2. Import repository ke Vercel.
3. Tambahkan seluruh environment variable production.
4. Pastikan `DATABASE_URL` menunjuk ke database production.
5. Jalankan migration production dari environment yang memiliki akses database:

   ```bash
   npx prisma migrate deploy
   ```

6. Perbarui callback OAuth agar menggunakan domain production.
7. Deploy dan uji login, halaman privat, analisis risiko, Gemini, asisten evakuasi, serta komunitas.

Jangan menjalankan `prisma migrate dev` pada database production.

## Validasi dan Checklist Demo

Sebelum demo atau release, jalankan:

```bash
npm run lint
npx tsc --noEmit
npm run build
```

Checklist fungsional:

- [ ] Registrasi menolak email invalid dan password di bawah 8 karakter.
- [ ] Login berhasil membuat token dan dapat membuka dashboard.
- [ ] Route privat mengarahkan user anonim ke `/login`.
- [ ] Google OAuth kembali ke dashboard dengan benar.
- [ ] Profil dapat menyimpan kota dari daftar yang tersedia.
- [ ] Analisis risiko hanya bisa dibuat setelah kota dipilih.
- [ ] Analisis tersimpan dapat dibaca kembali setelah refresh.
- [ ] Gemini menghasilkan JSON dengan enam `keyFactors`.
- [ ] Kegagalan Gemini tidak menghapus hasil analisis.
- [ ] Fallback asisten evakuasi tersedia ketika AI gagal.
- [ ] Laporan komunitas dapat dicari, difilter, dan diurutkan.
- [ ] User tidak dapat mengubah atau menghapus laporan milik user lain.
- [ ] Tidak ada secret yang masuk ke bundle client atau response API.

## Keterbatasan Saat Ini

- Endpoint analisis risiko saat ini menggunakan hasil model deterministik yang tertanam di route sebagai simulasi. Artefak ONNX tersedia, tetapi route belum menjalankan inferensi ONNX untuk menghitung hasil dinamis.
- README ini mendokumentasikan endpoint yang ada di source saat ini; endpoint USGS langsung belum tersedia sebagai route terpisah di struktur aplikasi.
- Tidak ada suite automated test atau script `npm run test` di repository.
- `.env.example` belum tersedia. Gunakan tabel environment variable di atas sebagai checklist konfigurasi, lalu tambahkan template env secara terpisah jika diperlukan oleh workflow tim.
- Status autentikasi pada proxy terutama dideteksi dari keberadaan token. Validasi user sebenarnya dilakukan kembali oleh endpoint server melalui `getAuthenticatedUser`.
- Output AI adalah bantuan penjelasan dan panduan, bukan sumber keputusan keselamatan utama.

## Troubleshooting

### Prisma gagal terhubung

- Periksa format `DATABASE_URL`.
- Pastikan PostgreSQL aktif dan dapat diakses dari mesin atau deployment.
- Jalankan `npx prisma generate` setelah instalasi dependency.
- Untuk database baru, jalankan `npx prisma migrate dev`.

### Login Google gagal

- Pastikan `GOOGLE_CLIENT_ID` dan `GOOGLE_CLIENT_SECRET` terisi.
- Pastikan redirect URI di Google Cloud Console sama persis dengan URL aplikasi.
- Pastikan `NEXT_PUBLIC_APP_URL` mengarah ke origin yang benar.

### Gemini tidak menghasilkan penjelasan

- Pastikan `GEMINI_API_KEY` tersedia di server.
- Periksa log server dan status `GeminiAdvice`.
- Pastikan `analysisId` valid dan memang milik user yang sedang login.
- Hasil analisis risiko tetap dapat digunakan walaupun advice Gemini berstatus `FAILED`.

### User terus diarahkan ke login

- Pastikan cookie `auth_token` atau session NextAuth tersimpan.
- Jika memakai JWT custom, kirim token pada cookie atau header `Authorization`.
- Pastikan `JWT_SECRET` konsisten antara proses login dan request berikutnya.

### Build atau lint gagal

```bash
npm run lint
npx tsc --noEmit
npm run build
```

Baca error pertama yang muncul terlebih dahulu karena error berikutnya sering merupakan efek berantai.

## Dokumentasi Terkait

- [PRODUCT.md](PRODUCT.md) - tujuan produk, prinsip keselamatan, dan konteks penggunaan.
- [AGENTS.md](AGENTS.md) - panduan teknis dan aturan kontribusi untuk repository.
- [prisma/schema.prisma](prisma/schema.prisma) - definisi model database.
