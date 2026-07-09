// frontend/src/pages/Apropos.jsx
import { useState, useEffect } from 'react';
import { useT } from '../i18n/index.jsx';
import { Link } from 'react-router-dom';

// ============================================================
// ICÔNES SVG PROFESSIONNELLES (Font Awesome style)
// ============================================================
const Icon = ({ name, size = 24, color = '#1d4ed8', className = '' }) => {
  const icons = {
    'rocket': <path d="M12 2C7.58 2 4 5.58 4 10c0 2.58 1.42 4.83 3.5 6.09V18c0 1.1.9 2 2 2h5c1.1 0 2-.9 2-2v-1.91C18.58 14.83 20 12.58 20 10c0-4.42-3.58-8-8-8zm0 14c-2.21 0-4-1.79-4-4s1.79-4 4-4 4 1.79 4 4-1.79 4-4 4z"/>,
    'book': <path d="M4 6H2v14c0 1.1.9 2 2 2h14v-2H4V6zm16-4H8c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm-3 9H9V9h8v2zm-4 4H9v-2h4v2z"/>,
    'handshake': <path d="M16 4c0-1.1.9-2 2-2s2 .9 2 2-.9 2-2 2-2-.9-2-2zm-4 7c0-1.1.9-2 2-2s2 .9 2 2-.9 2-2 2-2-.9-2-2zm-6 0c0-1.1.9-2 2-2s2 .9 2 2-.9 2-2 2-2-.9-2-2zm8 5c0 1.1-.9 2-2 2s-2-.9-2-2 .9-2 2-2 2 .9 2 2zM4 10c0-1.1.9-2 2-2s2 .9 2 2-.9 2-2 2-2-.9-2-2zm12 6c0 1.1-.9 2-2 2s-2-.9-2-2 .9-2 2-2 2 .9 2 2z"/>,
    'shield': <path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5L12 1zm0 10.99h7c-.53 4.12-3.28 7.79-7 8.94V12H5V6.3l7-3.11v8.8z"/>,
    'globe': <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z"/>,
    'target': <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm0-14c-3.31 0-6 2.69-6 6s2.69 6 6 6 6-2.69 6-6-2.69-6-6-6zm0 9c-1.66 0-3-1.34-3-3s1.34-3 3-3 3 1.34 3 3-1.34 3-3 3z"/>,
    'building': <path d="M12 7V3H2v18h20V7H12zM6 19H4v-2h2v2zm0-4H4v-2h2v2zm0-4H4V9h2v2zm0-4H4V5h2v2zm4 12H8v-2h2v2zm0-4H8v-2h2v2zm0-4H8V9h2v2zm0-4H8V5h2v2zm10 12h-8v-2h2v-2h-2v-2h2v-2h-2V9h8v10zm-2-8h-2v2h2v-2zm0 4h-2v2h2v-2z"/>,
    'calendar': <path d="M19 3h-1V1h-2v2H8V1H6v2H5c-1.11 0-1.99.9-1.99 2L3 19c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V8h14v11z"/>,
    'users': <path d="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5c-1.66 0-3 1.34-3 3s1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5C6.34 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z"/>,
    'flask': <path d="M19 3h-4.18C14.4 1.84 13.3 1 12 1c-1.3 0-2.4.84-2.82 2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-7 0c.55 0 1 .45 1 1s-.45 1-1 1-1-.45-1-1 .45-1 1-1zm4 12h-2v2h2v2h-2v2h-2v-2h2v-2h-2v-2h2V9h2v6z"/>,
    'microscope': <path d="M12 2c-4.41 0-8 3.59-8 8 0 1.55.47 2.98 1.28 4.19l-3.22 3.22c-.39.39-.39 1.02 0 1.41l2.12 2.12c.39.39 1.02.39 1.41 0l3.22-3.22C9.02 17.53 10.45 18 12 18c4.41 0 8-3.59 8-8s-3.59-8-8-8zm0 14c-3.31 0-6-2.69-6-6s2.69-6 6-6 6 2.69 6 6-2.69 6-6 6zm0-10c-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4-1.79-4-4-4z"/>,
    'leaf': <path d="M17 8c-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4-1.79-4-4-4zm0 6c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2z"/>,
    'chart': <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zM9 17H7v-7h2v7zm4 0h-2V7h2v10zm4 0h-2v-4h2v4z"/>,
    'envelope': <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/>,
    'lab': <path d="M19 3h-4.18C14.4 1.84 13.3 1 12 1c-1.3 0-2.4.84-2.82 2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-7 0c.55 0 1 .45 1 1s-.45 1-1 1-1-.45-1-1 .45-1 1-1zm4 12h-2v2h2v2h-2v2h-2v-2h2v-2h-2v-2h2V9h2v6z"/>,
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
      {icons[name] || icons['target']}
    </svg>
  );
};

