import { Pool } from "pg";

// Singleton pool instance untuk mencegah koneksi berlebihan di development (hot reload)
declare global {
  // eslint-disable-next-line no-var
  var _pgPool: Pool | undefined;
}

/**
 * Lazy pool getter — hanya membuat koneksi saat pertama kali dipanggil (runtime),
 * bukan saat module diload, agar tidak error saat build time.
 */
function getPool(): Pool {
  if (globalThis._pgPool) return globalThis._pgPool;

  const connectionString = process.env.DATABASE_URL;

  if (!connectionString) {
    throw new Error(
      "DATABASE_URL belum dikonfigurasi. Pastikan file .env.local sudah dibuat."
    );
  }

  globalThis._pgPool = new Pool({
    connectionString,
    max: 10,                   // maksimal 10 koneksi aktif
    idleTimeoutMillis: 30_000,
    connectionTimeoutMillis: 2_000,
  });

  return globalThis._pgPool;
}

/**
 * Helper untuk menjalankan query dengan auto-release client.
 * Pool dibuat secara lazy saat fungsi ini pertama kali dipanggil.
 */
export async function query<T = unknown>(
  text: string,
  params?: unknown[]
): Promise<T[]> {
  const pool = getPool();
  const client = await pool.connect();
  try {
    const result = await client.query<T & Record<string, unknown>>(text, params);
    return result.rows as T[];
  } finally {
    client.release();
  }
}
