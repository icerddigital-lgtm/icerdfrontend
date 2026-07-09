// frontend/src/pages/FAQ.jsx
import { useState, useEffect } from 'react';
import { useT } from '../i18n/index.jsx';
import { api } from '../api.js';

export default function FAQ() {
  const { t } = useT();
  const [faqs, setFaqs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [erreur, setErreur] = useState('');
  const [openId, setOpenId] = useState(null); // Changement d'index vers ID unique
  const [categorie, setCategorie] = useState('TOUS');
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    Promise.all([
      api('/faq'),
      api('/faq/categories')
    ])
      .then(([faqData, categoriesData]) => {
        setFaqs(faqData || []);
        setCategories(categoriesData || []);
        setLoading(false);
      })
      .catch(err => {
        setErreur(err.message);
        setLoading(false);
      });
  }, []);

  const filtres = faqs.filter(f => 
    categorie === 'TOUS' || f.categorie === categorie
  );

  const toggleFaq = (id) => {
    setOpenId(openId === id ? null : id);
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
        <p style={{ color: '#64748b' }}>Chargement des questions...</p>
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
              FAQ
            </span>
            <h1 style={{
              color: 'var(--blue-deep)',
              fontSize: 'clamp(28px, 3.5vw, 42px)',
              fontWeight: 800,
              lineHeight: 1.15,
              marginBottom: '12px'
            }}>
              {t('pages.faq.titre')}
            </h1>
            <p style={{
              fontSize: '17px',
              color: 'var(--text-main)',
              lineHeight: 1.7
            }}>
              Les réponses aux questions les plus fréquemment posées sur l'ICERD.
            </p>
            <p style={{
              fontSize: '14px',
              color: 'var(--text-muted)',
              marginTop: '8px'
            }}>
              {faqs.length} question{faqs.length > 1 ? 's' : ''} disponible{faqs.length > 1 ? 's' : ''}
            </p>
          </div>
        </div>
      </section>

      {/* FILTRES PAR CATÉGORIE */}
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
            <button
              onClick={() => setCategorie('TOUS')}
              className={`btn-lab ${categorie === 'TOUS' ? 'btn-lab--primary' : 'btn-lab--ghost'}`}
              style={{ fontSize: '13px', padding: '6px 16px', cursor: 'pointer' }}
            >
              TOUTES ({faqs.length})
            </button>
            {categories.map(c => (
              <button
                key={c.categorie}
                onClick={() => setCategorie(c.categorie)}
                className={`btn-lab ${categorie === c.categorie ? 'btn-lab--primary' : 'btn-lab--ghost'}`}
                style={{ fontSize: '13px', padding: '6px 16px', cursor: 'pointer' }}
              >
                {c.categorie} ({c.total})
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* LISTE FAQ */}
      <section style={{ padding: '24px 0 60px' }}>
        <div className="conteneur">
          <div style={{ maxWidth: '800px', margin: '0 auto' }}>
            {filtres.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '40px 20px', color: '#94a3b8' }}>
                <div style={{ fontSize: '48px', marginBottom: '12px' }}>❓</div>
                <p>Aucune question dans cette catégorie</p>
              </div>
            ) : (
              filtres.map((item, index) => {
                const itemUniqueId = item.id || `faq-${index}`;
                const isOpen = openId === itemUniqueId;

                return (
                  <div 
                    key={itemUniqueId} 
                    style={{
                      marginBottom: '16px',
                      border: isOpen ? '1px solid var(--blue-brand)' : '1px solid var(--border-color)',
                      borderRadius: '12px',
                      overflow: 'hidden',
                      background: 'white',
                      boxShadow: isOpen ? '0 4px 12px rgba(29, 78, 216, 0.04)' : 'var(--shadow-sm)',
                      transition: 'all 0.2s ease-in-out'
                    }}
                  >
                    <button
                      onClick={() => toggleFaq(itemUniqueId)}
                      className="faq-header"
                      style={{
                        width: '100%',
                        padding: '18px 24px',
                        background: 'transparent',
                        border: 'none',
                        textAlign: 'left',
                        cursor: 'pointer',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        fontFamily: 'var(--texte)',
                        fontSize: '16px',
                        fontWeight: 600,
                        color: isOpen ? 'var(--blue-brand)' : 'var(--blue-deep)',
                        transition: 'color 0.2s ease'
                      }}
                    >
                      <span style={{ paddingRight: '16px', lineHeight: 1.4 }}>{item.question}</span>
                      <span style={{
                        fontSize: '14px',
                        color: isOpen ? 'var(--blue-brand)' : 'var(--text-muted)',
                        transition: 'transform 0.25s cubic-bezier(0.4, 0, 0.2, 1)',
                        transform: isOpen ? 'rotate(180deg)' : 'rotate(0)'
                      }}>
                        ▼
                      </span>
                    </button>
                    
                    {isOpen && (
                      <div style={{
                        padding: '0 24px 20px 24px',
                        background: 'white',
                        color: 'var(--text-main)',
                        lineHeight: 1.7,
                        fontSize: '15px',
                        animation: 'slideDown 0.2s ease-out'
                      }}>
                        <div style={{
                          paddingTop: '12px',
                          borderTop: '1px solid var(--border-color)'
                        }}>
                          {item.reponse}
                        </div>
                        {item.categorie && (
                          <div style={{ marginTop: '14px' }}>
                            <span className="badge-lab" style={{
                              background: '#e8edfd',
                              color: '#1d4ed8',
                              fontSize: '11px',
                              fontWeight: '600',
                              padding: '4px 10px',
                              borderRadius: '4px'
                            }}>
                              {item.categorie}
                            </span>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                );
              })
            )}
          </div>
        </div>
      </section>

      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        @keyframes slideDown {
          from { opacity: 0; transform: translateY(-4px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        .faq-header:hover {
          background: var(--bg-light) !important;
          color: var(--blue-brand) !important;
        }
      `}</style>
    </main>
  );
}