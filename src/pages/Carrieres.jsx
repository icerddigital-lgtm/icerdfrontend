// frontend/src/pages/Carrieres.jsx
import { useState, useEffect } from 'react';
import { useT } from '../i18n/index.jsx';
import { api, formatDate } from '../api.js';

const TYPE_COLORS = {
  'CDI': '#1d4ed8',
  'CDD': '#f59e0b',
  'Stage': '#16a34a',
  'Alternance': '#7c3aed',
  'Freelance': '#0891b2',
  'Volontariat': '#b4552d'
};

const TYPE_BG = {
  'CDI': '#e8edfd',
  'CDD': '#fef3c7',
  'Stage': '#dcfce7',
  'Alternance': '#ede9fe',
  'Freelance': '#cffafe',
  'Volontariat': '#fdf0ea'
};

export default function Carrieres() {
  const { t } = useT();
  const [offres, setOffres] = useState([]);
  const [loading, setLoading] = useState(true);
  const [erreur, setErreur] = useState('');
  const [filtreType, setFiltreType] = useState('TOUS');
  const [selectedOffre, setSelectedOffre] = useState(null);

  const types = ['TOUS', 'CDI', 'CDD', 'Stage', 'Alternance', 'Freelance', 'Volontariat'];

  useEffect(() => {
    api('/carrieres')
      .then(data => {
        setOffres(data || []);
        setLoading(false);
      })
      .catch(err => {
        setErreur(err.message);
        setLoading(false);
      });
  }, []);

  const filtres = offres.filter(o => 
    filtreType === 'TOUS' || o.type === filtreType
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
        <p style={{ color: '#64748b' }}>Chargement des offres...</p>
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
              CARRIÈRES
            </span>
            <h1 style={{
              color: 'var(--blue-deep)',
              fontSize: 'clamp(28px, 3.5vw, 42px)',
              fontWeight: 800,
              lineHeight: 1.15,
              marginBottom: '12px'
            }}>
              {t('pages.carrieres.titre')}
            </h1>
            <p style={{
              fontSize: '17px',
              color: 'var(--text-main)',
              lineHeight: 1.7
            }}>
              Nous recrutons des talents passionnés par la recherche scientifique et le développement durable.
            </p>
            <p style={{
              fontSize: '14px',
              color: 'var(--text-muted)',
              marginTop: '8px'
            }}>
              {offres.length} offre{offres.length > 1 ? 's' : ''} disponible{offres.length > 1 ? 's' : ''}
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
            {types.map(t => {
              const count = t === 'TOUS' ? offres.length : offres.filter(o => o.type === t).length;
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

      {/* LISTE OFFRES */}
      <section style={{ padding: '24px 0 60px' }}>
        <div className="conteneur">
          {filtres.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '60px 20px', color: '#94a3b8' }}>
              <div style={{ fontSize: '48px', marginBottom: '12px' }}>💼</div>
              <p>Aucune offre ne correspond à vos critères</p>
              <p style={{ fontSize: '14px', marginTop: '4px' }}>
                Consultez régulièrement cette page pour de nouvelles opportunités
              </p>
            </div>
          ) : (
            <div style={{ display: 'grid', gap: '20px' }}>
              {filtres.map(o => {
                const isExpired = new Date(o.date_limite) < new Date();
                return (
                  <div 
                    key={o.id} 
                    className={`carte-offre-interactive ${isExpired ? 'offre-archivee' : ''}`}
                    style={{ 
                      padding: '24px',
                      background: 'white',
                      borderRadius: '12px',
                      border: '1px solid var(--border-color)',
                      borderLeft: `4px solid ${isExpired ? '#94a3b8' : (TYPE_COLORS[o.type] || 'var(--blue-brand)')}`,
                      boxShadow: 'var(--shadow-sm)'
                    }}
                  >
                    <div style={{ 
                      display: 'flex', 
                      justifyContent: 'space-between', 
                      flexWrap: 'wrap', 
                      gap: '10px',
                      alignItems: 'flex-start'
                    }}>
                      <div>
                        <h3 style={{ color: 'var(--blue-deep)', fontSize: '18px', fontWeight: '700', margin: 0 }}>
                          {o.titre}
                          {isExpired && (
                            <span style={{ 
                              fontSize: '12px', 
                              color: '#dc2626', 
                              marginLeft: '10px',
                              fontWeight: 600,
                              background: '#ffeeec',
                              padding: '2px 8px',
                              borderRadius: '4px'
                            }}>
                              📅 Offre expirée
                            </span>
                          )}
                        </h3>
                        <p style={{ fontSize: '13px', color: 'var(--text-muted)', marginTop: '6px', marginBottom: 0 }}>
                          📍 {o.lieu}
                        </p>
                      </div>
                      <span className="badge-lab" style={{
                        background: isExpired ? '#f1f5f9' : (TYPE_BG[o.type] || 'var(--bg-light)'),
                        color: isExpired ? '#64748b' : (TYPE_COLORS[o.type] || 'var(--text-muted)'),
                        fontSize: '12px',
                        fontWeight: '600',
                        padding: '4px 12px',
                        borderRadius: '6px'
                      }}>
                        {o.type}
                      </span>
                    </div>
                    
                    <p style={{ fontSize: '13px', color: 'var(--text-muted)', marginTop: '10px', marginBottom: 0 }}>
                      📅 Publiée le {formatDate(o.date_publication)}
                      {o.date_limite && ` · ⏳ Date limite: ${formatDate(o.date_limite)}`}
                    </p>
                    
                    <p style={{ color: 'var(--text-main)', marginTop: '12px', marginBottom: 0, lineHeight: '1.6' }}>
                      {o.description}
                    </p>
                    
                    <div style={{ 
                      marginTop: '16px', 
                      display: 'flex', 
                      gap: '12px', 
                      alignItems: 'center',
                      flexWrap: 'wrap',
                      paddingTop: '12px',
                      borderTop: '1px solid var(--border-color)'
                    }}>
                      <span style={{ fontSize: '13px', color: 'var(--text-muted)' }}>
                        📧 Contacter : 
                      </span>
                      <a 
                        href={`mailto:${o.contact}`} 
                        className="lien-contact-offre"
                        style={{ color: 'var(--blue-brand)', fontSize: '13px', fontWeight: '500', textDecoration: 'none' }}
                      >
                        {o.contact}
                      </a>
                      {!isExpired && (
                        <>
                          <span style={{ color: 'var(--border-color)' }}>|</span>
                          <button 
                            className="btn-lab btn-lab--primary btn-lab--sm"
                            onClick={() => setSelectedOffre(o)}
                            style={{ cursor: 'pointer' }}
                          >
                            📝 Postuler
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* Candidature spontanée */}
          <div style={{
            marginTop: '40px',
            padding: '36px 28px',
            background: 'var(--bg-light)',
            borderRadius: '12px',
            border: '2px dashed var(--border-color)',
            textAlign: 'center'
          }}>
            <div style={{ fontSize: '40px', marginBottom: '8px' }}>💡</div>
            <h3 style={{ color: 'var(--blue-deep)', fontSize: '19px', fontWeight: '700', margin: 0 }}>
              Candidature spontanée
            </h3>
            <p style={{ color: 'var(--text-muted)', marginTop: '8px', maxWidth: '500px', margin: '8px auto 0', fontSize: '14px', lineHeight: 1.5 }}>
              Vous ne trouvez pas d'offre correspondant à votre profil ?
              Envoyez-nous votre candidature spontanée pour rejoindre nos équipes.
            </p>
            <button 
              className="btn-lab btn-lab--primary" 
              style={{ marginTop: '16px', cursor: 'pointer' }}
              onClick={() => window.location.href = 'mailto:recrutement@icerd.cm?subject=Candidature%20spontanée&body=Bonjour,%20je%20souhaite%20postuler%20spontanément%20à%20l\'ICERD.%20Ci-joint%20mon%20CV.'}
            >
              ✉️ Envoyer ma candidature
            </button>
          </div>
        </div>
      </section>

      {/* MODAL POSTULATION */}
      {selectedOffre && (
        <div className="modal-overlay-custom" onClick={() => setSelectedOffre(null)}>
          <div className="modal-box-custom" style={{ maxWidth: '500px' }} onClick={e => e.stopPropagation()}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <h2 style={{ fontSize: '20px', fontWeight: '700', color: 'var(--blue-deep)', margin: 0 }}>Postuler à l'offre</h2>
              <button style={{ background: 'none', border: 'none', fontSize: '18px', cursor: 'pointer', color: 'var(--text-muted)' }} onClick={() => setSelectedOffre(null)}>✕</button>
            </div>
            
            <div style={{ marginBottom: '16px', padding: '12px', background: 'var(--bg-light)', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
              <h3 style={{ fontSize: '16px', color: 'var(--blue-deep)', margin: '0 0 4px 0', fontWeight: '700' }}>{selectedOffre.titre}</h3>
              <p style={{ fontSize: '13px', color: 'var(--text-muted)', margin: 0 }}>
                {selectedOffre.type} · {selectedOffre.lieu}
              </p>
            </div>
            
            <p style={{ fontSize: '14px', color: 'var(--text-main)', marginBottom: '16px', lineHeight: '1.5' }}>
              Pour postuler, vous pouvez envoyer directement votre dossier complet (CV et lettre de motivation) par courrier électronique.
            </p>
            
            <p style={{ fontSize: '13px', color: 'var(--text-muted)', marginBottom: '20px' }}>
              📧 Adresse de réception : <strong>{selectedOffre.contact}</strong>
            </p>
            
            <div style={{ display: 'flex', gap: '12px' }}>
              <a 
                href={`mailto:${selectedOffre.contact}?subject=Candidature%20-%20${encodeURIComponent(selectedOffre.titre)}&body=Bonjour,%0A%0AJe%20souhaite%20postuler%20à%20l'offre%20de%20${encodeURIComponent(selectedOffre.titre)}.%0A%0ACi-joint%20mon%20CV%20et%20ma%20lettre%20de%20motivation.%0A%0ACordialement.`}
                className="btn-lab btn-lab--primary"
                style={{ flex: 1, justifyContent: 'center', display: 'inline-flex', alignItems: 'center', textDecoration: 'none' }}
              >
                📧 Rédiger l'e-mail
              </a>
              <button 
                className="btn-lab btn-lab--ghost" 
                onClick={() => setSelectedOffre(null)}
                style={{ cursor: 'pointer' }}
              >
                Annuler
              </button>
            </div>
          </div>
        </div>
      )}

      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        @keyframes scaleUp { from { transform: scale(0.96); opacity: 0; } to { transform: scale(1); opacity: 1; } }
        
        .carte-offre-interactive {
          transition: transform 0.2s ease, box-shadow 0.2s ease !important;
        }
        .carte-offre-interactive:not(.offre-archivee):hover {
          transform: translateY(-3px);
          box-shadow: 0 10px 24px rgba(15, 45, 128, 0.06) !important;
        }
        .offre-archivee {
          opacity: 0.65;
          filter: grayscale(0.4);
          background: #fafafa !important;
        }
        .lien-contact-offre:hover {
          text-decoration: underline !important;
          color: var(--blue-deep) !important;
        }
        
        /* Modal local Architecture */
        .modal-overlay-custom {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(15, 23, 42, 0.45);
          backdrop-filter: blur(2px);
          display: flex;
          alignItems: center;
          justify-content: center;
          z-index: 1000;
          padding: 20px;
          animation: fadeIn 0.2s ease-out;
        }
        .modal-box-custom {
          background: white;
          width: 100%;
          border-radius: 12px;
          padding: 24px;
          box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
          animation: scaleUp 0.2s ease-out;
        }
      `}</style>
    </main>
  );
}