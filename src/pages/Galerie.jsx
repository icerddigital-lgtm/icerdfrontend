// frontend/src/pages/Galerie.jsx
import { useState, useEffect } from 'react';
import { useT } from '../i18n/index.jsx';
import { api } from '../api.js';
import Modal from '../components/Modal.jsx';

const CATEGORIES = ['TOUTES', 'Laboratoire', 'Équipe', 'Terrain', 'Événement', 'Formation', 'Conférence', 'Visite'];

const CATEGORY_COLORS = {
  'Laboratoire': '#1d4ed8',
  'Équipe': '#16a34a',
  'Terrain': '#d97706',
  'Événement': '#db2777',
  'Formation': '#2563eb',
  'Conférence': '#7c3aed',
  'Visite': '#0891b2'
};

const CATEGORY_BG = {
  'Laboratoire': '#e8edfd',
  'Équipe': '#dcfce7',
  'Terrain': '#fef3c7',
  'Événement': '#fce7f3',
  'Formation': '#dbeafe',
  'Conférence': '#ede9fe',
  'Visite': '#cffafe'
};

const Icon = ({ name, size = 20, color = '#1d4ed8' }) => {
  const icons = {
    'gallery': (
      <path d="M22 16V4c0-1.1-.9-2-2-2H8c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2zm-11-4l2.03 2.71L16 11l4 5H8l3-4zM2 6v14c0 1.1.9 2 2 2h14v-2H4V6H2z"/>
    ),
    'filter': (
      <path d="M10 18h4v-2h-4v2zM3 6v2h18V6H3zm3 7h12v-2H6v2z"/>
    ),
    'search': (
      <path d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"/>
    ),
    'close': (
      <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
    )
  };

  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" style={{ color, flexShrink: 0 }}>
      {icons[name] || icons['gallery']}
    </svg>
  );
};

