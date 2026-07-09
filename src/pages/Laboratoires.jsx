// frontend/src/pages/Laboratoires.jsx
import { useState, useEffect } from 'react';
import { useT } from '../i18n/index.jsx';
import { Link } from 'react-router-dom';

// ============================================================
// ICÔNES SVG PROFESSIONNELLES
// ============================================================
const Icon = ({ name, size = 24, color = '#1d4ed8', className = '' }) => {
  const icons = {
    'flask': (
      <path d="M19 3h-4.18C14.4 1.84 13.3 1 12 1c-1.3 0-2.4.84-2.82 2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-7 0c.55 0 1 .45 1 1s-.45 1-1 1-1-.45-1-1 .45-1 1-1zm4 12h-2v2h2v2h-2v2h-2v-2h2v-2h-2v-2h2V9h2v6z"/>
    ),
    'geo': (
      <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
    ),
    'map': (
      <path d="M20.5 3l-.16.03L15 5.1 9 3 3.36 4.9c-.21.07-.36.25-.36.48V20.5c0 .28.22.5.5.5l.16-.03L9 18.9l6 2.1 5.64-1.9c.21-.07.36-.25.36-.48V3.5c0-.28-.22-.5-.5-.5zM15 19l-6-2.11V5l6 2.11V19z"/>
    ),
    'microscope': (
      <path d="M12 2c-4.41 0-8 3.59-8 8 0 1.55.47 2.98 1.28 4.19l-3.22 3.22c-.39.39-.39 1.02 0 1.41l2.12 2.12c.39.39 1.02.39 1.41 0l3.22-3.22C9.02 17.53 10.45 18 12 18c4.41 0 8-3.59 8-8s-3.59-8-8-8zm0 14c-3.31 0-6-2.69-6-6s2.69-6 6-6 6 2.69 6 6-2.69 6-6 6zm0-10c-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4-1.79-4-4-4z"/>
    ),
    'check': (
      <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z"/>
    ),
    'award': (
      <path d="M19 5h-2V3H7v2H5c-1.1 0-2 .9-2 2v1c0 2.55 1.92 4.63 4.39 4.94.63 1.5 1.98 2.63 3.61 2.96V19H7v2h10v-2h-4v-3.1c1.63-.33 2.98-1.46 3.61-2.96C19.08 12.63 21 10.55 21 8V7c0-1.1-.9-2-2-2zM5 8V7h2v3.82C5.84 10.4 5 9.3 5 8zm14 0c0 1.3-.84 2.4-2 2.82V7h2v1z"/>
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
      {icons[name] || icons['flask']}
    </svg>
  );
};

const LABOS = [
  {
    code: 'ICEPC-LAB',
    nom: "Laboratoire d'analyses physicochimiques",
    icon: 'flask',
    couleur: '#1d4ed8',
    bgGradient: 'linear-gradient(135deg, #1d4ed8, #0f2d80)',
    image: 'https://images.unsplash.com/photo-1581093588401-fbb62a02f120?w=800&h=500&fit=crop',
    texte: "Analyses physicochimiques et physiques des roches, sols, eaux, engrais et pesticides, avec une technologie de pointe répondant aux exigences internationales définies par la norme ISO 17025.",
    prestations: [
      "Examen des sols in situ (prospection pédologique avec prélèvement)",
      "Analyses agrochimiques : évaluation de l'aptitude agricole des terres, doses de fertilisants, estimation des rendements",
      "Analyses physiques : aptitude à la mécanisation, susceptibilité à l'érosion, réserve d'eau du sol"
    ],
    appareils: "AAS · GFAAS · ICP-OES · GC · HPLC · FIMS (mercure) · TOC · Spectrométrie de masse · Photométrie de flamme · Titrimétrie automatique",
    accreditations: ['ISO 17025', 'COFRAC'],
    stats: '1500+ analyses/an'
  },
  {
    code: 'ICGTEC-LAB',
    nom: "Laboratoire d'analyses géotechniques",
    icon: 'geo',
    couleur: '#0891b2',
    bgGradient: 'linear-gradient(135deg, #0891b2, #0e7490)',
    image: 'https://res.cloudinary.com/y4wao1xm/image/upload/v1783461255/pexels-pixabay-248152_tg1a6m.jpg',
    texte: "Détermine les caractéristiques mécaniques des sols en vue de prescrire la meilleure formulation pour les fondations et les constructions. Capable de réaliser de nombreux types d'essais, y compris les essais spéciaux.",
    prestations: [
      "Teneur en eau (ASTM D2216), poids spécifique (ASTM D854)",
      "Limites d'Atterberg, Proctor, CBR",
      "Essais pénétrométriques in situ, stabilité structurale des sols"
    ],
    appareils: "Pénétromètre dynamique · Presses d'essais · Tamiseurs · Étuves normalisées",
    accreditations: ['ISO 17025', 'ASTM'],
    stats: '500+ essais/an'
  },
  {
    code: 'ICEMAP-LAB',
    nom: "Laboratoire de géomatique et cartographie thématique",
    icon: 'map',
    couleur: '#16a34a',
    bgGradient: 'linear-gradient(135deg, #16a34a, #15803d)',
    image: 'https://res.cloudinary.com/y4wao1xm/image/upload/v1783461258/pexels-ishaanaggarwal-8231152_maz98c.jpg',
    texte: "Grâce à des outils de pointe, production de cartes thématiques fiables et stratégiques, indispensables à la planification, à la gestion et à l'aménagement efficace des territoires.",
    prestations: [
      "Cartes géologiques, pédologiques et forestières",
      "Plans d'aménagement parcellaire",
      "Levés GPS et télédétection"
    ],
    appareils: "SIG · GPS différentiel · Imagerie satellitaire",
    accreditations: ['ISO 17025', 'IGN'],
    stats: '200+ cartes produites'
  }
];

const SLIDES = [
  {
    image: 'https://images.unsplash.com/photo-1581093588401-fbb62a02f120?w=1200&h=500&fit=crop',
    titre: 'Analyse physicochimique de précision',
    description: 'Technologies de pointe pour des résultats fiables'
  },
  {
    image: 'https://res.cloudinary.com/y4wao1xm/image/upload/v1783438638/view-heavy-machinery-used-construction-industry_n11bly.jpg',
    titre: 'Géotechnique et mécanique des sols',
    description: 'Études approfondies pour la construction durable'
  },
  {
    image: 'https://res.cloudinary.com/y4wao1xm/image/upload/v1783461279/pexels-ian-panelo-4715450_oqpras.jpg',
    titre: 'Cartographie et géomatique',
    description: 'Visualisation et analyse des territoires'
  }
];

export default function Laboratoires() {
  const { t } = useT();
  const [slideIndex, setSlideIndex] = useState(0);
  const [activeTab, setActiveTab] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setSlideIndex((prev) => (prev + 1) % SLIDES.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const goToSlide = (index) => setSlideIndex(index);

  return (
    <main style={{ background: 'var(--bg-pure)' }}>
      
      {/* ===== CARROUSEL ===== */}
      <section style={{
        position: 'relative',
        height: '450px',
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
              background: 'linear-gradient(to right, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0.2) 100%)'
            }}></div>
            <div style={{
              position: 'absolute',
              bottom: '60px',
              left: '50%',
              transform: 'translateX(-50%)',
              textAlign: 'center',
              color: 'white',
              maxWidth: '700px',
              padding: '0 20px'
            }}>
              <h2 style={{
                fontSize: 'clamp(28px, 3.5vw, 40px)',
                fontWeight: 800,
                marginBottom: '8px',
                textShadow: '0 2px 20px rgba(0,0,0,0.3)'
              }}>
                {slide.titre}
              </h2>
              <p style={{
                fontSize: '17px',
                opacity: 0.9,
                textShadow: '0 2px 10px rgba(0,0,0,0.3)'
              }}>
                {slide.description}
              </p>
            </div>
          </div>
        ))}

        <div style={{
          position: 'absolute',
          bottom: '20px',
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
              className="carousel-dot"
              style={{
                width: '10px',
                height: '10px',
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
          padding: '50px 0 40px',
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
              marginBottom: '6px'
            }}>
              NOS LABORATOIRES
            </span>
            <h1 style={{
              color: 'var(--blue-deep)',
              fontSize: 'clamp(28px, 3.5vw, 42px)',
              fontWeight: 800,
              lineHeight: 1.15,
              marginBottom: '10px'
            }}>
              {t('pages.laboratoires.titre')}
            </h1>
            <p style={{
              fontSize: '17px',
              color: 'var(--text-main)',
              lineHeight: 1.7
            }}>
              Équipements scientifiques modernes, expertise technique remarquable —
              pour l'exactitude et la finesse des résultats.
            </p>
          </div>
        </div>
      </section>

      {/* ===== STATISTIQUES RAPIDES ===== */}
      <section style={{
        padding: '30px 0',
        background: 'white',
        borderBottom: '1px solid var(--border-color)'
      }}>
        <div className="conteneur">
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
            gap: '16px'
          }}>
            {LABOS.map((lab, index) => (
              <div key={index} className="stat-box" style={{
                textAlign: 'center',
                padding: '12px',
                borderRadius: '10px',
                borderLeft: `3px solid ${lab.couleur}`,
                background: 'var(--bg-light)'
              }}>
                <Icon name="lab" size={20} color={lab.couleur} />
                <div style={{ fontSize: '18px', fontWeight: 700, color: lab.couleur, marginTop: '4px' }}>
                  {lab.stats}
                </div>
                <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
                  {lab.code}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== LABOS ===== */}
      <section style={{ padding: '48px 0 60px' }}>
        <div className="conteneur">
          {/* Tabs */}
          <div style={{
            display: 'flex',
            justifyContent: 'center',
            gap: '8px',
            marginBottom: '40px',
            flexWrap: 'wrap'
          }}>
            {LABOS.map((lab, index) => (
              <button
                key={index}
                onClick={() => setActiveTab(index)}
                className={`onglet-trigger ${activeTab === index ? 'is-active' : ''}`}
                style={{
                  padding: '10px 24px',
                  borderRadius: '999px',
                  border: activeTab === index ? `2px solid ${lab.couleur}` : '1.5px solid var(--border-color)',
                  background: activeTab === index ? `${lab.couleur}10` : 'white',
                  color: activeTab === index ? lab.couleur : 'var(--text-muted)',
                  fontWeight: activeTab === index ? 600 : 500,
                  fontSize: '14px',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  fontFamily: 'var(--texte)'
                }}
              >
                <Icon name={lab.icon} size={18} color={activeTab === index ? lab.couleur : 'var(--text-muted)'} />
                <span style={{ marginLeft: '8px' }}>{lab.code}</span>
              </button>
            ))}
          </div>

          {/* Contenu actif */}
          {LABOS.map((lab, index) => (
            <div
              key={index}
              style={{
                display: activeTab === index ? 'block' : 'none',
                animation: 'fadeIn 0.5s ease'
              }}
            >
              <article
                className="lab-main-card"
                style={{
                  background: 'white',
                  borderRadius: '20px',
                  border: '1px solid var(--border-color)',
                  overflow: 'hidden',
                  boxShadow: '0 4px 20px rgba(0,0,0,0.04)'
                }}
              >
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))',
                  gap: '0'
                }}>
                  {/* Image */}
                  <div style={{
                    height: '400px',
                    background: `url(${lab.image}) center/cover no-repeat`,
                    position: 'relative'
                  }}>
                    <div style={{
                      position: 'absolute',
                      inset: 0,
                      background: `linear-gradient(135deg, ${lab.couleur}60, ${lab.couleur}20)`
                    }}></div>
                    <div style={{
                      position: 'absolute',
                      bottom: '30px',
                      left: '30px',
                      color: 'white',
                      textShadow: '0 2px 10px rgba(0,0,0,0.3)'
                    }}>
                      <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px'
                      }}>
                        <Icon name={lab.icon} size={24} color="white" />
                        <span style={{ fontSize: '14px', fontFamily: 'var(--mono)', opacity: 0.8 }}>
                          {lab.code}
                        </span>
                      </div>
                      <div style={{ fontSize: '20px', fontWeight: 700 }}>
                        {lab.nom}
                      </div>
                    </div>
                  </div>

                  {/* Contenu */}
                  <div style={{ padding: '32px 36px' }}>
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '12px',
                      marginBottom: '16px'
                    }}>
                      <div style={{
                        width: '44px',
                        height: '44px',
                        borderRadius: '12px',
                        background: `${lab.couleur}12`,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}>
                        <Icon name={lab.icon} size={24} color={lab.couleur} />
                      </div>
                      <span style={{
                        fontFamily: 'var(--mono)',
                        fontSize: '13px',
                        color: lab.couleur,
                        fontWeight: 600
                      }}>
                        {lab.code}
                      </span>
                    </div>

                    <p style={{
                      fontSize: '15px',
                      color: 'var(--text-main)',
                      lineHeight: 1.8,
                      marginBottom: '20px'
                    }}>
                      {lab.texte}
                    </p>

                    <div style={{ marginBottom: '16px' }}>
                      <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        marginBottom: '8px'
                      }}>
                        <Icon name="check" size={16} color={lab.couleur} />
                        <span style={{
                          fontSize: '11px',
                          fontWeight: 600,
                          color: 'var(--text-muted)',
                          textTransform: 'uppercase',
                          letterSpacing: '0.5px'
                        }}>
                          Prestations
                        </span>
                      </div>
                      <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                        {lab.prestations.map((p, i) => (
                          <li
                            key={i}
                            className="prestation-item"
                            style={{
                              padding: '4px 0 4px 24px',
                              position: 'relative',
                              fontSize: '14px',
                              color: 'var(--text-main)',
                              borderBottom: i < lab.prestations.length - 1 ? '1px solid var(--border-color)' : 'none'
                            }}
                          >
                            <span style={{
                              position: 'absolute',
                              left: 0,
                              top: '6px',
                              color: lab.couleur,
                              fontSize: '14px'
                            }}>
                              ✓
                            </span>
                            {p}
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div style={{
                      background: 'var(--bg-light)',
                      borderRadius: '10px',
                      padding: '14px 18px',
                      marginBottom: '16px'
                    }}>
                      <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        marginBottom: '4px'
                      }}>
                        <Icon name="microscope" size={16} color={lab.couleur} />
                        <span style={{
                          fontSize: '10px',
                          fontWeight: 600,
                          color: 'var(--text-muted)',
                          textTransform: 'uppercase',
                          letterSpacing: '0.5px'
                        }}>
                          Appareillage
                        </span>
                      </div>
                      <p style={{
                        fontFamily: 'var(--mono)',
                        fontSize: '12px',
                        color: 'var(--text-muted)',
                        lineHeight: 1.6,
                        margin: 0
                      }}>
                        {lab.appareils}
                      </p>
                    </div>

                    <div style={{
                      display: 'flex',
                      gap: '8px',
                      flexWrap: 'wrap'
                    }}>
                      {lab.accreditations.map(acc => (
                        <span
                          key={acc}
                          className="badge-award"
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '4px',
                            padding: '3px 14px',
                            borderRadius: '999px',
                            fontSize: '10px',
                            fontWeight: 600,
                            background: `${lab.couleur}10`,
                            color: lab.couleur,
                            border: `1px solid ${lab.couleur}20`,
                            letterSpacing: '0.3px'
                          }}
                        >
                          <Icon name="award" size={12} color={lab.couleur} />
                          {acc}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </article>
            </div>
          ))}
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
            <Icon name="lab" size={40} color="var(--blue-brand)" />
            <h3 style={{ fontSize: '20px', fontWeight: 700, color: 'var(--blue-deep)', marginTop: '8px', marginBottom: '8px' }}>
              Besoin d'une analyse spécifique ?
            </h3>
            <p style={{ color: 'var(--text-muted)', marginBottom: '16px', fontSize: '15px' }}>
              Nos laboratoires sont à votre disposition pour tous vos projets.
              Contactez-nous pour un devis personnalisé.
            </p>
            <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' }}>
              <Link to="/analyses" className="btn-lab btn-lab--primary" style={{ padding: '12px 28px' }}>
                📋 Voir le catalogue
              </Link>
              <Link to="/contact" className="btn-lab btn-lab--outline" style={{ padding: '12px 28px' }}>
                📄 Demander un devis
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Améliorations Graphiques Avancées, Contours, Onglets & Transitions Micro-interactives */}
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(8px); }
          to { opacity: 1; transform: translateY(0); }
        }

        /* --- Animation et style des Onglets (Tabs) --- */
        .onglet-trigger {
          outline: none;
          box-shadow: 0 1px 2px rgba(0, 0, 0, 0.02);
          transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1) !important;
        }

        .onglet-trigger:hover {
          transform: translateY(-2px);
          box-shadow: 0 6px 12px rgba(0, 0, 0, 0.04);
          filter: brightness(0.98);
        }

        .onglet-trigger.is-active {
          transform: translateY(-2px);
          box-shadow: 0 8px 16px rgba(0, 0, 0, 0.06);
        }

        /* --- Design Épuré de la Carte Principale --- */
        .lab-main-card {
          border: 1px solid rgba(0, 0, 0, 0.06) !important;
          border-radius: 16px !important; /* Adoucissement des angles */
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.03) !important;
          transition: box-shadow 0.3s ease;
        }
        
        .lab-main-card:hover {
          box-shadow: 0 15px 40px rgba(0, 0, 0, 0.05) !important;
        }

        /* --- Éléments du Carrousel (Dots) --- */
        .carousel-dot {
          outline: none;
          transition: all 0.2s ease !important;
        }
        .carousel-dot:hover {
          transform: scale(1.2);
        }

        /* --- Blocs Internes de Données --- */
        .stat-box {
          border: 1px solid rgba(0, 0, 0, 0.04) !important;
          border-left-width: 3.5px !important;
          box-shadow: 0 1px 2px rgba(0, 0, 0, 0.01);
          transition: transform 0.2s ease, box-shadow 0.2s ease;
        }
        .stat-box:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.03);
        }

        .prestation-item {
          transition: padding-left 0.2s ease;
        }
        .prestation-item:hover {
          padding-left: 28px !important;
        }

        .badge-award {
          transition: all 0.2s ease;
        }
        .badge-award:hover {
          transform: scale(1.03);
        }

        .btn-lab {
          border-radius: 10px !important;
          transition: all 0.25s ease !important;
        }
        .btn-lab:hover {
          transform: translateY(-2px);
          box-shadow: 0 6px 15px rgba(0, 0, 0, 0.08);
        }
      `}</style>
    </main>
  );
}