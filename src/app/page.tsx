import Link from "next/link";

export default function Home() {
  return (
    <>
      <header className="header">
        <div className="logo">
          TMB<span>Connect</span>
        </div>
      </header>

      <main className="container">
        <div className="info-badge pulse mb-4" style={{ marginBottom: "1rem" }}>
          <span className="live-indicator"></span>
          Sistema Operativo
        </div>
        <h1 className="dashboard-title">
          Red de Transporte Barcelona
        </h1>
        <p className="dashboard-subtitle">
          Monitorización en tiempo real de la flota, incidencias y flujo de pasajeros en la ciudad. 
          Integrado con servicios API públicos para datos actualizados al instante.
        </p>

        <div className="card-grid">
          <Link href="/lineas" className="glass-card" style={{ textDecoration: 'none' }}>
            <div className="card-title">
              Metro (Líneas)
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M19 17h2c.6 0 1-.4 1-1v-3c0-.9-.7-1.7-1.5-1.9C18.7 10.6 16 10 16 10s-1.3-1.4-2.2-2.3c-.5-.4-1.1-.7-1.8-.7H5c-.6 0-1.1.4-1.4.9l-1.4 2.9A3.7 3.7 0 0 0 2 12v4c0 .6.4 1 1 1h2"/>
                <circle cx="7" cy="17" r="2"/>
                <path d="M9 17h6"/>
                <circle cx="17" cy="17" r="2"/>
              </svg>
            </div>
            <div className="card-value" style={{ fontSize: '1.6rem' }}>Ver recorridos</div>
            <div style={{ color: "var(--text-muted)", fontSize: "0.9rem" }}>Haz clic para explorar los trayectos subterráneos</div>
          </Link>

          <Link href="/bus/lineas" className="glass-card" style={{ textDecoration: 'none' }}>
            <div className="card-title">
              Autobuses
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="2" y="3" width="20" height="14" rx="2" ry="2"/>
                <line x1="8" y1="21" x2="16" y2="21"/>
                <line x1="12" y1="17" x2="12" y2="21"/>
              </svg>
            </div>
            <div className="card-value" style={{ fontSize: '1.6rem' }}>Ver flota</div>
            <div style={{ color: "var(--text-muted)", fontSize: "0.9rem" }}>Consultar recorridos de autobuses urbanos TMB</div>
          </Link>
        </div>
      </main>
    </>
  );
}
