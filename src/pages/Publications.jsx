// frontend/src/pages/Publications.jsx
import { useState, useEffect, useMemo } from 'react';
import { useT } from '../i18n/index.jsx';
import { api, formatDate } from '../api.js';

// ============================================================
// ICÔNES SVG PROFESSIONNELLES
// ============================================================
const Icon = ({ name, size = 20, color = 'currentColor', style = {} }) => {
  const icons = {
    'search': <path d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"/>,
    'grid': <path d="M3 3h8v8H3V3zm0 10h8v8H3v-8zm10-10h8v8h-8V3zm0 10h8v8h-8v-8z"/>,
    'list': <path d="M3 13h2v-2H3v2zm0 4h2v-2H3v2zm0-8h2V7H3v2zm4 4h14v-2H7v2zm0 4h14v-2H7v2zM7 7v2h14V7H7z"/>,
    'calendar': <path d="M19 3h-1V1h-2v2H8V1H6v2H5c-1.11 0-1.99.9-1.99 2L3 19c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V8h14v11z"/>,
    'book': <path d="M4 6H2v14c0 1.1.9 2 2 2h14v-2H4V6zm16-4H8c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm-3 9H9V9h8v2zm-4 4H9v-2h4v2z"/>,
    'link': <path d="M3.9 12c0-1.71 1.39-3.1 3.1-3.1h4V7H7c-2.76 0-5 2.24-5 5s2.24 5 5 5h4v-1.9H7c-1.71 0-3.1-1.39-3.1-3.1zM8 13h8v-2H8v2zm9-6h-4v1.9h4c1.71 0 3.1 1.39 3.1 3.1s-1.39 3.1-3.1 3.1h-4V17h4c2.76 0 5-2.24 5-5s-2.24-5-5-5z"/>,
    'chart': <path d="M11 2v20c-5.07-.5-9-4.79-9-10s3.93-9.5 9-10zm2 0v8.5L20.5 5C18.87 3.17 16.14 2.06 13 2zm0 10.5V22c3.14-.06 5.87-1.17 7.5-3l-7.5-6.5z"/>
  };

  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" style={{ color, flexShrink: 0, ...style }}>
      {icons[name] || icons['book']}
    </svg>
  );
};

const CATEGORIES = ['TOUTES', 'Article', 'Rapport', 'Thèse', 'Communication', 'Livre'];
const ANNEES = ['TOUTES', '2026', '2025', '2024', '2023', '2022', '2021'];

const getBadgeStyles = (cat) => {
  const mapping = {
    'Article': { bg: 'rgba(29, 78, 216, 0.08)', text: '#1d4ed8', border: 'rgba(29, 78, 216, 0.15)' },
    'Rapport': { bg: 'rgba(180, 85, 45, 0.08)', text: '#b4552d', border: 'rgba(180, 85, 45, 0.15)' },
    'Livre': { bg: 'rgba(29, 111, 66, 0.08)', text: '#1d6f42', border: 'rgba(29, 111, 66, 0.15)' },
    'Thèse': { bg: 'rgba(109, 40, 217, 0.08)', text: '#6d28d9', border: 'rgba(109, 40, 217, 0.15)' },
  };
  return mapping[cat] || { bg: 'var(--bg-light, #f8fafc)', text: 'var(--text-muted, #64748b)', border: 'var(--border-color, #e2e8f0)' };
};

