import Link from "next/link";
import BusListClient from "./BusListClient";

// Server Component Fetch a la API de TMB para autobuses
async function getAutobuses() {
  const appId = process.env.TMB_APP_ID;
  const appKey = process.env.TMB_APP_KEY;
  
  if (!appId || !appKey) return [];

  try {
    const url = `https://api.tmb.cat/v1/transit/linies/bus?app_id=${appId}&app_key=${appKey}`;
    const res = await fetch(url, { next: { revalidate: 60 } });
    
    if (!res.ok) return [];
    
    const data = await res.json();
    return data.features || [];
  } catch (error) {
    console.error(error);
    return [];
  }
}

export default async function BusLineas() {
  const autobuses = await getAutobuses();

  return (
    <>
      <header className="header">
        <div className="logo">
          TMB<span>Connect</span>
        </div>
        <Link href="/" className="btn-primary" style={{ textDecoration: 'none' }}>
          Volver al Inicio
        </Link>
      </header>

      <main className="container">
        <div className="info-badge mb-4" style={{ marginBottom: "1rem" }}>
          Flota Metropolitana
        </div>
        <h1 className="dashboard-title" style={{ fontSize: '2.5rem' }}>
          Autobuses Operativos
        </h1>
        <p className="dashboard-subtitle">
          Listado de las líneas de autobús obtenidas desde la API oficial en tiempo real.
        </p>

        {autobuses.length === 0 ? (
          <div className="card-grid">
            <div className="glass-card" style={{ gridColumn: "1 / -1", textAlign: "center" }}>
              <p style={{ color: "var(--text-muted)", fontSize: "1.1rem" }}>
                No se obtuvieron datos. Asegúrate de añadir <strong>TMB_APP_ID</strong> y <strong>TMB_APP_KEY</strong>.
              </p>
            </div>
          </div>
        ) : (
          <BusListClient autobuses={autobuses} />
        )}
      </main>
    </>
  );
}