const MISSIONS = [
  {
    lettre: 'I',
    titre: 'Intensifier',
    description: "Valoriser les partenariats recherche-paysan pour développer des systèmes de production adaptés et à haut rendement.",
    couleur: '#1d4ed8',
    icon: 'rocket',
    image: 'https://res.cloudinary.com/y4wao1xm/image/upload/v1783457504/pexels-safari-consoler-3290243-11196893_acnr7n.jpg'
  },
  {
    lettre: 'C',
    titre: 'Capitaliser',
    description: "Valoriser les résultats de recherche, les expériences et savoirs locaux ; mutualiser ces connaissances pour aborder la modernisation.",
    couleur: '#0891b2',
    icon: 'book',
    image: 'https://images.unsplash.com/photo-1507842217343-583bb7270b66?w=600&h=400&fit=crop'
  },
  {
    lettre: 'E',
    titre: 'Établir',
    description: "Un dialogue entre acteurs ruraux, en mutualisant énergies, idées et connaissances pour une maîtrise des techniques de production.",
    couleur: '#16a34a',
    icon: 'handshake',
    image: 'https://images.unsplash.com/photo-1577563908411-5077b6dc7624?w=600&h=400&fit=crop'
  },
  {
    lettre: 'R',
    titre: 'Renforcer',
    description: "Les compétences des agents locaux, agriculteurs et partenaires en gestion rationnelle des ressources naturelles — cœur de métier de l'ICERD.",
    couleur: '#d97706',
    icon: 'shield',
    image: 'https://images.unsplash.com/photo-1531482615713-2afd69097998?w=600&h=400&fit=crop'
  },
  {
    lettre: 'D',
    titre: 'Développer',
    description: "Une recherche conjointe pour l'émergence d'une agriculture industrielle soucieuse de l'environnement.",
    couleur: '#7c3aed',
    icon: 'globe',
    image: 'https://res.cloudinary.com/y4wao1xm/image/upload/v1783457580/pexels-hermaion-37899490_eqjios.jpg'
  }
];

const CHIFFRES = [
  { valeur: '2021', label: 'Année de création', couleur: '#1d4ed8', icon: 'calendar' },
  { valeur: '3', label: 'Laboratoires spécialisés', couleur: '#0891b2', icon: 'flask' },
  { valeur: '20+', label: 'Laboratoires régionaux appuyés', couleur: '#16a34a', icon: 'users' },
  { valeur: 'ISO 17025', label: 'Exigences internationales', couleur: '#d97706', icon: 'target' }
];

const SLIDES = [
  {
    image: 'https://res.cloudinary.com/y4wao1xm/image/upload/v1783457607/pexels-kelly-3030321_kh9yd6.jpg',
    titre: 'Recherche environnementale',
    description: 'Études d\'impact et préservation des écosystèmes'
  },
  {
    image: 'https://res.cloudinary.com/y4wao1xm/image/upload/v1783457537/pexels-topeasokere-6247764_ww3o1w.jpg',
    titre: 'Agriculture durable',
    description: 'Optimisation des rendements et gestion des sols'
  },
  {
    image: 'https://res.cloudinary.com/y4wao1xm/image/upload/v1783439038/WhatsApp_Image_2026-07-07_at_16.43.21_rngtag.jpg',
    titre: 'Géologie et mines',
    description: 'Évaluation des ressources minérales et géotechnique'
  },
  {
    image: 'https://images.unsplash.com/photo-1531482615713-2afd69097998?w=1200&h=600&fit=crop',
    titre: 'Innovation scientifique',
    description: 'Recherche et développement pour l\'avenir'
  }
];