export default function Publications() {
  const { t } = useT();
  const [publications, setPublications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [categorie, setCategorie] = useState('TOUTES');
  const [annee, setAnnee] = useState('TOUTES');
  const [recherche, setRecherche] = useState('');
  const [vue, setVue] = useState('grid');
  const [page, setPage] = useState(1);
  const [selected, setSelected] = useState(null);
  const itemsPerPage = 9;

  useEffect(() => {
    api('/publications')
      .then(setPublications)
      .catch(() => setPublications([]))
      .finally(() => setLoading(false));
  }, []);

  const filtres = useMemo(() => {
    let result = publications;
    if (categorie !== 'TOUTES') result = result.filter(p => p.categorie === categorie);
    if (annee !== 'TOUTES') result = result.filter(p => p.date_publication?.startsWith(annee));
    if (recherche !== '') {
      const search = recherche.toLowerCase();
      result = result.filter(p =>
        p.titre?.toLowerCase().includes(search) || p.auteurs?.toLowerCase().includes(search)
      );
    }
    return result;
  }, [publications, categorie, annee, recherche]);

  const totalPages = Math.ceil(filtres.length / itemsPerPage);
  const paginated = filtres.slice((page - 1) * itemsPerPage, page * itemsPerPage);

  const stats = useMemo(() => {
    const total = publications.length;
    const byCategorie = {};
    CATEGORIES.filter(c => c !== 'TOUTES').forEach(c => {
      byCategorie[c] = publications.filter(p => p.categorie === c).length;
    });
    return { total, byCategorie };
  }, [publications]);

  if (loading) {
    return (
      <div className="conteneur" style={{ padding: '60px 20px', textAlign: 'center' }}>
        <div style={{ maxWidth: '600px', margin: '0 auto 40px', height: '100px', background: '#f1f5f9', borderRadius: '12px' }} className="skeleton" />
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: '24px' }}>
          {[1, 2, 3].map(n => (
            <div key={n} style={{ padding: '24px', background: 'white', border: '1px solid #e2e8f0', borderRadius: '12px', height: '280px' }} className="skeleton" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <main style={{ background: 'var(--bg-pure, #ffffff)', minHeight: '100vh' }}>
      
      {/* ===== HÉROS ===== */}
      <section className="trame-points" style={{
        padding: '80px 0 60px',
        borderBottom: '1px solid var(--border-color, #e2e8f0)',
        background: 'linear-gradient(180deg, var(--bg-light, #f8fafc) 0%, rgba(255,255,255,0) 100%)'
      }}>
        <div className="conteneur">
          <div style={{ textAlign: 'center', maxWidth: '800px', margin: '0 auto' }}>
            <span style={{
              fontFamily: 'var(--mono, monospace)',
              fontSize: '11px',
              color: 'var(--blue-brand, #1d4ed8)',
              fontWeight: '700',
              letterSpacing: '2px',
              display: 'inline-block',
              marginBottom: '16px',
              textTransform: 'uppercase',
              background: 'rgba(29, 78, 216, 0.06)',
              padding: '4px 12px',
              borderRadius: '20px'
            }}>
              {t('publications.indexTitre')}
            </span>
            <h1 style={{
              color: 'var(--blue-deep, #0f172a)',
              fontSize: 'clamp(32px, 4vw, 48px)',
              fontWeight: 800,
              lineHeight: 1.1,
              letterSpacing: '-0.02em',
              marginBottom: '16px'
            }}>
              {t('pages.publications.titre')}
            </h1>
            <p style={{ fontSize: '18px', color: 'var(--text-main, #334155)', lineHeight: 1.6, marginBottom: '32px' }}>
              {t('pages.publications.intro')}
            </p>

            {/* BARRE DE STATS LOOK DASHBOARD MINIMALISTE */}
            <div style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '20px',
              background: 'white',
              padding: '10px 24px',
              borderRadius: '14px',
              boxShadow: '0 4px 20px rgba(0, 0, 0, 0.03)',
              border: '1px solid var(--border-color, #e2e8f0)',
              flexWrap: 'wrap',
              justifyContent: 'center'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <div style={{
                  background: 'rgba(29, 78, 216, 0.08)',
                  color: 'var(--blue-brand, #1d4ed8)',
                  padding: '6px',
                  borderRadius: '8px',
                  display: 'flex',
                  alignItems: 'center'
                }}>
                  <Icon name="chart" size={16} />
                </div>
                <span style={{ fontSize: '14px', color: 'var(--text-main, #0f172a)', fontWeight: '600' }}>
                  {stats.total} <span style={{ fontWeight: '400', color: '#64748b' }}>{t('publications.travauxIndexes')}</span>
                </span>
              </div>
              <div style={{ width: '1px', background: '#e2e8f0', height: '18px' }} className="hide-mobile" />
              <div style={{ display: 'flex', gap: '14px', flexWrap: 'wrap', fontSize: '13px', color: '#64748b' }}>
                {Object.entries(stats.byCategorie).map(([cat, count]) => count > 0 && (
                  <span key={cat}>
                    <strong style={{ color: '#334155', fontWeight: '600' }}>{count}</strong> {cat}
                  </span>
                ))}
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ===== BARRE DE FILTRES STICKY ===== */}
      <section style={{ padding: '32px 0 0', position: 'sticky', top: 0, zIndex: 10 }}>
        <div className="conteneur">
          <div style={{
            padding: '16px',
            background: 'rgba(255, 255, 255, 0.85)',
            backdropFilter: 'blur(12px)',
            WebkitBackdropFilter: 'blur(12px)',
            borderRadius: '16px',
            border: '1px solid var(--border-color, #e2e8f0)',
            boxShadow: '0 10px 30px rgba(0,0,0,0.02)'
          }}>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '16px', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap' }}>
                {CATEGORIES.map(c => (
                  <button
                    key={c}
                    onClick={() => { setCategorie(c); setPage(1); }}
                    style={{ 
                      fontSize: '13px', padding: '8px 16px', borderRadius: '8px',
                      background: categorie === c ? 'var(--blue-brand, #1d4ed8)' : 'transparent',
                      color: categorie === c ? '#fff' : 'var(--text-main, #334155)',
                      border: 'none', fontWeight: categorie === c ? '600' : '400', cursor: 'pointer'
                    }}
                  >
                    {t('publications.categories.' + c) || c}
                  </button>
                ))}
              </div>

              <div style={{ display: 'flex', gap: '10px', alignItems: 'center', flexWrap: 'wrap' }}>
                <select
                  value={annee}
                  onChange={e => { setAnnee(e.target.value); setPage(1); }}
                  style={{ padding: '10px 14px', borderRadius: '8px', border: '1px solid #e2e8f0', fontSize: '13px', background: 'white' }}
                >
                  {ANNEES.map(a => <option key={a} value={a}>{a === 'TOUTES' ? t('publications.toutesAnnees') : a}</option>)}
                </select>

                <div style={{ position: 'relative' }}>
                  <input
                    type="text"
                    placeholder={t('publications.rechercher')}
                    value={recherche}
                    onChange={e => { setRecherche(e.target.value); setPage(1); }}
                    style={{ padding: '10px 16px 10px 38px', border: '1px solid #e2e8f0', borderRadius: '8px', fontSize: '13px', width: '180px' }}
                  />
                  <Icon name="search" size={16} color="#94a3b8" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
                </div>

                <div style={{ display: 'flex', gap: '2px', background: '#f1f5f9', padding: '4px', borderRadius: '8px' }}>
                  <button onClick={() => setVue('grid')} style={{ padding: '6px 10px', borderRadius: '6px', border: 'none', background: vue === 'grid' ? 'white' : 'transparent', cursor: 'pointer' }}>
                    <Icon name="grid" size={16} color={vue === 'grid' ? 'var(--blue-brand, #1d4ed8)' : '#94a3b8'} />
                  </button>
                  <button onClick={() => setVue('list')} style={{ padding: '6px 10px', borderRadius: '6px', border: 'none', background: vue === 'list' ? 'white' : 'transparent', cursor: 'pointer' }}>
                    <Icon name="list" size={16} color={vue === 'list' ? 'var(--blue-brand, #1d4ed8)' : '#94a3b8'} />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===== GRILLE / LISTE DE CARTES ===== */}
      <section style={{ padding: '32px 0 80px' }}>
        <div className="conteneur">
          <div style={{
            display: vue === 'grid' ? 'grid' : 'flex',
            flexDirection: vue === 'list' ? 'column' : 'unset',
            gridTemplateColumns: vue === 'grid' ? 'repeat(auto-fill, minmax(360px, 1fr))' : 'unset',
            gap: '24px'
          }}>
            {paginated.map(p => {
              const badge = getBadgeStyles(p.categorie);
              const isList = vue === 'list';

              return (
                <div
                  key={p.id}
                  style={{
                    display: isList ? 'flex' : 'block', gap: isList ? '24px' : '0',
                    background: 'white', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '24px', cursor: 'pointer'
                  }}
                  className="carte-publication"
                  onClick={() => setSelected(p)}
                >
                  {p.image_url && (
                    <div style={{ 
                      width: isList ? '180px' : '100%', height: isList ? '130px' : '180px',
                      flexShrink: 0, borderRadius: '8px', overflow: 'hidden', marginBottom: isList ? '0' : '16px'
                    }}>
                      <img src={p.image_url} alt={p.titre} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    </div>
                  )}

                  <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                    <div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                        <span style={{ background: badge.bg, color: badge.text, border: `1px solid ${badge.border}`, fontSize: '11px', fontWeight: '600', padding: '2px 10px', borderRadius: '6px', textTransform: 'uppercase' }}>
                          {t('publications.categories.' + p.categorie) || p.categorie}
                        </span>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '13px', color: '#64748b' }}>
                          <Icon name="calendar" size={13} color="#94a3b8" />
                          {formatDate(p.date_publication)}
                        </div>
                      </div>

                      <h3 style={{ color: 'var(--blue-deep, #0f172a)', fontSize: '18px', fontWeight: '700', lineHeight: 1.4, marginBottom: '6px' }}>{p.titre}</h3>
                      <p style={{ color: 'var(--blue-brand, #1d4ed8)', fontSize: '14px', fontWeight: '500', marginBottom: '12px' }}>{p.auteurs}</p>
                      <p style={{ color: '#475569', fontSize: '14px', lineHeight: 1.5, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{p.resume}</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ===== MODAL DÉTAIL PREMIUM AVEC L'IMAGE COMPLÈTE ===== */}
      {selected && (
        <div className="modal-overlay" onClick={() => setSelected(null)} style={{
          position: 'fixed', top: 0, left: 0, width: '100%', height: '100%',
          background: 'rgba(15, 23, 42, 0.4)', backdropFilter: 'blur(8px)',
          WebkitBackdropFilter: 'blur(8px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100, padding: '20px'
        }}>
          <div className="modal-box" style={{ 
            maxWidth: '760px', width: '100%', background: 'white', borderRadius: '20px', 
            boxShadow: '0 25px 50px -12px rgba(0,0,0,0.25)', overflow: 'hidden'
          }} onClick={e => e.stopPropagation()}>
            
            {/* Image de couverture en entête de la modale si disponible */}
            {selected.image_url && (
              <div style={{ width: '100%', height: '240px', overflow: 'hidden', position: 'relative', borderBottom: '1px solid #f1f5f9' }}>
                <img src={selected.image_url} alt={selected.titre} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                <button onClick={() => setSelected(null)} style={{ 
                  position: 'absolute', top: '16px', right: '16px', background: 'rgba(15, 23, 42, 0.6)', 
                  border: 'none', width: '36px', height: '36px', borderRadius: '50%', color: 'white', 
                  fontSize: '16px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', backdropFilter: 'blur(4px)'
                }}>✕</button>
              </div>
            )}

            {/* Titre alternatif sans image si pas d'image_url */}
            {!selected.image_url && (
              <div style={{ padding: '24px 32px', borderBottom: '1px solid #f1f5f9', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '11px', fontWeight: '700', textTransform: 'uppercase', color: 'var(--blue-brand, #1d4ed8)', letterSpacing: '1px' }}>
                  {t('publications.detailsDocument')}
                </span>
                <button onClick={() => setSelected(null)} style={{ background: 'none', border: 'none', fontSize: '20px', cursor: 'pointer', color: '#94a3b8' }}>✕</button>
              </div>
            )}

            <div style={{ padding: '32px', maxHeight: selected.image_url ? 'calc(100vh - 420px)' : 'calc(100vh - 220px)', overflowY: 'auto' }}>
              <div style={{ display: 'flex', gap: '10px', alignItems: 'center', marginBottom: '14px' }}>
                <span style={{ fontSize: '12px', background: getBadgeStyles(selected.categorie).bg, color: getBadgeStyles(selected.categorie).text, padding: '4px 12px', borderRadius: '6px', fontWeight: '600', textTransform: 'uppercase' }}>
                  {t('publications.categories.' + selected.categorie) || selected.categorie}
                </span>
                <span style={{ fontSize: '13px', color: '#64748b' }}>
                  📅 {t('publications.ecritLe')} {formatDate(selected.date_publication)}
                </span>
              </div>

              <h2 style={{ fontSize: '24px', fontWeight: '800', color: 'var(--blue-deep, #0f172a)', lineHeight: 1.3, marginBottom: '10px' }}>{selected.titre}</h2>
              <p style={{ color: 'var(--blue-brand, #1d4ed8)', fontSize: '15px', fontWeight: '500', marginBottom: '24px' }}>{selected.auteurs}</p>
              
              <h4 style={{ fontSize: '12px', fontWeight: '700', textTransform: 'uppercase', color: '#94a3b8', letterSpacing: '0.5px', marginBottom: '8px' }}>
                {t('publications.resume')}
              </h4>
              <p style={{ fontSize: '15px', color: 'var(--text-main, #334155)', lineHeight: 1.7, whiteSpace: 'pre-wrap', background: '#f8fafc', padding: '20px', borderRadius: '10px', border: '1px solid #f1f5f9' }}>
                {selected.resume}
              </p>
            </div>

            <div style={{ padding: '20px 32px', background: '#f8fafc', borderTop: '1px solid #f1f5f9', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              {selected.doi ? (
                <a href={`https://doi.org/${selected.doi}`} target="_blank" rel="noopener noreferrer" style={{
                  color: 'white', background: 'var(--blue-brand, #1d4ed8)', textDecoration: 'none', padding: '10px 20px', borderRadius: '8px', fontSize: '14px', fontWeight: '500'
                }}>
                  {t('publications.consulterSource')}
                </a>
              ) : <div />}
              <button style={{ background: 'white', border: '1px solid #cbd5e1', padding: '10px 20px', borderRadius: '8px', fontSize: '14px', cursor: 'pointer', color: '#475569', fontWeight: '500' }} onClick={() => setSelected(null)}>
                {t('commun.fermer')}
              </button>
            </div>

          </div>
        </div>
      )}
    </main>
  );
}