import Navbar from "@/components/navbar/page";

export default function HomePage() {
  return (
    <main className="landing-page">
      {/* Background animated blobs */}
      <div className="blob blob--1" aria-hidden="true" />
      <div className="blob blob--2" aria-hidden="true" />
      <div className="blob blob--3" aria-hidden="true" />

      {/* Navbar */}
      <nav className="fixed top-0 left-0 right-0 z-50 px-6 py-4 md:px-12">
        <Navbar />
      </nav>

      <div className="landing-content">
        {/* Hero */}
        <div className="landing-hero">
          <div className="landing-badge">🔐 Sistem Autentikasi JWT</div>
          <h1 className="landing-title">
            Keamanan Akun yang
            <br />
            <span className="landing-title-gradient">Andal &amp; Modern</span>
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
        </div>
      </div>
    </main>
  );
}
