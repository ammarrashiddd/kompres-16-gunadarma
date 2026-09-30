# Product

<!-- impeccable:product-schema 1 -->

## Platform
web

## Users
Masyarakat Indonesia yang membutuhkan informasi gempa terkini dan asisten kesiapsiagaan.

## Product Purpose
Platform kesiapsiagaan gempa dengan fitur peta gempa real-time (USGS), analisis risiko, dan asisten evakuasi AI.

## Positioning
Integrasi data USGS real-time dengan asisten evakuasi AI berbasis aturan keselamatan terstruktur di wilayah Indonesia.

## Operating Context
Dashboard digunakan untuk memantau aktivitas gempa terbaru secara visual dan mendapatkan arahan evakuasi yang aman saat diperlukan.

## Capabilities and Constraints
- Data: USGS FDSN Event Web Service (dibatasi wilayah Indonesia).
- AI: Claude API (terbatas penjelasan, bukan prediksi).
- Keamanan: Tidak ada prediksi gempa, wajib ada fallback, proteksi route NextAuth.

## Brand Commitments
- Ketegasan: Informasi keselamatan adalah prioritas.
- Fokus: Kesiapsiagaan bukan prediksi.

## Evidence on Hand
- Data gempa USGS: API proxy di `/api/earthquakes`.
- Peta: React-Leaflet.

## Product Principles
1. Keamanan Fisik Utama (Drop-Cover-Hold).
2. Data Deterministik (USGS).
3. AI sebagai Pendamping, Bukan Pengganti.
4. Keterbacaan & Kecepatan Respons.

## Accessibility & Inclusion
- UI kontras tinggi, responsif, dan mudah dibaca di mobile/desktop.
