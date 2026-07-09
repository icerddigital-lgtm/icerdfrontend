// frontend/src/pages/Analyses.jsx
import { useEffect, useMemo, useState } from 'react';
import { api, fcfa } from '../api.js';

// ============================================================
// ICÔNES SVG PROFESSIONNELLES
// ============================================================
const Icon = ({ name, size = 20, color = '#1d4ed8', className = '' }) => {
  const icons = {
    'filter': (
      <path d="M10 18h4v-2h-4v2zM3 6v2h18V6H3zm3 7h12v-2H6v2z"/>
    ),
    'search': (
      <path d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"/>
    ),
    'price': (
      <path d="M11.8 10.9c-2.27-.59-3-1.2-3-2.15 0-1.09 1.01-1.85 2.7-1.85 1.78 0 2.44.85 2.5 2.1h2.21c-.07-1.72-1.12-3.3-3.21-3.81V3h-3v2.16c-1.94.42-3.5 1.68-3.5 3.61 0 2.31 1.91 3.46 4.7 4.13 2.5.6 3 1.48 3 2.41 0 .69-.49 1.79-2.7 1.79-2.06 0-2.87-.92-2.98-2.1h-2.2c.12 2.19 1.76 3.42 3.68 3.83V21h3v-2.15c1.95-.37 3.5-1.5 3.5-3.55 0-2.84-2.43-3.81-4.7-4.4z"/>
    ),
    'time': (
      <path d="M11.99 2C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zM12 20c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8zm.5-13H11v6l5.25 3.15.75-1.23-4.5-2.67z"/>
    ),
    'lab': (
      <path d="M19 3h-4.18C14.4 1.84 13.3 1 12 1c-1.3 0-2.4.84-2.82 2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-7 0c.55 0 1 .45 1 1s-.45 1-1 1-1-.45-1-1 .45-1 1-1zm2 14H7v-2h7v2zm3-4H7v-2h10v2zm0-4H7V7h10v2z"/>
    )
  };

  return (
    <svg 
      width={size} 
      height={size} 
      viewBox="0 0 24 24" 
      fill="currentColor" 
      className={className}
      style={{ color, flexShrink: 0 }}
    >
      {icons[name] || icons['lab']}
    </svg>
  );
};

// Catalogue de repli si l'API n'est pas encore lancée (démo hors ligne)
const CATALOGUE_DEMO = [
  { code: 'AN-SOL-003', nom: 'pH eau et pH KCl', matrice: 'SOL', categorie: 'ROUTINE', methode: 'Électrochimie', prix_fcfa: 3000, delai_jours: 2 },
  { code: 'AN-SOL-002', nom: 'Analyse texturale (granulométrie)', matrice: 'SOL', categorie: 'ROUTINE', methode: 'Tamisage / laser', prix_fcfa: 10000, delai_jours: 3 },
  { code: 'AN-SOL-101', nom: 'Métaux lourds (Pb, Cd, Cr, Ni…)', matrice: 'SOL', categorie: 'SPECIALE', methode: 'ICP-OES, ISO 11047', prix_fcfa: 25000, delai_jours: 5 },
  { code: 'AN-EAU-001', nom: 'pH, turbidité, conductivité', matrice: 'EAU', categorie: 'ROUTINE', methode: 'Électrochimie', prix_fcfa: 5000, delai_jours: 2 },
  { code: 'AN-EAU-101', nom: 'DBO5', matrice: 'EAU', categorie: 'SPECIALE', methode: 'Incubation 5 j', prix_fcfa: 15000, delai_jours: 7 },
  { code: 'AN-PLT-002', nom: 'N, P, K, Ca, Mg, Na (plantes)', matrice: 'PLANTE', categorie: 'ROUTINE', methode: 'Kjeldahl / AAS', prix_fcfa: 15000, delai_jours: 5 },
  { code: 'AN-MIN-002', nom: 'Dosage or, argent et dérivés', matrice: 'MINERAI', categorie: 'SPECIALE', methode: 'Pyroanalyse + AAS/ICP', prix_fcfa: 40000, delai_jours: 10 },
  { code: 'AN-GEO-005', nom: 'CBR (portance)', matrice: 'SOL', categorie: 'GEOTECHNIQUE', methode: 'NF P94-078', prix_fcfa: 30000, delai_jours: 7 },
  { code: 'AN-CAR-001', nom: 'Carte pédologique thématique', matrice: 'AUTRE', categorie: 'CARTOGRAPHIE', methode: 'SIG - télédétection', prix_fcfa: 150000, delai_jours: 15 },
];

