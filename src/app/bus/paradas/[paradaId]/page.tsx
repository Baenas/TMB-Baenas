import Link from "next/link";

async function getLlegadasIBus(paradaId: string) {
  const appId = process.env.TMB_APP_ID;
  const appKey = process.env.TMB_APP_KEY;
  
  if (!appId || !appKey) return [];

  try {
    // Solicitamos a la API de iBus los tiempos de espera para la parada dada
    const url = `https://api.tmb.cat/v1/ibus/stops/${paradaId}?app_id=${appId}&app_key=${appKey}`;
    // No usamos caché para los tiempos de espera, porque deben ser en tiempo real siempre (o muy baja duración).
    const res = await fetch(url, { cache: 'no-store' });
    
    if (!res.ok) return [];
    
    const data = await res.json();
    return data.data?.ibus || [];
  } catch (error) {
    console.error(error);
    return [];
  }
}

export default async function ParadaInfo(props: { params: Promise<{ paradaId: string }> }) {
  const { paradaId } = await props.params;
  const llegadas = await getLlegadasIBus(paradaId);

  return (
    <>
      <header className="header">
        <div className="logo">
          TMB<span>Connect</span>
        </div>
        <Link href="/bus/lineas" className="btn-primary" style={{ textDecoration: 'none' }}>
          Volver a Autobuses
        </Link>
      </header>

      <main className="container" style={{ alignItems: 'flex-start' }}>
        <div className="info-badge mb-4" style={{ marginBottom: "1rem", backgroundColor: '#FFEBEA', color: 'var(--primary)' }}>
          Panel en vivo (iBus)
        </div>
        <h1 className="dashboard-title" style={{ fontSize: '2.5rem', textAlign: 'left' }}>
          Parada #{paradaId}
        </h1>
        <p className="dashboard-subtitle" style={{ textAlign: 'left', marginBottom: '2rem' }}>
          Tiempo de llegada estimado para los próximos autobuses.
        </p>

        <div className="card-grid">
          {llegadas.length === 0 ? (
            <div className="glass-card" style={{ gridColumn: '1 / -1' }}>
              <p style={{ color: "var(--text-muted)", fontSize: "1.05rem", textAlign: "center" }}>
                Actualmente no hay estimaciones de llegada para esta parada, está fuera de servicio o el identificador es incorrecto.
              </p>
            </div>
          ) : (
            llegadas.map((llegada: any, idx: number) => {
              const linea = llegada.line || "?";
              const destino = llegada.destination || "Destino desconocido";
              // El tiempo se envía en catalán como "5 min", "Imminent", etc.
              const tiempoTexto = llegada["text-ca"] || llegada.text_ca || "N/A";
              // Si el tiempo es Inminente podemos pintarlo rojo/naranja
              const isInminent = tiempoTexto.toLowerCase().includes("imminent");

              return (
                <div key={idx} className="glass-card" style={{
                  display: 'flex', 
                  flexDirection: 'row', 
                  alignItems: 'center', 
                  justifyContent: 'space-between',
                  borderLeft: `4px solid ${isInminent ? 'var(--primary)' : 'var(--secondary)'}`
                }}>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <span style={{ 
                        backgroundColor: 'var(--secondary)', 
                        color: 'white', 
                        padding: '0.2rem 0.6rem', 
                        borderRadius: '4px', 
                        fontSize: '1.2rem',
                        fontWeight: 800
                      }}>
                        {linea}
                      </span>
                      <strong style={{ fontSize: '1.1rem', color: 'var(--text-main)' }}>
                        Dir: {destino}
                      </strong>
                    </div>
                  </div>
                  
                  <div style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'flex-end',
                    justifyContent: 'center'
                  }}>
                    <span style={{ 
                      fontSize: '2.8rem', 
                      fontWeight: 800, 
                      color: isInminent ? 'var(--primary)' : 'var(--text-main)',
                      lineHeight: '1',
                      letterSpacing: '-1px'
                    }}>
                      {tiempoTexto}
                    </span>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </main>
    </>
  );
}
