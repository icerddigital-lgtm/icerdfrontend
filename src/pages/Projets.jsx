// frontend/src/pages/Projets.jsx
import { useState, useEffect } from 'react';
import { useT } from '../i18n/index.jsx';
import { api, formatDate } from '../api.js';

export default function Projets() {
  const { t, libelleCategorie } = useT();

  const [projets, setProjets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filtreStatut, setFiltreStatut] = useState('TOUS');
  // Nouvel état pour suivre le projet actuellement sélectionné en détail
  const [projetSelectionne, setProjetSelectionne] = useState(null);

  const STATUTS = ['TOUS', 'En cours', 'Terminé', 'En préparation'];

  const STATUT_COLORS = {
    'En cours': '#1d4ed8',
    'Terminé': '#16a34a',
    'En préparation': '#f59e0b'
  };

  const STATUT_BG = {
    'En cours': '#e8edfd',
    'Terminé': '#dcfce7',
    'En préparation': '#fef3c7'
  };

  useEffect(() => {
    api('/projets')
      .then(setProjets)
      .catch(() => setProjets([]))
      .finally(() => setLoading(false));
  }, []);

  const filtres = projets.filter(p => 
    filtreStatut === 'TOUS' || p.statut === filtreStatut
  );

  // Fonction utilitaire pour tronquer le texte sur la carte principale
  const tronquerTexte = (texte, limite = 120) => {
    if (!texte) return '';
    if (texte.length <= limite) return texte;
    return texte.substring(0, limite) + '...';
  };

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
        <p style={{ color: '#64748b' }}>{t('cms.chargement.projets')}</p>
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
              {t('cms.surtitre.projets')}
            </span>
            <h1 style={{
              color: 'var(--blue-deep)',
              fontSize: 'clamp(28px, 3.5vw, 42px)',
              fontWeight: 800,
              lineHeight: 1.15,
              marginBottom: '12px'
            }}>
              {t('pages.projets.titre')}
            </h1>
            <p style={{
              fontSize: '17px',
              color: 'var(--text-main)',
              lineHeight: 1.7
            }}>
              {t('cms.intro.projets')}
            </p>
          </div>
        </div>
      </section>

      {/* ===== BARRE DE FILTRES ===== */}
      <section style={{ padding: '24px 0 60px' }}>
        <div className="conteneur">
          <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', marginBottom: '30px' }}>
            {STATUTS.map(s => (
              <button
                key={s}
                onClick={() => setFiltreStatut(s)}
                className={`btn-lab ${filtreStatut === s ? 'btn-lab--primary' : 'btn-lab--ghost'}`}
                style={{ fontSize: '13px', padding: '8px 18px', cursor: 'pointer' }}
              >
                {libelleCategorie(s)}
              </button>
            ))}
          </div>

          {/* ===== GRILLE DE CARTES ===== */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))',
            gap: '30px'
          }}>
            {filtres.map(p => (
              <div 
                key={p.id} 
                className="carte-projet-interactive" 
                onClick={() => setProjetSelectionne(p)}
                style={{ 
                  borderTop: `4px solid ${STATUT_COLORS[p.statut] || 'var(--blue-brand)'}`,
                  background: 'white',
                  borderRadius: '12px',
                  padding: '24px',
                  borderLeft: '1px solid var(--border-color)',
                  borderRight: '1px solid var(--border-color)',
                  borderBottom: '1px solid var(--border-color)',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.02)',
                  display: 'flex',
                  flexDirection: 'column',
                  cursor: 'pointer',
                  position: 'relative'
                }}
              >
                {p.image_url && (
                  <div style={{ overflow: 'hidden', borderRadius: '8px', marginBottom: '16px', height: '180px' }}>
                    <img src={p.image_url} alt={p.titre} className="projet-card-img" style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover',
                      transition: 'transform 0.3s ease'
                    }} />
                  </div>
                )}
                
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'flex-start',
                  gap: '12px',
                  marginBottom: '8px'
                }}>
                  <h3 style={{ 
                    color: 'var(--blue-deep)', 
                    fontSize: '18px', 
                    fontWeight: '700',
                    lineHeight: '1.3',
                    margin: 0 
                  }}>
                    {p.titre}
                  </h3>
                  <span className="badge-lab" style={{
                    background: STATUT_BG[p.statut] || 'var(--bg-light)',
                    color: STATUT_COLORS[p.statut] || 'var(--text-muted)',
                    whiteSpace: 'nowrap',
                    padding: '3px 10px',
                    borderRadius: '6px',
                    fontSize: '11px',
                    fontWeight: '600'
                  }}>
                    {libelleCategorie(p.statut)}
                  </span>
                </div>

                <p style={{ fontSize: '13px', color: 'var(--text-muted)', margin: '0 0 12px 0', display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <span>💰</span> <span style={{ fontWeight: '500' }}>{p.financement}</span>
                </p>
                
                {/* Description tronquée pour préserver l'harmonie visuelle */}
                <p style={{ color: 'var(--text-main)', fontSize: '14px', lineHeight: '1.5', flexGrow: 1, margin: '0 0 16px 0' }}>
                  {tronquerTexte(p.description)}
                </p>

                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginTop: 'auto',
                  paddingTop: '12px',
                  borderTop: '1px solid rgba(0,0,0,0.04)'
                }}>
                  {p.date_debut ? (
                    <span style={{ fontSize: '12px', color: 'var(--text-muted)', fontFamily: 'var(--mono)' }}>
                      📅 {formatDate(p.date_debut)}
                    </span>
                  ) : <span></span>}
                  
                  <span className="voir-plus-link" style={{ 
                    fontSize: '13px', 
                    fontWeight: '600', 
                    color: 'var(--blue-brand)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px'
                  }}>
                    {t('cms.voirDetailsFleche')}
                  </span>
                </div>
              </div>
            ))}
            
            {filtres.length === 0 && (
              <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '60px 20px', color: '#94a3b8' }}>
                <div style={{ fontSize: '40px', marginBottom: '8px' }}>📋</div>
                <p style={{ fontSize: '16px', fontWeight: '500' }}>{t('cms.vide.projets')}</p>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* ===== COMPOSANT MODAL (PROJET COMPLET) ===== */}
      {projetSelectionne && (
        <div className="modal-overlay" onClick={() => setProjetSelectionne(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            {/* Bouton de fermeture */}
            <button className="modal-close-btn" onClick={() => setProjetSelectionne(null)}>×</button>
            
            {projetSelectionne.image_url && (
              <div style={{ width: '100%', maxHeight: '300px', overflow: 'hidden', borderRadius: '8px', marginBottom: '20px' }}>
                <img 
                  src={projetSelectionne.image_url} 
                  alt={projetSelectionne.titre} 
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
              </div>
            )}

            <div style={{ display: 'flex', gap: '8px', alignItems: 'center', marginBottom: '12px' }}>
              <span className="badge-lab" style={{
                background: STATUT_BG[projetSelectionne.statut] || 'var(--bg-light)',
                color: STATUT_COLORS[projetSelectionne.statut] || 'var(--text-muted)',
                padding: '4px 12px',
                borderRadius: '6px',
                fontSize: '12px',
                fontWeight: '600'
              }}>
                {projetSelectionne.statut}
              </span>
              <span style={{ fontSize: '13px', color: 'var(--text-muted)', background: 'var(--bg-light)', padding: '4px 12px', borderRadius: '6px', fontWeight: '500' }}>
                💰 Financement : {projetSelectionne.financement}
              </span>
            </div>

            <h2 style={{ color: 'var(--blue-deep)', fontSize: '24px', fontWeight: '800', marginBottom: '16px', lineHeight: '1.25' }}>
              {projetSelectionne.titre}
            </h2>

            {/* Corps du texte complet */}
            <div style={{ 
              color: 'var(--text-main)', 
              fontSize: '15px', 
              lineHeight: '1.7', 
              whiteSpace: 'pre-line',
              maxHeight: '250px',
              overflowY: 'auto',
              paddingRight: '8px',
              marginBottom: '20px'
            }}>
              {projetSelectionne.description}
            </div>

            {projetSelectionne.date_debut && (
              <div style={{ 
                paddingTop: '16px', 
                borderTop: '1px solid var(--border-color)', 
                fontSize: '13px', 
                color: 'var(--text-muted)',
                fontFamily: 'var(--mono)',
                display: 'flex',
                gap: '16px'
              }}>
                <span>📅 Date de début : {formatDate(projetSelectionne.date_debut)}</span>
                {projetSelectionne.date_fin && <span>🏁 Fin prévue : {formatDate(projetSelectionne.date_fin)}</span>}
              </div>
            )}
          </div>
        </div>
      )}

      {/* ===== FEUILLE DE STYLE INTERACTIVE ===== */}
      <style>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes slideUp {
          from { transform: translateY(20px); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }

        /* --- Animations et interactions des cartes --- */
        .carte-projet-interactive {
          transition: transform 0.25s cubic-bezier(0.4, 0, 0.2, 1), box-shadow 0.25s cubic-bezier(0.4, 0, 0.2, 1) !important;
        }
        .carte-projet-interactive:hover {
          transform: translateY(-4px);
          box-shadow: 0 12px 24px rgba(0, 0, 0, 0.06) !important;
        }
        .carte-projet-interactive:hover .projet-card-img {
          transform: scale(1.03);
        }
        .carte-projet-interactive:hover .voir-plus-link {
          color: var(--blue-deep) !important;
          text-decoration: underline;
        }

        /* --- Interface de l'affichage Modal --- */
        .modal-overlay {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: rgba(15, 23, 42, 0.6); /* Fond sombre transparent */
          backdrop-filter: blur(4px);
          display: flex;
          align-items: center;
          justifyContent: center;
          z-index: 9999;
          padding: 20px;
          animation: fadeIn 0.2s ease-out;
        }

        .modal-content {
          background: #ffffff;
          width: 100%;
          max-width: 680px;
          border-radius: 16px;
          padding: 32px;
          box-shadow: 0 20px 50px rgba(0, 0, 0, 0.15);
          position: relative;
          animation: slideUp 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
        }

        .modal-close-btn {
          position: absolute;
          top: 16px;
          right: 16px;
          width: 32px;
          height: 32px;
          background: var(--bg-light);
          border: 1px solid var(--border-color);
          border-radius: 50%;
          font-size: 20px;
          color: var(--text-muted);
          cursor: pointer;
          display: flex;
          align-items: center;
          justifyContent: center;
          transition: all 0.15s ease;
          outline: none;
          line-height: 1;
        }
        .modal-close-btn:hover {
          background: var(--blue-brand-light);
          color: var(--blue-brand);
          transform: rotate(90deg);
        }

        /* Style de la barre de défilement interne de la description */
        .modal-content div::-webkit-scrollbar {
          width: 6px;
        }
        .modal-content div::-webkit-scrollbar-track {
          background: rgba(0,0,0,0.02);
          border-radius: 999px;
        }
        .modal-content div::-webkit-scrollbar-thumb {
          background: var(--border-color);
          border-radius: 999px;
        }

        /* Boutons de filtres */
        .btn-lab {
          border: 1px solid var(--border-color);
          border-radius: 8px;
          font-weight: 500;
          transition: all 0.2s ease;
        }
        .btn-lab--primary {
          background: var(--blue-brand);
          color: white;
          border-color: var(--blue-brand);
        }
        .btn-lab--ghost {
          background: transparent;
          color: var(--text-muted);
        }
        .btn-lab--ghost:hover {
          background: var(--bg-light);
          color: var(--blue-deep);
        }
      `}</style>
    </main>
  );
}