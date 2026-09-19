import Navbar from "@/components/navbar/page";
import Link from "next/link";

export default function HomePage() {
  return (
    <main className="p-8">
      <nav>
        <Navbar />
      </nav>
      <div>tes</div>
    <main className="landing-page">
      {/* Background animated blobs */}
      <div className="blob blob--1" aria-hidden="true" />
      <div className="blob blob--2" aria-hidden="true" />
      <div className="blob blob--3" aria-hidden="true" />

      <div className="landing-content">
        {/* Brand */}
        <div className="landing-brand">
          <div className="auth-logo">
            <svg
              width="40"
              height="40"
              viewBox="0 0 32 32"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              aria-hidden="true"
            >
              <rect width="32" height="32" rx="10" fill="url(#homeLogoGrad)" />
              <path
                d="M8 16C8 11.582 11.582 8 16 8C20.418 8 24 11.582 24 16"
                stroke="white"
                strokeWidth="2.5"
                strokeLinecap="round"
              />
              <circle cx="16" cy="20" r="4" fill="white" />
              <defs>
                <linearGradient id="homeLogoGrad" x1="0" y1="0" x2="32" y2="32">
                  <stop offset="0%" stopColor="#6366f1" />
                  <stop offset="100%" stopColor="#a855f7" />
                </linearGradient>
              </defs>
            </svg>
          </div>
          <span className="auth-brand-name landing-brand-name">AuthSecure</span>
        </div>

        {/* Hero */}
        <div className="landing-hero">
          <div className="landing-badge">🔐 Sistem Autentikasi JWT</div>
          <h1 className="landing-title">
            Keamanan Akun yang
            <br />
            <span className="landing-title-gradient">Andal & Modern</span>
          </h1>
          <p className="landing-description">
            Sistem autentikasi berbasis JSON Web Token dengan enkripsi bcrypt.
            Daftar dan masuk dengan aman ke platform kami.
          </p>

          {/* Features */}
          <div className="landing-features">
            <div className="feature-item">
              <span className="feature-icon">🛡️</span>
              <span>Password terenkripsi bcrypt</span>
            </div>
            <div className="feature-item">
              <span className="feature-icon">⚡</span>
              <span>JWT dengan expiry 7 hari</span>
            </div>
            <div className="feature-item">
              <span className="feature-icon">🗄️</span>
              <span>Database PostgreSQL</span>
            </div>
          </div>

          {/* CTA Buttons */}
          <div className="landing-cta">
            <Link href="/register" id="cta-register" className="btn-primary btn-primary--lg">
              Mulai Sekarang
            </Link>
            <Link href="/login" id="cta-login" className="btn-outline">
              Sudah Punya Akun? Masuk
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
