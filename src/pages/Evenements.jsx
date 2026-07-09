// frontend/src/pages/Evenements.jsx
import { useState, useEffect } from 'react';
import { useT } from '../i18n/index.jsx';
import { api, formatDate } from '../api.js';

const TYPE_COLORS = {
  'Séminaire': '#1d4ed8',
  'Conférence': '#7c3aed',
  'Atelier': '#f59e0b',
  'Portes Ouvertes': '#16a34a',
  'Formation': '#0891b2',
  'Autre': '#64748b'
};

const TYPE_BG = {
  'Séminaire': '#e8edfd',
  'Conférence': '#ede9fe',
  'Atelier': '#fef3c7',
  'Portes Ouvertes': '#dcfce7',
  'Formation': '#cffafe',
  'Autre': '#f1f5f9'
};

export default function Evenements() {
  const { t, libelleCategorie } = useT();

  const [evenements, setEvenements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [erreur, setErreur] = useState('');
  const [filtreType, setFiltreType] = useState('TOUS');

  const types = ['TOUS', 'Séminaire', 'Conférence', 'Atelier', 'Portes Ouvertes', 'Formation', 'Autre'];

  useEffect(() => {
    api('/evenements')
      .then(data => {
        setEvenements(data || []);
        setLoading(false);
      })
      .catch(err => {
        setErreur(err.message);
        setLoading(false);
      });
  }, []);

  const filtres = evenements.filter(e => 
    filtreType === 'TOUS' || e.type === filtreType
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
        <p style={{ color: '#64748b' }}>{t('cms.chargement.evenements')}</p>
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
          {t('commun.reessayer')}
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
              {t('cms.surtitre.evenements')}
            </span>
            <h1 style={{
              color: 'var(--blue-deep)',
              fontSize: 'clamp(28px, 3.5vw, 42px)',
              fontWeight: 800,
              lineHeight: 1.15,
              marginBottom: '12px'
            }}>
              {t('pages.evenements.titre')}
            </h1>
            <p style={{
              fontSize: '17px',
              color: 'var(--text-main)',
              lineHeight: 1.7
            }}>
              {t('cms.intro.evenements')}
            </p>
            <p style={{
              fontSize: '14px',
              color: 'var(--text-muted)',
              marginTop: '8px'
            }}>
              {evenements.length} événement{evenements.length > 1 ? 's' : ''} au total
            </p>
          </div>
        </div>
      </section>

      {/* FILTRES AVEC COMPTEURS */}
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
            {types.map(v => {
              const count = v === 'TOUS' ? evenements.length : evenements.filter(e => e.type === v).length;
              return (
                <button
                  key={v}
                  onClick={() => setFiltreType(v)}
                  className={`btn-lab ${filtreType === v ? 'btn-lab--primary' : 'btn-lab--ghost'}`}
                  style={{ fontSize: '13px', padding: '6px 16px', cursor: 'pointer' }}
                >
                  {libelleCategorie(v)} ({count})
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* LISTE ÉVÉNEMENTS */}
      <section style={{ padding: '24px 0 60px' }}>
        <div className="conteneur">
          {filtres.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '60px 20px', color: '#94a3b8' }}>
              <div style={{ fontSize: '48px', marginBottom: '12px' }}>📅</div>
              <p>{t('cms.vide.evenements')}</p>
              <p style={{ fontSize: '14px', marginTop: '4px' }}>
                {t('cms.videSous.evenements')}
              </p>
            </div>
          ) : (
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))',
              gap: '30px'
            }}>
              {filtres.map(e => {
                // Détermination si l'événement est passé (par rapport à la date de fin ou début)
                const dateReference = e.date_fin ? new Date(e.date_fin) : new Date(e.date);
                const isPast = dateReference < new Date();

                return (
                  <div 
                    key={e.id} 
                    className={`carte-evenement-interactive ${isPast ? 'evenement-passe' : ''}`} 
                    style={{
                      background: 'white',
                      borderRadius: '12px',
                      border: '1px solid var(--border-color)',
                      borderTop: `4px solid ${isPast ? '#94a3b8' : (TYPE_COLORS[e.type] || 'var(--blue-brand)')}`,
                      boxShadow: 'var(--shadow-sm)',
                      padding: '20px',
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'space-between',
                      overflow: 'hidden'
                    }}
                  >
                    <div>
                      {/* Conteneur Image avec effet zoom */}
                      {e.image_url && (
                        <div style={{
                          width: 'calc(100% + 40px)',
                          height: '160px',
                          margin: '-20px -20px 16px -20px',
                          overflow: 'hidden'
                        }}>
                          <img 
                            src={e.image_url} 
                            alt={e.titre} 
                            className="img-evenement"
                            style={{
                              width: '100%',
                              height: '100%',
                              objectFit: 'cover'
                            }}
                          />
                        </div>
                      )}
                      
                      <div style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'flex-start',
                        gap: '12px',
                        marginBottom: '8px'
                      }}>
                        <h3 style={{ color: 'var(--blue-deep)', fontSize: '18px', fontWeight: '700', margin: 0 }}>
                          {e.titre}
                        </h3>
                        <span className="badge-lab" style={{
                          background: isPast ? '#f1f5f9' : (TYPE_BG[e.type] || 'var(--bg-light)'),
                          color: isPast ? '#64748b' : (TYPE_COLORS[e.type] || 'var(--text-muted)'),
                          whiteSpace: 'nowrap',
                          fontSize: '11px',
                          fontWeight: '600'
                        }}>
                          {libelleCategorie(e.type)}
                        </span>
                      </div>
                      
                      <p style={{ fontSize: '13px', color: 'var(--text-muted)', margin: '0 0 10px 0', fontWeight: '500' }}>
                        📅 {formatDate(e.date)} · 📍 {e.lieu}
                      </p>
                      
                      <p style={{ color: 'var(--text-main)', margin: '0 0 16px 0', fontSize: '14px', lineHeight: '1.6' }}>
                        {e.description}
                      </p>
                    </div>
                    
                    <div style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      paddingTop: '12px',
                      borderTop: '1px solid var(--border-color)',
                      marginTop: 'auto'
                    }}>
                      <span style={{ fontSize: '12px', color: 'var(--text-muted)', fontWeight: '500' }}>
                        {e.date_fin ? `Jusqu'au ${formatDate(e.date_fin)}` : t('cms.unJour')}
                      </span>
                      
                      {isPast ? (
                        <span style={{
                          fontSize: '12px',
                          color: '#64748b',
                          background: '#f1f5f9',
                          padding: '4px 10px',
                          borderRadius: '6px',
                          fontWeight: '500'
                        }}>
                          {t('cms.termine')}
                        </span>
                      ) : (
                        <button 
                          className="btn-lab btn-lab--primary btn-lab--sm"
                          style={{ cursor: 'pointer' }}
                          onClick={() => window.location.href = `/contact?subject=Inscription%20-%20${encodeURIComponent(e.titre)}`}
                        >
                          S'inscrire
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </section>

      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        
        .carte-evenement-interactive {
          transition: transform 0.2s ease, box-shadow 0.2s ease !important;
        }
        .carte-evenement-interactive:not(.evenement-passe):hover {
          transform: translateY(-4px);
          box-shadow: 0 12px 30px rgba(15, 45, 128, 0.08) !important;
        }
        .carte-evenement-interactive:not(.evenement-passe):hover .img-evenement {
          transform: scale(1.04);
        }
        .img-evenement {
          transition: transform 0.3s ease;
        }
        .evenement-passe {
          opacity: 0.65;
          filter: grayscale(0.3);
          background: #fafafa !important;
        }
      `}</style>
    </main>
  );
}