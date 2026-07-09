// frontend/src/pages/Accueil.jsx
import { Link } from 'react-router-dom';
import { useT } from '../i18n/index.jsx';
import { useState } from 'react';

const divisions = (t) => [
  { 
    code: 'DIVISION 01', 
    titre: t('accueil.div1Titre'),
    icone: '🌿',
    couleur: '#1d4ed8',
    image: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=600&h=400&fit=crop',
    texte: t('accueil.div1Texte'),
    stats: t('accueil.statsProjetsEnv')
  },
  { 
    code: 'DIVISION 02', 
    titre: t('accueil.div2Titre'),
    icone: '🌾',
    couleur: '#16a34a',
    image: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=600&h=400&fit=crop',
    texte: t('accueil.div2Texte'),
    stats: t('accueil.statsProjetsAgri')
  },
  { 
    code: 'DIVISION 03', 
    titre: t('accueil.div3Titre'),
    icone: '⛏️',
    couleur: '#b4552d',
    image: 'https://images.unsplash.com/photo-1504917595217-d4dc5ebe6122?w=600&h=400&fit=crop',
    texte: t('accueil.div3Texte'),
    stats: t('accueil.statsProjetsMine')
  },
];

const etapes = (t) => [
  {
    code: '01',
    titre: t('accueil.etape1Titre'),
    description: t('accueil.etape1Texte'),
    icone: '📋',
    couleur: '#1d4ed8'
  },
  {
    code: '02',
    titre: t('accueil.etape2Titre'),
    description: t('accueil.etape2Texte'),
    icone: '🔬',
    couleur: '#16a34a'
  },
  {
    code: '03',
    titre: t('accueil.etape3Titre'),
    description: t('accueil.etape3Texte'),
    icone: '📄',
    couleur: '#b4552d'
  },
];

// Logo ICERD depuis public/logo
const LogoICERD = ({ size = 80 }) => {
  const [imageError, setImageError] = useState(false);

  return (
    <div style={{ display: 'inline-flex', alignItems: 'center', gap: '16px' }}>
      {!imageError ? (
        <img
          src="/logo/logo-icerd.png"
          alt="ICERD - International Centre of Environmental Studies and Research for Development"
          width={size}
          height={size}
          style={{ 
            objectFit: 'contain',
            maxWidth: size,
            maxHeight: size
          }}
          onError={() => setImageError(true)}
        />
      ) : (
        <div style={{
          width: size,
          height: size,
          background: 'linear-gradient(135deg, #1d4ed8, #0f2d80)',
          borderRadius: '16px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          position: 'relative',
          flexShrink: 0,
          boxShadow: '0 8px 32px rgba(29, 78, 216, 0.30)'
        }}>
          <svg width={size * 0.55} height={size * 0.75} viewBox="0 0 50 65" fill="none">
            <path d="M18 8 H32 M20 8 V45 C20 52 23 58 32 58 C41 58 44 52 44 45 V8" stroke="white" strokeWidth="4" strokeLinecap="round"/>
            <circle cx="30" cy="42" r="3" fill="#ff6b35" />
            <circle cx="36" cy="28" r="2.5" fill="white" opacity="0.6" />
            <circle cx="26" cy="18" r="2" fill="white" opacity="0.4" />
            <path d="M14 4 L20 8 M40 8 L46 4" stroke="white" strokeWidth="2.5" strokeLinecap="round"/>
          </svg>
          <span style={{
            position: 'absolute',
            top: '-4px',
            right: '-4px',
            width: size * 0.22,
            height: size * 0.22,
            background: '#ff6b35',
            borderRadius: '50%',
            border: '3px solid white',
            boxShadow: '0 2px 8px rgba(255, 107, 53, 0.4)'
          }}></span>
        </div>
      )}
      <div>
        <div style={{
          fontWeight: 800,
          fontSize: size * 0.42,
          color: '#0f2d80',
          lineHeight: 1,
          letterSpacing: '-0.5px'
        }}>
          ICERD
        </div>
        <div style={{
          fontSize: size * 0.16,
          color: '#64748b',
          fontWeight: 500,
          letterSpacing: '0.8px',
          textTransform: 'uppercase'
        }}>
          International Centre of Environmental Studies and Research for Development
        </div>
      </div>
    </div>
  );
};

