// frontend/src/pages/Partenaires.jsx
import { useState, useEffect } from 'react';
import { api } from '../api.js';

const TYPE_COLORS = {
  'Institutionnel': '#1d4ed8',
  'International': '#7c3aed',
  'Académique': '#16a34a',
  'Privé': '#b4552d',
  'ONG': '#0891b2',
  'Association': '#d97706'
};

const TYPE_BG = {
  'Institutionnel': '#e8edfd',
  'International': '#ede9fe',
  'Académique': '#dcfce7',
  'Privé': '#fdf0ea',
  'ONG': '#cffafe',
  'Association': '#fef3c7'
};

export default function Partenaires() {
  const [partenaires, setPartenaires] = useState([]);
  const [loading, setLoading] = useState(true);
  const [erreur, setErreur] = useState('');
  const [filtreType, setFiltreType] = useState('TOUS');

  const types = ['TOUS', 'Institutionnel', 'International', 'Académique', 'Privé', 'ONG', 'Association'];

  useEffect(() => {
    api('/partenaires')
      .then(data => {
        setPartenaires(data || []);
        setLoading(false);
      })
      .catch(err => {
        setErreur(err.message);
        setLoading(false);
      });
  }, []);

  const filtres = partenaires.filter(p => 
    filtreType === 'TOUS' || p.type === filtreType
  );

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '60px 0' }}>
        <div style={{
          width: '40px',
          height: '40px',
          border: '3px solid #1d4ed8',
          borderTopColor: 'transparent',
          borderRadius: '50%',
          animation: 'spin 0.8s linear infinite',
          margin: '0 auto 12px'
        }}></div>
        <p style={{ color: '#64748b' }}>Chargement des partenaires...</p>
      </div>
    );
  }

  if (erreur) {
    return (
      <div style={{ textAlign: 'center', padding: '60px 0', color: '#dc2626' }}>
        <p>❌ {erreur}</p>
        <button 
          className="btn-lab btn-lab--primary" 
          onClick={() => window.location.reload()}
          style={{ marginTop: '16px' }}
        >
          Réessayer
        </button>
      </div>
    );
  }

  return (
    <main style={{ background: 'var(--bg-pure)' }}>
      
      {/* HERO */}
      <section className="trame-points" style={{
        padding: '60px 0 48px',
        borderBottom: '1px solid var(--border-color)',
        background: 'var(--bg-light)'
      }}>
        <div className="conteneur">
          <div style={{ textAlign: 'center', maxWidth: '720px', margin: '0 auto' }}>
            <span style={{
              fontFamily: 'var(--mono)',
              fontSize: '12px',
              color: 'var(--blue-brand)',
              fontWeight: '600',
              letterSpacing: '1px',
              display: 'block',
              marginBottom: '8px'
            }}>
              NOS PARTENAIRES
            </span>
            <h1 style={{
              color: 'var(--blue-deep)',
              fontSize: 'clamp(28px, 3.5vw, 42px)',
              fontWeight: 800,
              lineHeight: 1.15,
              marginBottom: '12px'
            }}>
              Ensemble pour le développement
            </h1>
            <p style={{
              fontSize: '17px',
              color: 'var(--text-main)',
              lineHeight: 1.7
            }}>
              L'ICERD collabore avec des partenaires institutionnels, académiques et internationaux pour la recherche et le développement durable.
            </p>
            <p style={{
              fontSize: '14px',
              color: 'var(--text-muted)',
              marginTop: '8px'
            }}>
              {partenaires.length} partenaire{partenaires.length > 1 ? 's' : ''}
            </p>
          </div>
        </div>
      </section>

      {/* FILTRES */}
      <section style={{ padding: '24px 0 0' }}>
        <div className="conteneur">
          <div style={{
            display: 'flex',
            gap: '10px',
            flexWrap: 'wrap',
            marginBottom: '30px',
            padding: '16px 20px',
            background: 'var(--bg-light)',
            borderRadius: '12px',
            border: '1px solid var(--border-color)'
          }}>
            {types.map(t => {
              // Calcul dynamique du nombre d'éléments par type pour les filtres
              const count = t === 'TOUS' ? partenaires.length : partenaires.filter(p => p.type === t).length;
              return (
                <button
                  key={t}
                  onClick={() => setFiltreType(t)}
                  className={`btn-lab ${filtreType === t ? 'btn-lab--primary' : 'btn-lab--ghost'}`}
                  style={{ fontSize: '13px', padding: '6px 16px', cursor: 'pointer' }}
                >
                  {t} ({count})
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* GRILLE PARTENAIRES */}
      <section style={{ padding: '24px 0 60px' }}>
        <div className="conteneur">
          {filtres.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '60px 20px', color: '#94a3b8' }}>
              <div style={{ fontSize: '48px', marginBottom: '12px' }}>🤝</div>
              <p>Aucun partenaire dans cette catégorie</p>
            </div>
          ) : (
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
              gap: '24px'
            }}>
              {filtres.map(p => (
                <div 
                  key={p.id} 
                  className="carte-partenaire-interactive" 
                  style={{ 
                    textAlign: 'center', 
                    padding: '24px',
                    background: 'white',
                    borderRadius: '12px',
                    borderLeft: '1px solid var(--border-color)',
                    borderRight: '1px solid var(--border-color)',
                    borderBottom: '1px solid var(--border-color)',
                    borderTop: `4px solid ${TYPE_COLORS[p.type] || 'var(--blue-brand)'}`,
                    boxShadow: 'var(--shadow-sm)'
                  }}
                >
                  {/* Logo */}
                  <div className="wrapper-logo-partenaire" style={{
                    width: '84px',
                    height: '84px',
                    borderRadius: '50%',
                    background: '#ffffff',
                    margin: '0 auto 16px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '36px',
                    border: `1px solid var(--border-color)`,
                    boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.02)',
                    overflow: 'hidden'
                  }}>
                    {p.logo_url ? (
                      <img 
                        src={p.logo_url} 
                        alt={`Logo ${p.nom}`} 
                        className="img-partenaire"
                        style={{ 
                          width: '100%', 
                          height: '100%', 
                          objectFit: 'contain',
                          padding: '10px'
                        }} 
                      />
                    ) : (
                      <span style={{ filter: 'grayscale(0.2)' }}>🤝</span>
                    )}
                  </div>
                  
                  <h3 style={{ color: 'var(--blue-deep)', fontSize: '17px', fontWeight: '700', marginBottom: '6px', lineHeight: '1.4' }}>
                    {p.nom}
                  </h3>
                  
                  <span className="badge-lab" style={{
                    background: TYPE_BG[p.type] || 'var(--bg-light)',
                    color: TYPE_COLORS[p.type] || 'var(--text-muted)',
                    fontSize: '11px',
                    fontWeight: '600',
                    padding: '3px 12px',
                    borderRadius: '6px'
                  }}>
                    {p.type}
                  </span>
                  
                  <p style={{ fontSize: '13px', color: 'var(--text-muted)', marginTop: '12px', lineHeight: '1.5', minHeight: '38px' }}>
                    {p.description || "Aucune description fournie."}
                  </p>
                  
                  <div style={{ marginTop: '14px', display: 'flex', flexDirection: 'column', gap: '6px', alignItems: 'center' }}>
                    {p.site && (
                      <a 
                        href={p.site} 
                        target="_blank" 
                        rel="noopener noreferrer" 
                        className="lien-partenaire-site"
                        style={{
                          color: 'var(--blue-brand)',
                          fontSize: '13px',
                          fontWeight: '500',
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '4px',
                          textDecoration: 'none'
                        }}
                      >
                        🔗 Visiter le site →
                      </a>
                    )}
                    
                    {p.email && (
                      <a 
                        href={`mailto:${p.email}`} 
                        style={{
                          color: 'var(--text-muted)',
                          fontSize: '12px',
                          textDecoration: 'none',
                          marginTop: '2px'
                        }}
                        className="lien-email-partenaire"
                      >
                        📧 {p.email}
                      </a>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* DEVENIR PARTENAIRE */}
      <section style={{
        padding: '50px 0',
        background: 'var(--bg-light)',
        borderTop: '1px solid var(--border-color)'
      }}>
        <div className="conteneur">
          <div style={{ textAlign: 'center', maxWidth: '640px', margin: '0 auto' }}>
            <div style={{ fontSize: '40px', marginBottom: '8px' }}>🤝</div>
            <h3 style={{ fontSize: '22px', fontWeight: 700, color: 'var(--blue-deep)', marginBottom: '8px' }}>
              Devenir partenaire
            </h3>
            <p style={{ fontSize: '15px', color: 'var(--text-muted)', marginBottom: '20px', lineHeight: 1.6 }}>
              Vous souhaitez collaborer avec l'ICERD ? Rejoignez notre réseau de partenaires
              pour contribuer à la recherche et au développement durable.
            </p>
            <button 
              className="btn-lab btn-lab--primary"
              onClick={() => window.location.href = 'mailto:partenariat@icerd.cm?subject=Demande%20de%20partenariat&body=Bonjour,%0A%0ANous%20souhaitons%20devenir%20partenaire%20de%20l\'ICERD.%0A%0ANom%20de%20l\'organisation:%20%0AType:%20%0ADomaine%20d\'activité:%20%0A%0ACordialement.'}
              style={{ cursor: 'pointer' }}
            >
              ✉️ Nous contacter
            </button>
          </div>
        </div>
      </section>

      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        
        .carte-partenaire-interactive {
          transition: transform 0.2s ease, box-shadow 0.2s ease !important;
        }
        .carte-partenaire-interactive:hover {
          transform: translateY(-5px);
          box-shadow: 0 12px 26px rgba(15, 45, 128, 0.08) !important;
        }
        .carte-partenaire-interactive:hover .wrapper-logo-partenaire {
          border-color: var(--blue-brand);
        }
        .carte-partenaire-interactive:hover .img-partenaire {
          transform: scale(1.04);
        }
        .img-partenaire {
          transition: transform 0.2s ease;
        }
        .lien-partenaire-site:hover {
          text-decoration: underline !important;
          color: var(--blue-deep) !important;
        }
        .lien-email-partenaire:hover {
          color: var(--blue-brand) !important;
        }
      `}</style>
    </main>
  );
}