const MATRICES = ['TOUTES', 'SOL', 'EAU', 'PLANTE', 'ENGRAIS', 'MINERAI', 'HYDROCARBURE', 'AUTRE'];
const CATEGORIES = ['TOUTES', 'ROUTINE', 'SPECIALE', 'GEOTECHNIQUE', 'CARTOGRAPHIE'];

// Icônes et couleurs par matrice (SVG)
const MATRICE_ICONS = {
  SOL: '🌱',
  EAU: '💧',
  PLANTE: '🌿',
  ENGRAIS: '🧪',
  MINERAI: '⛏️',
  HYDROCARBURE: '🛢️',
  AUTRE: '🔬'
};

const MATRICE_COLORS = {
  SOL: '#1d4ed8',
  EAU: '#0891b2',
  PLANTE: '#16a34a',
  ENGRAIS: '#d97706',
  MINERAI: '#7c3aed',
  HYDROCARBURE: '#dc2626',
  AUTRE: '#64748b'
};

export default function Analyses() {
  const [catalogue, setCatalogue] = useState(CATALOGUE_DEMO);
  const [matrice, setMatrice] = useState('TOUTES');
  const [categorie, setCategorie] = useState('TOUTES');
  const [recherche, setRecherche] = useState('');
  const [loading, setLoading] = useState(true);
  const [showPrix, setShowPrix] = useState(true);

  useEffect(() => {
    api('/analyses/catalogue')
      .then(data => {
        setCatalogue(data);
        setLoading(false);
      })
      .catch(() => {
        setLoading(false);
      });
  }, []);

  const filtres = useMemo(() => {
    let result = catalogue;
    if (matrice !== 'TOUTES') {
      result = result.filter(a => a.matrice === matrice);
    }
    if (categorie !== 'TOUTES') {
      result = result.filter(a => a.categorie === categorie);
    }
    if (recherche !== '') {
      const search = recherche.toLowerCase();
      result = result.filter(a =>
        a.nom.toLowerCase().includes(search) ||
        a.code.toLowerCase().includes(search) ||
        a.methode.toLowerCase().includes(search)
      );
    }
    return result;
  }, [catalogue, matrice, categorie, recherche]);

  const counts = useMemo(() => {
    const result = {};
    MATRICES.forEach(m => {
      if (m === 'TOUTES') {
        result[m] = catalogue.length;
      } else {
        result[m] = catalogue.filter(a => a.matrice === m).length;
      }
    });
    return result;
  }, [catalogue]);

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
        <p style={{ color: '#64748b' }}>Chargement du catalogue...</p>
      </div>
    );
  }

  return (
    <main style={{ background: 'var(--bg-pure)' }}>
      
      {/* ===== HÉROS ===== */}
      <section
        className="trame-points"
        style={{
          padding: '60px 0 56px',
          borderBottom: '1px solid var(--border-color)',
          background: 'var(--bg-light)'
        }}
      >
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
              CATALOGUE & TARIFS
            </span>
            <h1 style={{
              color: 'var(--blue-deep)',
              fontSize: 'clamp(28px, 3.5vw, 42px)',
              fontWeight: 800,
              lineHeight: 1.15,
              marginBottom: '12px'
            }}>
              Nos analyses, méthodes et délais
            </h1>
            <p style={{
              fontSize: '17px',
              color: 'var(--text-main)',
              lineHeight: 1.7
            }}>
              Analyses de routine et spéciales — sols, eaux, plantes, engrais, minerais, hydrocarbures.
              Les prix affichés sont indicatifs ; un devis précis vous est remis avant tout démarrage.
            </p>
          </div>
        </div>
      </section>

      {/* ===== FILTRES ===== */}
      <section style={{ padding: '32px 0 0' }}>
        <div className="conteneur">
          <div style={{ marginBottom: '20px' }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              marginBottom: '10px'
            }}>
              <Icon name="filter" size={18} color="var(--text-muted)" />
              <span style={{
                fontSize: '12px',
                fontWeight: 600,
                color: 'var(--text-muted)',
                textTransform: 'uppercase',
                letterSpacing: '0.5px'
              }}>
                Filtrer par matrice
              </span>
            </div>
            <div style={{
              display: 'flex',
              gap: '8px',
              flexWrap: 'wrap'
            }}>
              {MATRICES.map(m => {
                const isActive = matrice === m;
                const count = counts[m] || 0;
                const color = MATRICE_COLORS[m] || 'var(--blue-brand)';
                return (
                  <button
                    key={m}
                    onClick={() => setMatrice(m)}
                    className="matrice-btn"
                    style={{
                      padding: '8px 16px',
                      borderRadius: '999px',
                      border: isActive ? `2px solid ${color}` : '1.5px solid var(--border-color)',
                      background: isActive ? `${color}12` : 'transparent',
                      color: isActive ? color : 'var(--text-main)',
                      fontWeight: isActive ? 600 : 500,
                      fontSize: '13px',
                      cursor: 'pointer',
                      transition: 'all 0.2s ease',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '6px'
                    }}
                  >
                    {m !== 'TOUTES' && (MATRICE_ICONS[m] || '🔬')}
                    {m}
                    <span style={{
                      background: isActive ? color : 'var(--border-color)',
                      color: isActive ? 'white' : 'var(--text-muted)',
                      borderRadius: '999px',
                      padding: '0 8px',
                      fontSize: '10px',
                      fontWeight: 700,
                      minWidth: '18px',
                      textAlign: 'center'
                    }}>
                      {count}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          <div style={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: '16px',
            alignItems: 'center',
            marginBottom: '24px',
            padding: '16px 20px',
            background: 'var(--bg-light)',
            borderRadius: '12px',
            border: '1px solid var(--border-color)'
          }}>
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', flex: 1 }}>
              {CATEGORIES.map(c => (
                <button
                  key={c}
                  onClick={() => setCategorie(c)}
                  className={`categorie-btn ${categorie === c ? 'is-active' : ''}`}
                  style={{
                    padding: '4px 14px',
                    borderRadius: '999px',
                    border: categorie === c ? '2px solid var(--blue-brand)' : '1px solid var(--border-color)',
                    background: categorie === c ? 'var(--blue-brand-light)' : 'transparent',
                    color: categorie === c ? 'var(--blue-brand)' : 'var(--text-muted)',
                    fontWeight: categorie === c ? 600 : 400,
                    fontSize: '12px',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease'
                  }}
                >
                  {c}
                </button>
              ))}
            </div>

            <div style={{ display: 'flex', gap: '12px', alignItems: 'center', flexWrap: 'wrap' }}>
              <div style={{ position: 'relative' }}>
                <input
                  value={recherche}
                  onChange={e => setRecherche(e.target.value)}
                  placeholder="Rechercher une analyse..."
                  className="search-input-field"
                  style={{
                    padding: '8px 14px 8px 36px',
                    border: '1.5px solid var(--border-color)',
                    borderRadius: '8px',
                    fontSize: '14px',
                    minWidth: '200px',
                    background: 'white',
                    transition: 'all 0.2s ease',
                    outline: 'none'
                  }}
                  onFocus={e => e.target.style.borderColor = 'var(--blue-brand)'}
                  onBlur={e => e.target.style.borderColor = 'var(--border-color)'}
                />
                <Icon name="search" size={18} color="var(--text-muted)" style={{
                  position: 'absolute',
                  left: '10px',
                  top: '50%',
                  transform: 'translateY(-50%)'
                }} />
              </div>
              <button
                onClick={() => setShowPrix(!showPrix)}
                className="toggle-price-btn"
                style={{
                  padding: '8px 14px',
                  borderRadius: '8px',
                  border: '1.5px solid var(--border-color)',
                  background: showPrix ? 'var(--blue-brand)' : 'transparent',
                  color: showPrix ? 'white' : 'var(--text-muted)',
                  fontSize: '13px',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  fontWeight: 500,
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px'
                }}
              >
                <Icon name="price" size={16} color={showPrix ? 'white' : 'var(--text-muted)'} />
                {showPrix ? 'Prix affichés' : 'Masquer prix'}
              </button>
            </div>
          </div>

          <div style={{
            fontSize: '14px',
            color: 'var(--text-muted)',
            marginBottom: '12px'
          }}>
            <Icon name="lab" size={16} color="var(--text-muted)" style={{ marginRight: '6px' }} />
            {filtres.length} analyse{filtres.length > 1 ? 's' : ''} trouvée{filtres.length > 1 ? 's' : ''}
            {matrice !== 'TOUTES' && ` · ${matrice}`}
            {categorie !== 'TOUTES' && ` · ${categorie}`}
            {recherche && ` · "${recherche}"`}
          </div>
        </div>
      </section>

      {/* ===== TABLEAU ===== */}
      <section style={{ padding: '0 0 60px' }}>
        <div className="conteneur">
          <div className="tableau-lab custom-table-container">
            <table>
              <thead>
                <tr>
                  <th>Code</th>
                  <th>Analyse</th>
                  <th>Matrice</th>
                  <th>Catégorie</th>
                  <th>Méthode</th>
                  <th style={{ textAlign: 'center' }}>Délai</th>
                  {showPrix && <th style={{ textAlign: 'right' }}>Prix indicatif</th>}
                </tr>
              </thead>
              <tbody>
                {filtres.map(a => {
                  const color = MATRICE_COLORS[a.matrice] || 'var(--blue-brand)';
                  return (
                    <tr key={a.code} className="table-row-interactive">
                      <td style={{
                        fontFamily: 'var(--mono)',
                        fontSize: '12px',
                        color: 'var(--text-muted)',
                        fontWeight: 600
                      }}>
                        {a.code}
                      </td>
                      <td style={{ fontWeight: 500 }}>{a.nom}</td>
                      <td>
                        <span className="matrice-badge" style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '4px',
                          padding: '2px 10px',
                          borderRadius: '999px',
                          fontSize: '12px',
                          fontWeight: 600,
                          background: `${color}12`,
                          color: color,
                          border: `1px solid ${color}25`
                        }}>
                          {MATRICE_ICONS[a.matrice] || '🔬'} {a.matrice}
                        </span>
                      </td>
                      <td>
                        <span className="badge-lab filter-category-badge" style={{
                          background: a.categorie === 'SPECIALE' ? '#fef3c7' :
                            a.categorie === 'GEOTECHNIQUE' ? '#dbeafe' :
                            a.categorie === 'CARTOGRAPHIE' ? '#dcfce7' :
                            'var(--bg-light)',
                          color: a.categorie === 'SPECIALE' ? '#d97706' :
                            a.categorie === 'GEOTECHNIQUE' ? '#2563eb' :
                            a.categorie === 'CARTOGRAPHIE' ? '#16a34a' :
                            'var(--text-muted)'
                        }}>
                          {a.categorie}
                        </span>
                      </td>
                      <td style={{ fontSize: '13px', color: 'var(--text-muted)' }}>
                        {a.methode}
                      </td>
                      <td style={{
                        textAlign: 'center',
                        fontFamily: 'var(--mono)',
                        fontSize: '13px',
                        fontWeight: 500,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '4px'
                      }}>
                        <Icon name="time" size={14} color="var(--text-muted)" />
                        {a.delai_jours} j
                      </td>
                      {showPrix && (
                        <td style={{
                          textAlign: 'right',
                          fontFamily: 'var(--mono)',
                          fontWeight: 700,
                          fontSize: '15px',
                          color: 'var(--blue-deep)'
                        }}>
                          {fcfa(a.prix_fcfa)}
                        </td>
                      )}
                    </tr>
                  );
                })}
                {filtres.length === 0 && (
                  <tr>
                    <td colSpan={showPrix ? 7 : 6} style={{
                      textAlign: 'center',
                      padding: '40px 20px',
                      color: 'var(--text-muted)'
                    }}>
                      <div style={{ fontSize: '40px', marginBottom: '8px' }}>🔬</div>
                      <p style={{ fontWeight: 500 }}>Aucune analyse ne correspond à ce filtre</p>
                      <p style={{ fontSize: '14px' }}>Contactez-nous : nous réalisons aussi des analyses sur demande.</p>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          <div style={{
            marginTop: '16px',
            display: 'flex',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '12px',
            fontSize: '13px',
            color: 'var(--text-muted)'
          }}>
            <span>📋 {filtres.length} analyse{filtres.length > 1 ? 's' : ''} affichée{filtres.length > 1 ? 's' : ''}</span>
            <span>🔬 Méthodes normalisées • ISO 17025</span>
          </div>
        </div>
      </section>

      {/* ===== CTA ===== */}
      <section style={{
        padding: '40px 0',
        background: 'var(--bg-light)',
        borderTop: '1px solid var(--border-color)'
      }}>
        <div className="conteneur">
          <div style={{
            textAlign: 'center',
            maxWidth: '640px',
            margin: '0 auto'
          }}>
            <Icon name="lab" size={36} color="var(--blue-brand)" />
            <h3 style={{ fontSize: '20px', fontWeight: 700, color: 'var(--blue-deep)', marginTop: '8px', marginBottom: '8px' }}>
              Vous avez un projet ?
            </h3>
            <p style={{ color: 'var(--text-muted)', marginBottom: '16px', fontSize: '15px' }}>
              Besoin d'un devis personnalisé ou d'une analyse spécifique ?
              Notre équipe vous répond sous 48 heures.
            </p>
            <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' }}>
              <a href="/contact" className="btn-lab btn-lab--primary" style={{ padding: '12px 28px' }}>
                📄 Demander un devis
              </a>
              <a href="/laboratoires" className="btn-lab btn-lab--outline" style={{ padding: '12px 28px' }}>
                🔬 Nos laboratoires
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Styles avancés intégrés - Filtres et Lignes réactives */}
      <style>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }

        /* --- Alignement et Style des Filtres Principaux --- */
        .matrice-btn {
          outline: none;
          box-shadow: 0 1px 2px rgba(0, 0, 0, 0.02);
          transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1) !important;
        }
        .matrice-btn:hover {
          transform: translateY(-1.5px);
          box-shadow: 0 4px 8px rgba(0, 0, 0, 0.04);
          filter: brightness(0.97);
        }

        .categorie-btn {
          outline: none;
          transition: all 0.2s ease !important;
        }
        .categorie-btn:hover {
          background: rgba(0, 0, 0, 0.02) !important;
          color: var(--blue-brand) !important;
        }
        .categorie-btn.is-active {
          box-shadow: 0 2px 6px rgba(29, 78, 216, 0.15);
        }

        .search-input-field:focus {
          box-shadow: 0 0 0 3px rgba(29, 78, 216, 0.08);
          background: #fff !important;
        }
        
        .toggle-price-btn {
          outline: none;
          box-shadow: 0 1px 2px rgba(0, 0, 0, 0.02);
        }
        .toggle-price-btn:hover {
          filter: brightness(0.95);
        }

        /* --- Structure Épurée du Tableau --- */
        .custom-table-container {
          border: 1px solid rgba(0, 0, 0, 0.05) !important;
          border-radius: 12px !important;
          overflow: hidden;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.02) !important;
          background: #fff;
        }

        .custom-table-container table {
          width: 100%;
          border-collapse: collapse;
        }

        .custom-table-container th {
          background: var(--bg-light);
          padding: 14px 16px;
          font-weight: 600;
          font-size: 13px;
          color: var(--blue-deep);
          border-bottom: 1.5px solid var(--border-color);
        }

        .custom-table-container td {
          padding: 12px 16px;
          border-bottom: 1px solid rgba(0, 0, 0, 0.04);
          vertical-align: middle;
          transition: background-color 0.15s ease;
        }

        /* Interaction fluide sur les lignes du tableau */
        .table-row-interactive {
          transition: transform 0.15s ease, box-shadow 0.15s ease;
        }
        .table-row-interactive:hover td {
          background-color: rgba(29, 78, 216, 0.015) !important;
        }

        /* --- Badges & Micro-éléments --- */
        .matrice-badge {
          transition: transform 0.2s ease;
        }
        .table-row-interactive:hover .matrice-badge {
          transform: scale(1.03);
        }

        .filter-category-badge {
          padding: 3px 10px !important;
          border-radius: 6px !important;
          font-size: 11px !important;
          font-weight: 600 !important;
          letter-spacing: 0.3px;
        }

        .btn-lab {
          border-radius: 10px !important;
          transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1) !important;
          text-decoration: none;
          font-weight: 500;
        }
        .btn-lab:hover {
          transform: translateY(-2px);
          box-shadow: 0 6px 15px rgba(0, 0, 0, 0.08);
        }
      `}</style>
    </main>
  );
}