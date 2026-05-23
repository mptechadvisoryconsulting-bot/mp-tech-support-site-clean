import Link from "next/link";

export default function HomePage() {
  return (
    <main className="app-shell">
      <section className="workspace">
        <header className="topbar">
          <Link className="brand" href="/">
            <img className="brand-logo" src="/mp-technology-logo.png" alt="" />
            <span>MP Technology QR</span>
          </Link>
          <nav aria-label="Primary">
            <Link href="/login">Log in</Link>
            <Link href="/signup">Start</Link>
          </nav>
        </header>

        <section className="hero">
          <div>
            <p className="eyebrow">QR SaaS platform</p>
            <h1>Sell branded QR workspaces with customer logins.</h1>
          </div>
          <div className="trust-strip">
            <div>
              <span>Auth</span>
              <small>Accounts</small>
            </div>
            <div>
              <span>Brand</span>
              <small>Logo Kits</small>
            </div>
            <div>
              <span>Track</span>
              <small>Scans</small>
            </div>
            <div>
              <span>Export</span>
              <small>PNG</small>
            </div>
          </div>
        </section>

        <section className="generator-grid">
          <div className="panel">
            <p className="eyebrow">Offer</p>
            <h2>Customer-ready QR generator</h2>
            <p className="lead">
              Customers can sign in, save branded QR codes, download assets, and use dynamic links that record scan
              activity before redirecting visitors.
            </p>
            <div className="export-actions">
              <Link className="primary-button" href="/signup">Create account</Link>
              <Link className="secondary-button" href="/login">Customer login</Link>
            </div>
          </div>

          <div className="panel">
            <p className="eyebrow">Plans</p>
            <div className="plan-list">
              <div><strong>Free</strong><span>Static branded QR downloads</span></div>
              <div><strong>Pro</strong><span>Saved code library and brand presets</span></div>
              <div><strong>Business</strong><span>Dynamic links and scan analytics</span></div>
            </div>
          </div>
        </section>
      </section>
    </main>
  );
}
