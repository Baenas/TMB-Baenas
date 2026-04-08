"use client";

import Link from "next/link";
import { useState } from "react";

export default function BusListClient({ autobuses }: { autobuses: any[] }) {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredBuses = autobuses.filter((bus: any) => {
    const info = bus.properties || {};
    const nombre = info.NOM_LINIA || "";
    return nombre.toLowerCase().includes(searchTerm.toLowerCase());
  });

  return (
    <>
      <div style={{ marginBottom: "2rem", width: "100%", maxWidth: "600px" }}>
        <input
          type="text"
          placeholder="Buscar por nombre de línea (ej. V15, H12...)"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{
            width: "100%",
            padding: "1rem 1.5rem",
            fontSize: "1.1rem",
            borderRadius: "12px",
            border: "1px solid var(--glass-border)",
            backgroundColor: "var(--glass-bg)",
            color: "var(--text-main)",
            outline: "none",
            backdropFilter: "blur(10px)"
          }}
        />
      </div>

      <div className="card-grid">
        {filteredBuses.length === 0 ? (
          <div className="glass-card" style={{ gridColumn: "1 / -1", textAlign: "center" }}>
            <p style={{ color: "var(--text-muted)", fontSize: "1.1rem" }}>
              No se encontraron líneas que coincidan con la búsqueda.
            </p>
          </div>
        ) : (
          filteredBuses.map((bus: any, index: number) => {
            const info = bus.properties || {};
            const nombre = info.NOM_LINIA || `Bus ${index}`;
            const color = info.COLOR_LINIA ? `#${info.COLOR_LINIA}` : "#005E8C"; // Color Bus TMB estandar
            const descripcion = info.DESC_LINIA || 'Descripción de ruta no disponible';

            return (
              <Link 
                href={`/bus/lineas/${info.CODI_LINIA}`} 
                className="glass-card" 
                key={info.CODI_LINIA || index} 
                style={{ textDecoration: 'none', display: 'flex', flexDirection: 'column' }}
              >
                <div className="card-title">
                  <span style={{ 
                    backgroundColor: color, 
                    color: 'white', 
                    padding: '0.2rem 0.6rem', 
                    borderRadius: '4px', 
                    fontSize: '1rem',
                    fontWeight: 800,
                    marginRight: '0.4rem'
                  }}>
                    {nombre}
                  </span>
                  Autobús
                </div>
                <div style={{ margin: '0.8rem 0' }}>
                  <strong style={{ opacity: 0.9 }}>Estado:</strong> <span style={{ color: '#10B981' }}>Servicio normal</span>
                </div>
                <div style={{ color: "var(--text-muted)", fontSize: "0.9rem", lineHeight: 1.4, marginTop: 'auto' }}>
                  {descripcion}
                </div>
              </Link>
            );
          })
        )}
      </div>
    </>
  );
}
