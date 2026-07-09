// frontend/src/pages/Actualites.jsx
import { useState, useEffect } from 'react';
import { useT } from '../i18n/index.jsx';
import { api, formatDate } from '../api.js';
import Modal from '../components/Modal.jsx';

export default function Actualites() {
  const { t, libelleCategorie } = useT();

  const [actualites, setActualites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [erreur, setErreur] = useState('');
  const [selected, setSelected] = useState(null);
  const [filtreCategorie, setFiltreCategorie] = useState('TOUTES');

  const categories = ['TOUTES', 'Annonce', 'Événement', 'Publication', 'Projet', 'Communiqué'];

  useEffect(() => {
    api('/actualites')
      .then(data => {
        setActualites(data || []);
        setLoading(false);
      })
      .catch(err => {
        setErreur(err.message);
        setLoading(false);
      });
  }, []);

  const filtres = actualites.filter(a => 
    filtreCategorie === 'TOUTES' || a.categorie === filtreCategorie
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
        <p style={{ color: '#64748b' }}>{t('commun.chargement')}</p>
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
              {t('pages.actualites.titre').toUpperCase()}
            </span>
            <h1 style={{
              color: 'var(--blue-deep)',
              fontSize: 'clamp(28px, 3.5vw, 42px)',
              fontWeight: 800,
              lineHeight: 1.15,
              marginBottom: '12px'
            }}>
              {t('pages.actualites.titre')}
            </h1>
            <p style={{
              fontSize: '17px',
              color: 'var(--text-main)',
              lineHeight: 1.7
            }}>
              {t('pages.actualites.intro')}
            </p>
            <p style={{
              fontSize: '14px',
              color: 'var(--text-muted)',
              marginTop: '8px'
            }}>
              {actualites.length} {t('pages.actualites.article')}{actualites.length > 1 ? 's' : ''}
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
            {categories.map(c => (
              <button
                key={c}
                onClick={() => setFiltreCategorie(c)}
                className={`btn-lab ${filtreCategorie === c ? 'btn-lab--primary' : 'btn-lab--ghost'}`}
                style={{ fontSize: '13px', padding: '6px 16px' }}
              >
                {libelleCategorie(c)} 
                {c !== 'TOUTES' && `(${actualites.filter(a => a.categorie === c).length})`}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* GRILLE ACTUALITÉS */}
      <section style={{ padding: '24px 0 60px' }}>
        <div className="conteneur">
          {filtres.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '60px 20px', color: '#94a3b8' }}>
              <div style={{ fontSize: '48px', marginBottom: '12px' }}>📰</div>
              <p>{t('pages.actualites.aucune')}</p>
            </div>
          ) : (
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))',
              gap: '30px'
            }}>
              {filtres.map(a => (
                <div 
                  key={a.id} 
                  className="carte-lab" 
                  style={{ 
                    overflow: 'hidden', 
                    cursor: 'pointer',
                    transition: 'all 0.3s ease'
                  }}
                  onClick={() => setSelected(a)}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateY(-4px)';
                    e.currentTarget.style.boxShadow = '0 12px 30px rgba(0,0,0,0.10)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = 'var(--shadow-sm)';
                  }}
                >
                  {/* Image */}
                  <div style={{
                    height: '180px',
                    background: 'var(--bg-light)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '48px',
                    margin: '-20px -20px 16px -20px',
                    overflow: 'hidden'
                  }}>
                    {a.image_url ? (
                      <img 
                        src={a.image_url} 
                        alt={a.titre} 
                        style={{ 
                          width: '100%', 
                          height: '100%', 
                          objectFit: 'cover',
                          transition: 'transform 0.3s ease'
                        }}
                        onMouseEnter={(e) => e.target.style.transform = 'scale(1.05)'}
                        onMouseLeave={(e) => e.target.style.transform = 'scale(1)'}
                      />
                    ) : (
                      <span>📰</span>
                    )}
                  </div>
                  
                  {/* Contenu */}
                  <div>
                    <div style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      flexWrap: 'wrap',
                      gap: '8px'
                    }}>
                      <p style={{ fontSize: '13px', color: 'var(--text-muted)', margin: 0 }}>
                        📅 {formatDate(a.date_publication)}
                      </p>
                      {a.categorie && (
                        <span className="badge-lab" style={{
                          background: a.categorie === 'Annonce' ? '#e8edfd' :
                                    a.categorie === 'Événement' ? '#fce7f3' :
                                    a.categorie === 'Publication' ? '#dcfce7' :
                                    a.categorie === 'Projet' ? '#fef3c7' :
                                    a.categorie === 'Communiqué' ? '#dbeafe' :
                                    'var(--bg-light)',
                          color: a.categorie === 'Annonce' ? '#1d4ed8' :
                                 a.categorie === 'Événement' ? '#db2777' :
                                 a.categorie === 'Publication' ? '#16a34a' :
                                 a.categorie === 'Projet' ? '#d97706' :
                                 a.categorie === 'Communiqué' ? '#2563eb' :
                                 'var(--text-muted)'
                        }}>
                          {libelleCategorie(a.categorie)}
                        </span>
                      )}
                    </div>
                    
                    <h3 style={{ 
                      color: 'var(--blue-deep)', 
                      fontSize: '18px', 
                      marginTop: '6px',
                      marginBottom: '6px',
                      lineHeight: 1.3
                    }}>
                      {a.titre}
                    </h3>
                    
                    <p style={{ color: 'var(--text-main)', display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                      {a.resume}
                    </p>
                    
                    <div style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      marginTop: '12px',
                      paddingTop: '12px',
                      borderTop: '1px solid var(--border-color)'
                    }}>
                      <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                        ✍️ {a.auteur || 'ICERD'}
                      </span>
                      <button className="btn-lab btn-lab--ghost btn-lab--sm">
                        {t('pages.enSavoirPlus')} →
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* MODAL DÉTAIL */}
      {selected && (
        <Modal 
          title={selected.titre} 
          onClose={() => setSelected(null)}
          maxWidth="700px"
        >
          <div>
            {/* Image */}
            {selected.image_url && (
              <img 
                src={selected.image_url} 
                alt={selected.titre} 
                style={{
                  width: '100%',
                  maxHeight: '300px',
                  objectFit: 'cover',
                  borderRadius: '8px',
                  marginBottom: '16px'
                }}
              />
            )}
            
            {/* Métadonnées */}
            <div style={{
              display: 'flex',
              flexWrap: 'wrap',
              gap: '12px',
              marginBottom: '12px'
            }}>
              <span style={{ fontSize: '13px', color: 'var(--text-muted)' }}>
                📅 {formatDate(selected.date_publication)}
              </span>
              {selected.categorie && (
                <span className="badge-lab" style={{
                  background: selected.categorie === 'Annonce' ? '#e8edfd' :
                            selected.categorie === 'Événement' ? '#fce7f3' :
                            selected.categorie === 'Publication' ? '#dcfce7' :
                            selected.categorie === 'Projet' ? '#fef3c7' :
                            selected.categorie === 'Communiqué' ? '#dbeafe' :
                            'var(--bg-light)',
                  color: selected.categorie === 'Annonce' ? '#1d4ed8' :
                         selected.categorie === 'Événement' ? '#db2777' :
                         selected.categorie === 'Publication' ? '#16a34a' :
                         selected.categorie === 'Projet' ? '#d97706' :
                         selected.categorie === 'Communiqué' ? '#2563eb' :
                         'var(--text-muted)'
                }}>
                  {selected.categorie}
                </span>
              )}
              <span style={{ fontSize: '13px', color: 'var(--text-muted)' }}>
                ✍️ {selected.auteur || 'ICERD'}
              </span>
            </div>
            
            {/* Contenu complet */}
            <div style={{
              fontSize: '15px',
              color: 'var(--text-main)',
              lineHeight: 1.8,
              whiteSpace: 'pre-wrap'
            }}>
              {selected.contenu || selected.resume}
            </div>
            
            {/* Boutons */}
            <div style={{
              marginTop: '20px',
              paddingTop: '16px',
              borderTop: '1px solid var(--border-color)',
              display: 'flex',
              gap: '12px',
              justifyContent: 'flex-end'
            }}>
              <button 
                className="btn-lab btn-lab--ghost" 
                onClick={() => setSelected(null)}
              >
                {t('commun.fermer')}
              </button>
              {selected.lien && (
                <a 
                  href={selected.lien} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="btn-lab btn-lab--primary"
                >
                  {t('pages.enSavoirPlus')} →
                </a>
              )}
            </div>
          </div>
        </Modal>
      )}
    </main>
  );
}