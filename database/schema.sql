-- ============================================================
-- Schema: Sistem Autentikasi JWT
-- Database: PostgreSQL
-- ============================================================

-- Buat tabel users
CREATE TABLE IF NOT EXISTS users (
    id          SERIAL PRIMARY KEY,
    nama        VARCHAR(100)        NOT NULL,
    email       VARCHAR(255)        NOT NULL UNIQUE,
    password    VARCHAR(255)        NOT NULL,   -- bcrypt hash
    created_at  TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Index untuk mempercepat pencarian berdasarkan email
CREATE INDEX IF NOT EXISTS idx_users_email ON users (email);

-- Contoh: verifikasi tabel berhasil dibuat
-- SELECT * FROM users;
