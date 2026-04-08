import Link from "next/link";

// Server Component Fetch a la API de TMB
async function getLinias() {
  const appId = process.env.TMB_APP_ID;
  const appKey = process.env.TMB_APP_KEY;

  if (!appId || !appKey) {
    console.warn("Faltan credenciales TMB_APP_ID o TMB_APP_KEY en tu archivo .env");
    return [];
  }

  try {
    // Solicitamos las líneas de Metro a TMB. Puedes cambiar a /bus si lo deseas.
    const url = `https://api.tmb.cat/v1/transit/linies/metro?app_id=${appId}&app_key=${appKey}`;

    // next: { revalidate: 60 } cacheará por 60 segundos antes de volver a llamar, muy útil para APIs públicas rápidas.
    const res = await fetch(url, { next: { revalidate: 60 } });

    if (!res.ok) {
      console.error("Error contactando TMB", res.status);
      return [];
    }

    const data = await res.json();
    return data.features || [];
  } catch (error) {
    console.error("Fallo obteniendo las líneas:", error);
    return [];
  }
}

export default async function Lineas() {
  const lineas = await getLinias();

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
          Exploración de API
        </div>
        <h1 className="dashboard-title" style={{ fontSize: '2.5rem' }}>
          Líneas Operativas
        </h1>
        <p className="dashboard-subtitle">
          Listado de las líneas de metro obtenidas desde la API oficial de TMB.
        </p>

        <div className="card-grid">
          {lineas.length === 0 ? (
            <div className="glass-card" style={{ gridColumn: "1 / -1", textAlign: "center" }}>
              <p style={{ color: "var(--text-muted)", fontSize: "1.1rem" }}>
                No se obtuvieron datos. Asegúrate de añadir <strong>TMB_APP_ID</strong> y <strong>TMB_APP_KEY</strong> correctos en tu archivo <code>.env</code>
              </p>
            </div>
          ) : (
            lineas.map((linea: any, index: number) => {
              // La API devuelve propiedades dinámicas en formato GeoJSON Feature
              const info = linea.properties || {};
              const nombre = info.NOM_LINIA || `M${index}`;
              const color = info.COLOR_LINIA ? `#${info.COLOR_LINIA}` : "var(--primary)";
              const descripcion = info.DESC_LINIA || 'Descripción de ruta no disponible';

              return (
                <Link
                  href={`/lineas/${info.CODI_LINIA}`}
                  className="glass-card"
                  key={info.CODI_LINIA || index}
                  style={{ textDecoration: 'none', display: 'flex' }}
                >
                  <div className="card-title">
                    Línea {nombre}
                    <span style={{
                      backgroundColor: color,
                      color: 'white',
                      padding: '0.2rem 0.6rem',
                      borderRadius: '4px',
                      fontSize: '1rem',
                      fontWeight: 800,
                    }}>
                      {nombre}
                    </span>
                  </div>
                  <div style={{ margin: '0.8rem 0' }}>
                    <strong style={{ opacity: 0.9 }}>Estado:</strong> <span style={{ color: '#10B981' }}>Servicio normal</span>
                  </div>
                  <div style={{ color: "var(--text-muted)", fontSize: "0.9rem", lineHeight: 1.4 }}>
                    {descripcion}
                  </div>
                </Link>
              );
            })
          )}
        </div>
      </main>
    </>
  );
}