export default function Accueil() {
  const { t } = useT();
  const DIVISIONS = divisions(t);
  const ETAPES = etapes(t);
  const [hoveredDivision, setHoveredDivision] = useState(null);

  return (
    <main style={{ background: 'var(--bg-pure)' }}>
      
      {/* ===== HÉROS ULTIME ===== */}
      <section className="trame-points" style={{
        padding: '80px 0 100px',
        borderBottom: '1px solid var(--border-color)',
        position: 'relative',
        overflow: 'hidden'
      }}>
        <div style={{
          position: 'absolute',
          right: '-10%',
          top: '-20%',
          width: '600px',
          height: '600px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(29,78,216,0.03) 0%, transparent 70%)',
          pointerEvents: 'none'
        }}></div>
        <div style={{
          position: 'absolute',
          left: '-5%',
          bottom: '-10%',
          width: '400px',
          height: '400px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(255,107,53,0.03) 0%, transparent 70%)',
          pointerEvents: 'none'
        }}></div>

        <div className="conteneur" style={{ position: 'relative', zIndex: 1 }}>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))',
            gap: '60px',
            alignItems: 'center'
          }}>
            
            {/* TEXTE */}
            <div style={{ position: 'relative' }}>
              <div style={{
                position: 'absolute',
                top: '-60px',
                left: '-60px',
                right: '-60px',
                bottom: '-60px',
                background: 'radial-gradient(circle, rgba(29,78,216,0.05) 1.5px, transparent 1.5px)',
                backgroundSize: '15px 15px',
                borderRadius: '50%',
                opacity: 0.6,
                zIndex: -1,
                pointerEvents: 'none'
              }}></div>
              
              <LogoICERD size={90} />
              
              <div style={{ marginTop: '32px' }}>
                <div style={{
                  display: 'inline-block',
                  fontFamily: 'var(--mono)',
                  fontSize: '12px',
                  color: 'var(--blue-brand)',
                  fontWeight: '600',
                  letterSpacing: '1px',
                  padding: '4px 16px',
                  background: 'var(--blue-brand-light)',
                  borderRadius: '999px',
                  marginBottom: '16px'
                }}>
                  {t('accueil.surtitre').toUpperCase()}
                </div>
                <h1 style={{
                  color: 'var(--blue-deep)',
                  fontSize: 'clamp(34px, 4.8vw, 58px)',
                  fontWeight: 800,
                  lineHeight: 1.08,
                  marginBottom: '20px',
                  letterSpacing: '-0.02em'
                }}>
                  {t('accueil.titre1')}{' '}
                  <span style={{ color: 'var(--orange-brand)' }}>{t('accueil.titreAccent')}</span>
                  <br />{t('accueil.titre2')}
                </h1>
                <p style={{
                  fontSize: '18px',
                  color: 'var(--text-main)',
                  marginBottom: '32px',
                  lineHeight: 1.8,
                  maxWidth: '560px'
                }}>
                  {t('accueil.intro')}
                </p>
                <div style={{ display: 'flex', gap: '14px', flexWrap: 'wrap' }}>
                  <Link to="/analyses" className="btn-lab btn-lab--primary" style={{ padding: '14px 32px' }}>
                    📋 {t('accueil.ctaCatalogue')}
                  </Link>
                  <Link to="/contact" className="btn-lab btn-lab--outline" style={{ padding: '14px 32px' }}>
                    📄 {t('accueil.ctaDevis')}
                  </Link>
                  <Link to="/portail" className="btn-lab btn-lab--accent" style={{ padding: '14px 32px' }}>
                    🔐 {t('nav.portail')}
                  </Link>
                </div>
              </div>
            </div>

            {/* ILLUSTRATION */}
            <div style={{ display: 'flex', justifyContent: 'center' }}>
              <div style={{
                background: 'white',
                border: '2px solid var(--blue-brand)',
                borderRadius: '20px',
                padding: '32px',
                width: '100%',
                maxWidth: '480px',
                boxShadow: '0 20px 60px rgba(29, 78, 216, 0.10)',
                transition: 'transform 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
                position: 'relative'
              }}
              onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-4px)'}
              onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
              >
                <div style={{
                  position: 'absolute',
                  top: '-12px',
                  right: '-12px',
                  background: '#22c55e',
                  color: 'white',
                  padding: '4px 16px',
                  borderRadius: '999px',
                  fontSize: '11px',
                  fontWeight: 700,
                  boxShadow: '0 4px 12px rgba(34, 197, 94, 0.3)',
                  letterSpacing: '0.5px'
                }}>
                  ✓ ISO 17025
                </div>

                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginBottom: '24px',
                  borderBottom: '1px solid var(--border-color)',
                  paddingBottom: '16px'
                }}>
                  <img
                    src="/logo/logo-icerd-icon.png"
                    alt="ICERD"
                    width="40"
                    height="40"
                    style={{ objectFit: 'contain' }}
                    onError={(e) => { e.target.style.display = 'none'; }}
                  />
                  <span style={{
                    fontFamily: 'var(--mono)',
                    fontSize: '13px',
                    fontWeight: 'bold',
                    color: 'var(--blue-deep)',
                    letterSpacing: '0.5px'
                  }}>
                    ICERD_ANALYSIS_PLATFORM
                  </span>
                  <div style={{
                    width: '12px',
                    height: '12px',
                    background: '#22c55e',
                    borderRadius: '50%',
                    animation: 'pulse 2s infinite'
                  }}></div>
                </div>

                <div style={{ textAlign: 'center', padding: '20px 0' }}>
                  <svg width="100" height="120" viewBox="0 0 100 120" fill="none" style={{ margin: '0 auto' }}>
                    <path d="M35 15 H65 M40 15 V85 C40 95 45 105 60 105 C75 105 80 95 80 85 V15"
                      stroke="var(--blue-brand)" strokeWidth="6" strokeLinecap="round"/>
                    <circle cx="50" cy="80" r="5" fill="var(--orange-brand)" />
                    <circle cx="65" cy="55" r="4" fill="var(--blue-brand)" opacity="0.5" />
                    <circle cx="45" cy="40" r="3" fill="var(--blue-brand)" opacity="0.3" />
                    <path d="M28 6 L35 15 M72 15 L79 6" stroke="var(--blue-brand)" strokeWidth="4" strokeLinecap="round"/>
                  </svg>
                  <div style={{
                    fontFamily: 'var(--mono)',
                    fontSize: '12px',
                    color: 'var(--text-muted)',
                    marginTop: '12px',
                    letterSpacing: '1px'
                  }}>
                    {t('accueil.qualiteCertifiee').toUpperCase()}
                  </div>
                </div>

                <div style={{
                  background: 'var(--bg-light)',
                  padding: '14px 18px',
                  borderRadius: '10px',
                  border: '1px solid var(--border-color)',
                  fontFamily: 'var(--mono)',
                  fontSize: '12px',
                  display: 'grid',
                  gridTemplateColumns: '1fr 1fr',
                  gap: '4px 16px'
                }}>
                  <span style={{ color: 'var(--blue-brand)' }}>✓ ISO 17025</span>
                  <span style={{ color: 'var(--text-main)' }}>{t('accueil.exigences')}</span>
                  <span style={{ color: 'var(--orange-brand)' }}>✓ MINADER</span>
                  <span style={{ color: 'var(--text-main)' }}>{t('accueil.partenaireDepuis')}</span>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ===== COMPTEURS AVEC VISUELS ===== */}
      <section style={{
        padding: '40px 0',
        background: 'var(--bg-light)',
        borderBottom: '1px solid var(--border-color)'
      }}>
        <div className="conteneur">
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
            gap: '20px'
          }}>
            {[
              { valeur: 'ISO 17025', label: t('accueil.exigences'), couleur: 'var(--blue-brand)', icone: '🏅' },
              { valeur: '3', label: t('accueil.compteurLabos'), couleur: 'var(--blue-deep)', icone: '🔬' },
              { valeur: '20+', label: t('accueil.compteurRegionaux'), couleur: 'var(--orange-brand)', icone: '🌍' },
              { valeur: 'MINADER', label: t('accueil.partenaireDepuis'), couleur: 'var(--blue-brand)', icone: '🤝' }
            ].map((item, index) => (
              <div 
                key={index} 
                className="compteur-item"
                style={{ 
                  textAlign: 'center', 
                  padding: '16px',
                  background: 'white',
                  borderRadius: '12px',
                  border: '1px solid var(--border-color)',
                  transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
                  cursor: 'default'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-4px)';
                  e.currentTarget.style.boxShadow = '0 12px 24px rgba(0,0,0,0.04)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = 'none';
                }}
              >
                <div style={{ fontSize: '32px', marginBottom: '4px' }}>{item.icone}</div>
                <div style={{
                  fontSize: '32px',
                  fontWeight: 800,
                  color: item.couleur,
                  fontFamily: 'var(--display)',
                  lineHeight: 1.2
                }}>
                  {item.valeur}
                </div>
                <div style={{ fontSize: '13px', color: 'var(--text-muted)', fontWeight: 500 }}>
                  {item.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== DIVISIONS AVEC IMAGES ===== */}
      <section className="section section--white" style={{ padding: '80px 0' }}>
        <div className="conteneur">
          <div style={{ textAlign: 'center', marginBottom: '56px' }}>
            <span style={{
              fontFamily: 'var(--mono)',
              fontSize: '12px',
              color: 'var(--orange-brand)',
              fontWeight: '600',
              letterSpacing: '1px'
            }}>
              {t('accueil.divisionsSurtitre').toUpperCase()}
            </span>
            <h2 style={{ 
              color: 'var(--blue-deep)', 
              marginTop: '6px', 
              fontSize: 'clamp(28px, 3.5vw, 42px)',
              fontWeight: 800
            }}>
              {t('accueil.divisionsTitre')}
            </h2>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
            gap: '30px'
          }}>
            {DIVISIONS.map((d, index) => (
              <article 
                key={d.code} 
                className="carte-lab" 
                style={{ 
                  borderTop: `4px solid ${d.couleur}`,
                  padding: '0',
                  overflow: 'hidden',
                  transition: 'all 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
                  position: 'relative'
                }}
                onMouseEnter={(e) => {
                  setHoveredDivision(index);
                  e.currentTarget.style.transform = 'translateY(-8px)';
                  e.currentTarget.style.boxShadow = '0 20px 40px rgba(0,0,0,0.06)';
                }}
                onMouseLeave={(e) => {
                  setHoveredDivision(null);
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = 'var(--shadow-sm)';
                }}
              >
                <div style={{
                  height: '200px',
                  background: `url(${d.image}) center/cover no-repeat`,
                  position: 'relative'
                }}>
                  <div style={{
                    position: 'absolute',
                    bottom: 0,
                    left: 0,
                    right: 0,
                    height: '60%',
                    background: 'linear-gradient(to top, rgba(0,0,0,0.6), transparent)'
                  }}></div>
                  <div style={{
                    position: 'absolute',
                    bottom: '16px',
                    left: '20px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px'
                  }}>
                    <span style={{ fontSize: '28px' }}>{d.icone}</span>
                    <span style={{
                      fontFamily: 'var(--mono)',
                      fontSize: '11px',
                      color: 'white',
                      fontWeight: 600,
                      background: 'rgba(0,0,0,0.4)',
                      padding: '2px 12px',
                      borderRadius: '999px',
                      backdropFilter: 'blur(4px)',
                      WebkitBackdropFilter: 'blur(4px)'
                    }}>
                      {d.code}
                    </span>
                  </div>
                </div>

                <div style={{ padding: '24px 28px 28px' }}>
                  <h3 style={{ 
                    color: 'var(--blue-deep)', 
                    fontSize: '20px', 
                    marginBottom: '10px',
                    fontWeight: 700
                  }}>
                    {d.titre}
                  </h3>
                  <p style={{ fontSize: '14.5px', color: 'var(--text-main)', lineHeight: 1.7 }}>
                    {d.texte}
                  </p>
                  <div style={{
                    marginTop: '16px',
                    paddingTop: '16px',
                    borderTop: '1px solid var(--border-color)',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center'
                  }}>
                    <span style={{
                      fontSize: '12px',
                      color: 'var(--text-muted)',
                      fontWeight: 500
                    }}>
                      📊 {d.stats}
                    </span>
                    <Link 
                      to="/analyses" 
                      className="link-division-more"
                      style={{
                        fontSize: '13px',
                        color: d.couleur,
                        fontWeight: 600,
                        textDecoration: 'none',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '4px'
                      }}
                    >
                      {t('pages.enSavoirPlus')} →
                    </Link>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* ===== PARCOURS ===== */}
      <section className="section section--light" style={{ padding: '80px 0' }}>
        <div className="conteneur">
          <div style={{ textAlign: 'center', marginBottom: '56px' }}>
            <span style={{
              fontFamily: 'var(--mono)',
              fontSize: '12px',
              color: 'var(--blue-brand)',
              fontWeight: '600',
              letterSpacing: '1px'
            }}>
              {t('accueil.processusSurtitre').toUpperCase()}
            </span>
            <h2 style={{ 
              color: 'var(--blue-deep)', 
              marginTop: '6px',
              fontSize: 'clamp(28px, 3.5vw, 42px)',
              fontWeight: 800
            }}>
              {t('accueil.processusTitre')}
            </h2>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
            gap: '30px'
          }}>
            {ETAPES.map((etape, index) => (
              <div 
                key={etape.code} 
                className="etape-card"
                style={{
                  background: 'white',
                  padding: '32px 28px',
                  borderRadius: '16px',
                  border: '1px solid var(--border-color)',
                  boxShadow: 'var(--shadow-sm)',
                  transition: 'all 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
                  position: 'relative'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-6px)';
                  e.currentTarget.style.boxShadow = '0 20px 40px rgba(0,0,0,0.05)';
                  e.currentTarget.style.borderColor = etape.couleur;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = 'var(--shadow-sm)';
                  e.currentTarget.style.borderColor = 'var(--border-color)';
                }}
              >
                <div style={{
                  position: 'absolute',
                  top: '12px',
                  right: '16px',
                  fontSize: '48px',
                  fontWeight: 900,
                  color: etape.couleur,
                  opacity: 0.08,
                  fontFamily: 'var(--display)'
                }}>
                  {etape.code}
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '16px' }}>
                  <div style={{
                    width: '48px',
                    height: '48px',
                    borderRadius: '12px',
                    background: `${etape.couleur}15`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '24px',
                    border: `1px solid ${etape.couleur}30`
                  }}>
                    {etape.icone}
                  </div>
                  <div>
                    <span style={{
                      fontFamily: 'var(--mono)',
                      fontSize: '11px',
                      color: etape.couleur,
                      fontWeight: 600,
                      letterSpacing: '0.5px'
                    }}>
                      {t('pages.etape')} {etape.code}
                    </span>
                    <h3 style={{
                      color: 'var(--blue-deep)',
                      fontSize: '18px',
                      margin: 0,
                      fontWeight: 700
                    }}>
                      {etape.titre}
                    </h3>
                  </div>
                </div>

                <p style={{ fontSize: '14px', color: 'var(--text-main)', lineHeight: 1.7, margin: 0 }}>
                  {etape.description}
                </p>

                <div style={{
                  marginTop: '20px',
                  height: '3px',
                  background: 'var(--bg-light)',
                  borderRadius: '2px',
                  overflow: 'hidden'
                }}>
                  <div style={{
                    width: `${((index + 1) / ETAPES.length) * 100}%`,
                    height: '100%',
                    background: `linear-gradient(90deg, ${etape.couleur}, var(--orange-brand))`,
                    borderRadius: '2px'
                  }}></div>
                </div>
              </div>
            ))}
          </div>

          <div style={{ textTransform: 'none', textAlign: 'center', marginTop: '40px' }}>
            <Link to="/laboratoires" className="btn-lab btn-lab--outline" style={{ padding: '12px 32px' }}>
              🔬 {t('accueil.conseilCta')}
            </Link>
          </div>
        </div>
      </section>

      {/* ===== APPUI-CONSEIL ULTIME ===== */}
      <section className="section section--white" style={{ padding: '80px 0', position: 'relative', overflow: 'hidden' }}>
        <div style={{
          position: 'absolute',
          right: '-20%',
          top: '-30%',
          width: '600px',
          height: '600px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(29,78,216,0.03) 0%, transparent 70%)',
          pointerEvents: 'none'
        }}></div>

        <div className="conteneur" style={{ position: 'relative', zIndex: 1, textAlign: 'center', maxWidth: '800px', margin: '0 auto' }}>
          <div style={{
            display: 'inline-block',
            fontFamily: 'var(--mono)',
            fontSize: '12px',
            color: 'var(--blue-brand)',
            fontWeight: '600',
            letterSpacing: '1px',
            padding: '4px 16px',
            background: 'var(--blue-brand-light)',
            borderRadius: '999px',
            marginBottom: '16px'
          }}>
            DECISION MAKING
          </div>
          <h2 style={{ 
            color: 'var(--blue-deep)', 
            fontSize: 'clamp(28px, 3.5vw, 42px)',
            fontWeight: 800,
            marginBottom: '16px'
          }}>
            {t('accueil.conseilTitre')}
          </h2>
          <p style={{
            fontSize: '17px',
            color: 'var(--text-main)',
            marginBottom: '32px',
            lineHeight: 1.8
          }}>
            {t('accueil.conseilTexte')}
          </p>
          <div style={{ display: 'flex', gap: '14px', justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link to="/a-propos" className="btn-lab btn-lab--accent" style={{ padding: '14px 32px' }}>
              🔬 {t('accueil.conseilCta')}
            </Link>
            <Link to="/contact" className="btn-lab btn-lab--outline" style={{ padding: '14px 32px' }}>
              📄 {t('contact.titre')}
            </Link>
          </div>
        </div>
      </section>

      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.4; transform: scale(0.96); }
        }

        .btn-lab {
          position: relative;
          overflow: hidden;
          outline: none;
          border-radius: 10px !important;
          border-width: 1.5px !important;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.02), 0 1px 0 rgba(255, 255, 255, 0.1) inset;
          transition: all 0.25s cubic-bezier(0.25, 1, 0.5, 1) !important;
        }

        .btn-lab:hover {
          transform: translateY(-2px);
          filter: brightness(1.05);
          box-shadow: 0 8px 20px rgba(29, 78, 216, 0.15);
        }

        .btn-lab:active {
          transform: translateY(0);
          filter: brightness(0.95);
        }

        .carte-lab {
          background: #ffffff !important;
          border-radius: 16px !important;
          border: 1px solid rgba(0, 0, 0, 0.06) !important;
          box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.01), 0 2px 4px -1px rgba(0, 0, 0, 0.01) !important;
        }

        .carte-lab:hover {
          border-color: rgba(0, 0, 0, 0.03) !important;
        }

        .link-division-more {
          transition: transform 0.2s ease, opacity 0.2s ease;
        }
        .carte-lab:hover .link-division-more {
          transform: translateX(4px);
        }

        .etape-card {
          border: 1px solid rgba(0, 0, 0, 0.05) !important;
          border-radius: 16px !important;
          background: #ffffff !important;
        }

        .compteur-item {
          border: 1px solid rgba(0, 0, 0, 0.05) !important;
          border-radius: 14px !important;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.01);
        }

        .carte-lab img, .carte-lab div:first-child {
          border-top-left-radius: 12px;
          border-top-right-radius: 12px;
        }
      `}</style>
    </main>
  );
}