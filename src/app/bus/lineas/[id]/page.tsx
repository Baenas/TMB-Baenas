import Link from "next/link";
import { Suspense } from "react";

async function LineasEnParada({ paradaId, currentLine }: { paradaId: string, currentLine: string }) {
  const appId = process.env.TMB_APP_ID;
  const appKey = process.env.TMB_APP_KEY;
  if (!appId || !appKey) return null;

  try {
    const res = await fetch(`https://api.tmb.cat/v1/ibus/stops/${paradaId}?app_id=${appId}&app_key=${appKey}`, { cache: 'no-store' });
    if (!res.ok) return null;
    const json = await res.json();
    const llegadas = json.data?.ibus || [];
    
    // Obtenemos líneas únicas que pasarán por aquí, filtrando la línea actual
    const lineasUnicas = Array.from(new Set(llegadas.map((b: any) => b.line))).filter(l => l !== currentLine);

    if (lineasUnicas.length === 0) return null;
    
    return (
      <div style={{ display: 'flex', gap: '0.4rem', marginLeft: '1rem', flexWrap: 'wrap' }}>
        {lineasUnicas.map((l: any, i) => (
          <span key={i} style={{
            padding: '0.1rem 0.4rem',
            backgroundColor: '#e6f2ff',
            color: 'var(--secondary)',
            border: '1px solid #b3d9ff',
            borderRadius: '4px',
            fontWeight: '600',
            fontSize: '0.75rem',
            whiteSpace: 'nowrap'
          }}>
            {l}
          </span>
        ))}
      </div>
    );
  } catch (e) {
    return null;
  }
}

async function getParadasBus(lineaId: string) {
  const appId = process.env.TMB_APP_ID;
  const appKey = process.env.TMB_APP_KEY;
  
  if (!appId || !appKey) return [];

  try {
    // Petición de las paradas de una línea de autobús en concreto
    const url = `https://api.tmb.cat/v1/transit/linies/bus/${lineaId}/parades?app_id=${appId}&app_key=${appKey}`;
    const res = await fetch(url, { next: { revalidate: 60 } });
    
    if (!res.ok) return [];
    
    const data = await res.json();
    return data.features || [];
  } catch (error) {
    console.error(error);
    return [];
  }
}

export default async function ParadasDeBus(props: { params: Promise<{ id: string }> }) {
  // Await de params para Next.js 15
  const { id } = await props.params;
  const paradas = await getParadasBus(id);

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
        <div className="info-badge mb-4" style={{ marginBottom: "1rem", backgroundColor: 'rgba(0, 94, 140, 0.2)', color: '#4da6ff' }}>
          Detalle de Ruta (Bus)
        </div>
        <h1 className="dashboard-title" style={{ fontSize: '2.5rem', textAlign: 'left' }}>
          Paradas de la Línea
        </h1>
        <p className="dashboard-subtitle" style={{ textAlign: 'left', marginBottom: '2rem' }}>
          Consultando itinerario en tiempo real para el autobús seleccionado.
        </p>

        <div className="glass-card" style={{ width: '100%', cursor: 'default' }}>
          <div className="card-title" style={{ borderBottom: '1px solid var(--glass-border)', paddingBottom: '1rem', marginBottom: '1rem' }}>
            Lista de Paradas
          </div>
          
          {paradas.length === 0 ? (
            <p style={{ color: "var(--text-muted)" }}>
              No se encontraron paradas para este autobús o ocurrió un error al contactar la API.
            </p>
          ) : (
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              padding: '1rem 0',
              paddingLeft: '3rem',
              gap: '1rem',
              position: 'relative'
            }}>
              {/* Línea conectora vertical de fondo */}
              <div style={{
                position: 'absolute',
                top: '3rem',
                bottom: '3rem',
                left: '1.25rem',
                width: '4px',
                backgroundColor: 'var(--secondary)',
                zIndex: 0
              }} />

              {paradas.map((parada: any, idx: number) => {
                const propiedades = parada.properties || {};
                const nombreParada = propiedades.NOM_PARADA || 'Parada desconocida';
                const idParada = propiedades.CODI_PARADA || idx + 1;
                
                return (
                  <div key={idx} style={{ position: 'relative' }}>
                    {/* Icono / Punto de la estación (flotando encima de la línea) */}
                    <div style={{
                      position: 'absolute',
                      left: '-2.35rem',
                      top: '50%',
                      transform: 'translateY(-50%)',
                      width: '20px',
                      height: '20px',
                      borderRadius: '50%',
                      backgroundColor: 'white',
                      border: '4px solid var(--secondary)',
                      zIndex: 1
                    }}>
                      {/* Un pequeño punto azul interior opcional */}
                      <div style={{
                        position: 'absolute',
                        top: '50%',
                        left: '50%',
                        transform: 'translate(-50%, -50%)',
                        width: '6px',
                        height: '6px',
                        borderRadius: '50%',
                        backgroundColor: 'var(--primary)'
                      }} />
                    </div>

                    <Link href={`/bus/paradas/${idParada}`} className="glass-card" style={{ 
                      display: 'flex',
                      flexDirection: 'row',
                      alignItems: 'center',
                      textDecoration: 'none',
                      padding: '1rem 1.2rem',
                      margin: '0',
                      cursor: 'pointer'
                    }}>
                      {/* Texto de la estación */}
                      <span style={{ 
                        fontSize: '1.05rem', 
                        fontWeight: 600,
                        color: 'var(--text-main)',
                        lineHeight: 1.1
                      }}>
                        {nombreParada}
                      </span>
                      
                      <Suspense fallback={null}>
                        <LineasEnParada paradaId={idParada} currentLine={id} />
                      </Suspense>
                      
                      {/* Icono indicador de acción */}
                      <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center' }}>
                        <span style={{ 
                          color: "var(--text-muted)", 
                          fontSize: "0.85rem", 
                          paddingRight: '1rem'
                        }}>
                          #{idParada}
                        </span>
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--primary)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                          <polyline points="9 18 15 12 9 6"></polyline>
                        </svg>
                      </div>
                    </Link>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </main>
    </>
  );
}