export default function Apropos() {
  const { t } = useT();
  const [activeMission, setActiveMission] = useState(null);
  const [slideIndex, setSlideIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setSlideIndex((prev) => (prev + 1) % SLIDES.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const goToSlide = (index) => setSlideIndex(index);
  const prevSlide = () => setSlideIndex((prev) => (prev - 1 + SLIDES.length) % SLIDES.length);
  const nextSlide = () => setSlideIndex((prev) => (prev + 1) % SLIDES.length);

  return (
    <main style={{ background: 'var(--bg-pure)' }}>
      
      {/* ===== CARROUSEL ===== */}
      <section style={{
        position: 'relative',
        height: '500px',
        overflow: 'hidden',
        background: '#0f2d80'
      }}>
        {SLIDES.map((slide, index) => (
          <div
            key={index}
            style={{
              position: 'absolute',
              inset: 0,
              opacity: slideIndex === index ? 1 : 0,
              transition: 'opacity 0.8s ease-in-out',
              background: `url(${slide.image}) center/cover no-repeat`
            }}
          >
            <div style={{
              position: 'absolute',
              inset: 0,
              background: 'linear-gradient(to top, rgba(0,0,0,0.7), rgba(0,0,0,0.2))'
            }}></div>
            <div style={{
              position: 'absolute',
              bottom: '80px',
              left: '50%',
              transform: 'translateX(-50%)',
              textAlign: 'center',
              color: 'white',
              maxWidth: '700px',
              padding: '0 20px'
            }}>
              <h2 style={{
                fontSize: 'clamp(32px, 4vw, 48px)',
                fontWeight: 800,
                marginBottom: '12px',
                textShadow: '0 2px 20px rgba(0,0,0,0.3)'
              }}>
                {slide.titre}
              </h2>
              <p style={{
                fontSize: '18px',
                opacity: 0.9,
                textShadow: '0 2px 10px rgba(0,0,0,0.3)'
              }}>
                {slide.description}
              </p>
            </div>
          </div>
        ))}

        <button
          onClick={prevSlide}
          style={{
            position: 'absolute',
            left: '20px',
            top: '50%',
            transform: 'translateY(-50%)',
            background: 'rgba(255,255,255,0.2)',
            border: 'none',
            color: 'white',
            fontSize: '28px',
            padding: '12px 18px',
            borderRadius: '50%',
            cursor: 'pointer',
            backdropFilter: 'blur(4px)',
            transition: 'all 0.3s ease',
            zIndex: 10
          }}
          onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.4)'}
          onMouseLeave={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.2)'}
        >
          ‹
        </button>
        <button
          onClick={nextSlide}
          style={{
            position: 'absolute',
            right: '20px',
            top: '50%',
            transform: 'translateY(-50%)',
            background: 'rgba(255,255,255,0.2)',
            border: 'none',
            color: 'white',
            fontSize: '28px',
            padding: '12px 18px',
            borderRadius: '50%',
            cursor: 'pointer',
            backdropFilter: 'blur(4px)',
            transition: 'all 0.3s ease',
            zIndex: 10
          }}
          onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.4)'}
          onMouseLeave={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.2)'}
        >
          ›
        </button>

        <div style={{
          position: 'absolute',
          bottom: '30px',
          left: '50%',
          transform: 'translateX(-50%)',
          display: 'flex',
          gap: '10px',
          zIndex: 10
        }}>
          {SLIDES.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              style={{
                width: '12px',
                height: '12px',
                borderRadius: '50%',
                border: '2px solid white',
                background: slideIndex === index ? 'white' : 'transparent',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                padding: 0
              }}
            />
          ))}
        </div>
      </section>

      {/* ===== HÉROS ===== */}
      <section
        className="trame-points"
        style={{
          padding: '60px 0 48px',
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
              LE CENTRE
            </span>
            <h1 style={{
              color: 'var(--blue-deep)',
              fontSize: 'clamp(28px, 3.5vw, 42px)',
              fontWeight: 800,
              lineHeight: 1.15,
              marginBottom: '12px'
            }}>
              {t('pages.apropos.titre')}
            </h1>
            <p style={{
              fontSize: '17px',
              color: 'var(--text-main)',
              lineHeight: 1.7
            }}>
              L'ICERD — International Centre of Environmental Studies and Research for Development —
              est une société à responsabilité limitée de droit camerounais, spécialisée dans
              l'agriculture, l'environnement, les mines et l'étude des terrains pour la construction
              d'ouvrages et d'infrastructures d'envergure.
            </p>
          </div>
        </div>
      </section>

      {/* ===== CHIFFRES CLÉS ===== */}
      <section style={{
        padding: '40px 0',
        borderBottom: '1px solid var(--border-color)',
        background: 'white'
      }}>
        <div className="conteneur">
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '24px'
          }}>
            {CHIFFRES.map((item, index) => (
              <div
                key={index}
                style={{
                  textAlign: 'center',
                  padding: '24px 20px',
                  background: 'var(--bg-light)',
                  borderRadius: '16px',
                  border: '1px solid var(--border-color)',
                  transition: 'all 0.3s ease',
                  cursor: 'default',
                  position: 'relative',
                  overflow: 'hidden'
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.transform = 'translateY(-4px)';
                  e.currentTarget.style.boxShadow = `0 8px 32px ${item.couleur}20`;
                  e.currentTarget.style.borderColor = item.couleur;
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = 'none';
                  e.currentTarget.style.borderColor = 'var(--border-color)';
                }}
              >
                <div style={{
                  position: 'absolute',
                  top: '-20px',
                  right: '-20px',
                  width: '60px',
                  height: '60px',
                  borderRadius: '50%',
                  background: `${item.couleur}10`,
                  pointerEvents: 'none'
                }}></div>
                <div style={{ marginBottom: '6px' }}>
                  <Icon name={item.icon} size={32} color={item.couleur} />
                </div>
                <div style={{
                  fontSize: 'clamp(28px, 3vw, 36px)',
                  fontWeight: 800,
                  color: item.couleur,
                  fontFamily: 'var(--display)',
                  lineHeight: 1.2
                }}>
                  {item.valeur}
                </div>
                <div style={{
                  fontSize: '14px',
                  color: 'var(--text-muted)',
                  fontWeight: 500,
                  marginTop: '4px'
                }}>
                  {item.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== MISSIONS AVEC IMAGES ET ICÔNES SVG ===== */}
      <section style={{ padding: '60px 0 80px' }}>
        <div className="conteneur">
          <div style={{ textAlign: 'center', marginBottom: '48px' }}>
            <span style={{
              fontFamily: 'var(--mono)',
              fontSize: '12px',
              color: 'var(--orange-brand)',
              fontWeight: '600',
              letterSpacing: '1px'
            }}>
              NOS MISSIONS
            </span>
            <h2 style={{
              color: 'var(--blue-deep)',
              fontSize: 'clamp(28px, 3.2vw, 40px)',
              marginTop: '4px',
              fontWeight: 800
            }}>
              I·C·E·R·D — Cinq missions complémentaires
            </h2>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
            gap: '30px'
          }}>
            {MISSIONS.map((m, index) => (
              <article
                key={m.lettre}
                onMouseEnter={() => setActiveMission(index)}
                onMouseLeave={() => setActiveMission(null)}
                style={{
                  background: 'white',
                  borderRadius: '16px',
                  border: activeMission === index ? `2px solid ${m.couleur}` : '1px solid var(--border-color)',
                  padding: '0',
                  transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                  boxShadow: activeMission === index
                    ? `0 12px 40px ${m.couleur}25`
                    : 'var(--shadow-sm)',
                  transform: activeMission === index ? 'translateY(-6px)' : 'none',
                  overflow: 'hidden',
                  position: 'relative'
                }}
              >
                <div style={{
                  height: '180px',
                  background: `url(${m.image}) center/cover no-repeat`,
                  position: 'relative'
                }}>
                  <div style={{
                    position: 'absolute',
                    inset: 0,
                    background: `linear-gradient(135deg, ${m.couleur}80, ${m.couleur}30)`
                  }}></div>
                  <div style={{
                    position: 'absolute',
                    bottom: '16px',
                    left: '20px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px'
                  }}>
                    <span style={{
                      fontSize: '28px',
                      fontWeight: 900,
                      color: 'white',
                      fontFamily: 'var(--display)',
                      textShadow: '0 2px 10px rgba(0,0,0,0.3)'
                    }}>
                      {m.lettre}
                    </span>
                    <Icon name={m.icon} size={28} color="white" />
                    <span style={{
                      fontSize: '18px',
                      fontWeight: 700,
                      color: 'white',
                      textShadow: '0 2px 10px rgba(0,0,0,0.3)'
                    }}>
                      {m.titre}
                    </span>
                  </div>
                </div>

                <div style={{ padding: '20px 24px 24px' }}>
                  <p style={{
                    fontSize: '14.5px',
                    color: 'var(--text-main)',
                    lineHeight: 1.7,
                    margin: 0
                  }}>
                    {m.description}
                  </p>
                  <div style={{
                    marginTop: '14px',
                    height: '3px',
                    background: `linear-gradient(90deg, ${m.couleur}, transparent)`,
                    borderRadius: '2px'
                  }}></div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* ===== VISION ===== */}
      <section style={{
        padding: '60px 0',
        background: 'var(--bg-light)',
        borderTop: '1px solid var(--border-color)',
        borderBottom: '1px solid var(--border-color)',
        position: 'relative',
        overflow: 'hidden'
      }}>
        <div style={{
          position: 'absolute',
          right: '-10%',
          top: '-30%',
          width: '400px',
          height: '400px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(29,78,216,0.04) 0%, transparent 70%)',
          pointerEvents: 'none'
        }}></div>

        <div className="conteneur" style={{ position: 'relative', zIndex: 1 }}>
          <div style={{
            maxWidth: '800px',
            margin: '0 auto',
            textAlign: 'center'
          }}>
            <span style={{
              fontFamily: 'var(--mono)',
              fontSize: '12px',
              color: 'var(--blue-brand)',
              fontWeight: '600',
              letterSpacing: '1px',
              display: 'inline-block',
              padding: '4px 16px',
              background: 'var(--blue-brand-light)',
              borderRadius: '999px',
              marginBottom: '12px'
            }}>
              VISION 2035
            </span>
            <h2 style={{
              color: 'var(--blue-deep)',
              fontSize: 'clamp(28px, 3.2vw, 40px)',
              marginTop: '4px',
              marginBottom: '16px',
              fontWeight: 800
            }}>
              Accompagner la Vision Cameroun 2035
            </h2>
            <div style={{
              width: '60px',
              height: '3px',
              background: 'linear-gradient(90deg, var(--blue-brand), var(--orange-brand))',
              margin: '0 auto 20px',
              borderRadius: '2px'
            }}></div>
            <p style={{
              fontSize: '16px',
              color: 'var(--text-main)',
              lineHeight: 1.9
            }}>
              L'ICERD accompagne la vision stratégique du Cameroun à l'horizon 2035 : transformer
              l'outil de production actuel, structuré en exploitations familiales, en une
              agriculture moderne de grande productivité — de grandes plantations issues de la
              fédération des champs paysans, regroupés en organisations ou coopératives pour
              alimenter les usines de transformation.
            </p>
            <p style={{
              fontSize: '16px',
              color: 'var(--text-muted)',
              lineHeight: 1.9,
              marginTop: '16px'
            }}>
              Depuis 2021, le Centre travaille avec le Ministère de l'Agriculture et du
              Développement Rural (MINADER) sur l'intensification de l'agriculture et la
              modernisation des exploitations paysannes.
            </p>
          </div>
        </div>
      </section>

      {/* ===== CTA ===== */}
      <section style={{ padding: '48px 0' }}>
        <div className="conteneur">
          <div style={{
            textAlign: 'center',
            maxWidth: '640px',
            margin: '0 auto'
          }}>
            <div style={{ marginBottom: '12px' }}>
              <Icon name="handshake" size={48} color="var(--blue-brand)" />
            </div>
            <h3 style={{ fontSize: '22px', fontWeight: 700, color: 'var(--blue-deep)', marginBottom: '8px' }}>
              Vous souhaitez collaborer avec nous ?
            </h3>
            <p style={{ color: 'var(--text-muted)', marginBottom: '20px', fontSize: '15px', lineHeight: 1.7 }}>
              Que ce soit pour une étude, une analyse ou un partenariat de recherche,
              notre équipe est à votre disposition.
            </p>
            <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' }}>
              <Link to="/contact" className="btn-lab btn-lab--primary" style={{ padding: '14px 32px' }}>
                📄 Nous contacter
              </Link>
              <Link to="/laboratoires" className="btn-lab btn-lab--outline" style={{ padding: '14px 32px' }}>
                🔬 Nos laboratoires
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}