export default function Galerie() {
  const { t } = useT();
  const [photos, setPhotos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [erreur, setErreur] = useState('');
  const [categorie, setCategorie] = useState('TOUTES');
  const [selected, setSelected] = useState(null);
  const [recherche, setRecherche] = useState('');
  const [viewMode, setViewMode] = useState('grid');

  useEffect(() => {
    api('/galerie')
      .then(data => {
        setPhotos(data || []);
        setLoading(false);
      })
      .catch(err => {
        setErreur(err.message);
        setLoading(false);
      });
  }, []);

  const filtres = photos.filter(p => {
    const matchCategorie = categorie === 'TOUTES' || p.categorie === categorie;
    const matchRecherche = p.titre?.toLowerCase().includes(recherche.toLowerCase()) ||
                          p.description?.toLowerCase().includes(recherche.toLowerCase());
    return matchCategorie && matchRecherche;
  });

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '80px 0' }}>
        <div style={{
          width: '48px',
          height: '48px',
          border: '4px solid #1d4ed8',
          borderTopColor: 'transparent',
          borderRadius: '50%',
          animation: 'spin 0.8s linear infinite',
          margin: '0 auto 16px'
        }}></div>
        <p style={{ color: '#64748b' }}>Chargement de la galerie...</p>
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  if (erreur) {
    return (
      <div style={{ textAlign: 'center', padding: '80px 0', color: '#dc2626' }}>
        <p style={{ fontSize: '18px' }}>❌ {erreur}</p>
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
      
      {/* ===== HÉROS ===== */}
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
              GALERIE
            </span>
            <h1 style={{
              color: 'var(--blue-deep)',
              fontSize: 'clamp(28px, 3.5vw, 42px)',
              fontWeight: 800,
              lineHeight: 1.15,
              marginBottom: '12px'
            }}>
              {t('pages.galerie.titre')}
            </h1>
            <p style={{
              fontSize: '17px',
              color: 'var(--text-main)',
              lineHeight: 1.7
            }}>
              Découvrez en images nos laboratoires, nos équipes et nos activités de recherche.
            </p>
            <p style={{
              fontSize: '14px',
              color: 'var(--text-muted)',
              marginTop: '8px'
            }}>
              {photos.length} photo{photos.length > 1 ? 's' : ''} disponible{photos.length > 1 ? 's' : ''}
            </p>
          </div>
        </div>
      </section>

      {/* ===== FILTRES ===== */}
      <section style={{ padding: '24px 0 0' }}>
        <div className="conteneur">
          <div style={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: '12px',
            alignItems: 'center',
            marginBottom: '30px',
            padding: '16px 20px',
            background: 'var(--bg-light)',
            borderRadius: '12px',
            border: '1px solid var(--border-color)'
          }}>
            <Icon name="filter" size={18} color="var(--text-muted)" />
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', flex: 1 }}>
              {CATEGORIES.map(c => {
                const count = photos.filter(p => p.categorie === c).length;
                return (
                  <button
                    key={c}
                    onClick={() => setCategorie(c)}
                    className={`btn-lab ${categorie === c ? 'btn-lab--primary' : 'btn-lab--ghost'}`}
                    style={{ fontSize: '12px', padding: '4px 14px' }}
                  >
                    {c} {c !== 'TOUTES' && <span style={{ fontSize: '10px', opacity: 0.7 }}>({count})</span>}
                  </button>
                );
              })}
            </div>
            <div style={{ position: 'relative' }}>
              <input
                type="text"
                placeholder="Rechercher..."
                value={recherche}
                onChange={e => setRecherche(e.target.value)}
                style={{
                  padding: '6px 12px 6px 32px',
                  border: '1px solid var(--border-color)',
                  borderRadius: '6px',
                  fontSize: '13px',
                  minWidth: '160px',
                  background: 'white',
                  outline: 'none'
                }}
                onFocus={e => e.target.style.borderColor = 'var(--blue-brand)'}
                onBlur={e => e.target.style.borderColor = 'var(--border-color)'}
              />
              <Icon name="search" size={16} color="var(--text-muted)" style={{
                position: 'absolute',
                left: '8px',
                top: '50%',
                transform: 'translateY(-50%)'
              }} />
            </div>
            <button
              onClick={() => setViewMode(viewMode === 'grid' ? 'list' : 'grid')}
              className="btn-lab btn-lab--ghost"
              style={{ padding: '4px 8px' }}
              title={viewMode === 'grid' ? 'Vue liste' : 'Vue grille'}
            >
              {viewMode === 'grid' ? '📋' : '📊'}
            </button>
          </div>
        </div>
      </section>

      {/* ===== GRILLE PHOTOS ===== */}
      <section style={{ padding: '24px 0 60px' }}>
        <div className="conteneur">
          {filtres.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '80px 20px', color: '#94a3b8' }}>
              <div style={{ fontSize: '64px', marginBottom: '16px' }}>🖼️</div>
              <p style={{ fontSize: '18px', fontWeight: 500 }}>Aucune photo dans cette catégorie</p>
              <p style={{ fontSize: '14px' }}>Explorez d'autres catégories ou revenez plus tard</p>
            </div>
          ) : (
            <div style={{
              display: viewMode === 'grid' ? 'grid' : 'flex',
              flexDirection: viewMode === 'list' ? 'column' : 'unset',
              gridTemplateColumns: viewMode === 'grid' ? 'repeat(auto-fill, minmax(300px, 1fr))' : 'unset',
              gap: viewMode === 'grid' ? '24px' : '16px'
            }}>
              {filtres.map((p, index) => (
                <div 
                  key={p.id} 
                  className="carte-lab" 
                  style={{ 
                    overflow: 'hidden', 
                    cursor: 'pointer', 
                    padding: '0',
                    transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                    animation: `fadeInUp 0.5s ease ${index * 0.05}s both`,
                    display: viewMode === 'list' ? 'flex' : 'block',
                    alignItems: viewMode === 'list' ? 'center' : 'unset',
                    gap: viewMode === 'list' ? '16px' : '0'
                  }}
                  onClick={() => setSelected(p)}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateY(-8px)';
                    e.currentTarget.style.boxShadow = '0 16px 40px rgba(0,0,0,0.12)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = 'var(--shadow-sm)';
                  }}
                >
                  {/* Image */}
                  <div style={{
                    height: viewMode === 'list' ? '150px' : '260px',
                    minWidth: viewMode === 'list' ? '200px' : 'auto',
                    background: 'var(--bg-light)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    overflow: 'hidden',
                    flexShrink: 0,
                    position: 'relative'
                  }}>
                    {p.image_url ? (
                      <img 
                        src={p.image_url} 
                        alt={p.titre} 
                        style={{ 
                          width: '100%', 
                          height: '100%', 
                          objectFit: 'cover',
                          transition: 'transform 0.5s ease'
                        }}
                        onMouseEnter={(e) => e.target.style.transform = 'scale(1.05)'}
                        onMouseLeave={(e) => e.target.style.transform = 'scale(1)'}
                      />
                    ) : (
                      <span style={{ fontSize: '56px', color: '#94a3b8' }}>📷</span>
                    )}
                    {/* Badge catégorie */}
                    <span style={{
                      position: 'absolute',
                      top: '12px',
                      right: '12px',
                      padding: '4px 12px',
                      borderRadius: '999px',
                      fontSize: '10px',
                      fontWeight: 600,
                      background: 'rgba(0,0,0,0.6)',
                      color: 'white',
                      backdropFilter: 'blur(4px)',
                      letterSpacing: '0.3px'
                    }}>
                      {p.categorie}
                    </span>
                  </div>

                  {/* Infos */}
                  <div style={{
                    padding: viewMode === 'list' ? '16px 20px 16px 0' : '16px 20px 20px',
                    flex: 1
                  }}>
                    <h4 style={{ 
                      color: 'var(--blue-deep)', 
                      fontSize: viewMode === 'list' ? '18px' : '17px',
                      marginBottom: '4px',
                      fontWeight: 700
                    }}>
                      {p.titre}
                    </h4>
                    {p.description && (
                      <p style={{ 
                        fontSize: viewMode === 'list' ? '14px' : '13px',
                        color: 'var(--text-muted)',
                        display: '-webkit-box',
                        WebkitLineClamp: viewMode === 'list' ? 3 : 2,
                        WebkitBoxOrient: 'vertical',
                        overflow: 'hidden',
                        lineHeight: viewMode === 'list' ? 1.7 : 1.6
                      }}>
                        {p.description}
                      </p>
                    )}
                    <div style={{
                      marginTop: viewMode === 'list' ? '12px' : '10px',
                      paddingTop: viewMode === 'list' ? '12px' : '10px',
                      borderTop: '1px solid var(--border-color)',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      fontSize: '12px',
                      color: 'var(--text-muted)'
                    }}>
                      <span>📅 {p.date_upload ? new Date(p.date_upload).toLocaleDateString('fr-FR') : '—'}</span>
                      <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                        👁️ Voir détails
                        <span style={{ fontSize: '16px' }}>→</span>
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ===== MODAL ZOOM ===== */}
      {selected && (
        <div className="modal-overlay" onClick={() => setSelected(null)}>
          <div className="modal-box" style={{ maxWidth: '750px' }} onClick={e => e.stopPropagation()}>
            <div className="modal-box__header">
              <h2>{selected.titre}</h2>
              <button className="modal-box__close" onClick={() => setSelected(null)}>✕</button>
            </div>
            <div>
              {selected.image_url ? (
                <img 
                  src={selected.image_url} 
                  alt={selected.titre} 
                  style={{ 
                    width: '100%', 
                    maxHeight: '500px', 
                    objectFit: 'contain',
                    borderRadius: '8px',
                    marginBottom: '16px',
                    background: 'var(--bg-light)'
                  }} 
                />
              ) : (
                <div style={{ 
                  fontSize: '80px', 
                  padding: '60px',
                  background: 'var(--bg-light)',
                  borderRadius: '8px',
                  marginBottom: '16px',
                  textAlign: 'center'
                }}>
                  📷
                </div>
              )}
              
              <div style={{
                display: 'flex',
                flexWrap: 'wrap',
                gap: '8px',
                marginBottom: '12px'
              }}>
                <span className="badge-lab" style={{
                  background: CATEGORY_BG[selected.categorie] || 'var(--bg-light)',
                  color: CATEGORY_COLORS[selected.categorie] || 'var(--text-muted)'
                }}>
                  {selected.categorie}
                </span>
                {selected.date_upload && (
                  <span style={{ fontSize: '13px', color: 'var(--text-muted)' }}>
                    📅 {new Date(selected.date_upload).toLocaleDateString('fr-FR')}
                  </span>
                )}
              </div>
              
              {selected.description && (
                <p style={{ 
                  fontSize: '15px', 
                  color: 'var(--text-main)', 
                  lineHeight: 1.8,
                  marginBottom: '8px'
                }}>
                  {selected.description}
                </p>
              )}
              
              {selected.upload_par_nom && (
                <p style={{ fontSize: '13px', color: 'var(--text-muted)' }}>
                  📸 Photo ajoutée par {selected.upload_par_prenom} {selected.upload_par_nom}
                </p>
              )}
              
              <div style={{
                marginTop: '16px',
                paddingTop: '16px',
                borderTop: '1px solid var(--border-color)',
                display: 'flex',
                gap: '12px',
                justifyContent: 'flex-end'
              }}>
                <button className="btn-lab btn-lab--ghost" onClick={() => setSelected(null)}>
                  Fermer
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Animation CSS */}
      <style>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </main>
  );
}