// frontend/src/pages/Contact.jsx
import { useState } from 'react';
import { useT } from '../i18n/index.jsx';

// ============================================================
// COMPOSANT ICÔNES RÉSEAUX SOCIAUX & INTERFACE
// ============================================================
const ContactIcon = ({ name, size = 18, color = 'currentColor', className = '' }) => {
  const icons = {
    'youtube': (
      <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
    ),
    'linkedin': (
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0z"/>
    ),
    'facebook': (
      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
    )
  };

  return (
    <svg 
      width={size} 
      height={size} 
      viewBox="0 0 24 24" 
      fill={color} 
      className={className}
      style={{ flexShrink: 0 }}
    >
      {icons[name] || null}
    </svg>
  );
};

export default function Contact() {
  const { t } = useT();
  const [envoye, setEnvoye] = useState(false);
  const [form, setForm] = useState({
    nom: '',
    email: '',
    telephone: '',
    objet: 'Analyse de sol',
    message: ''
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const corps = encodeURIComponent(
      `${t('contact.nom')} : ${form.nom}\n${t('contact.email')} : ${form.email}\n${t('contact.telephone')} : ${form.telephone}\n${t('contact.sujet')} : ${form.objet}\n\n${form.message}`
    );
    window.location.href = `mailto:icerdcameroon@gmail.com?subject=${encodeURIComponent(t('contact.objetEmail') + ' — ' + form.objet)}&body=${corps}`;
    setEnvoye(true);
  };

  const objets = [
    t('contact.objets.sol'),
    t('contact.objets.eau'),
    t('contact.objets.plante'),
    t('contact.objets.geotechnique'),
    t('contact.objets.cartographie'),
    t('contact.objets.terres'),
    t('contact.objets.environnement'),
    t('contact.objets.autre')
  ];

  return (
    <main style={{ background: 'var(--bg-pure)' }}>
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
          <div style={{ textAlign: 'center', maxWidth: '640px', margin: '0 auto' }}>
            <span style={{
              fontFamily: 'var(--mono)',
              fontSize: '12px',
              color: 'var(--blue-brand)',
              fontWeight: '600',
              letterSpacing: '1px',
              display: 'block',
              marginBottom: '8px'
            }}>
              {t('contact.surtitre')}
            </span>
            <h1 style={{
              color: 'var(--blue-deep)',
              fontSize: 'clamp(28px, 3.5vw, 42px)',
              fontWeight: 800,
              lineHeight: 1.15,
              marginBottom: '12px'
            }}>
              {t('contact.titre')}
            </h1>
            <p style={{
              fontSize: '17px',
              color: 'var(--text-main)',
              lineHeight: 1.7
            }}>
              {t('contact.intro')}
            </p>
          </div>
        </div>
      </section>

      {/* ===== FORMULAIRE ===== */}
      <section style={{ padding: '40px 0 60px' }}>
        <div className="conteneur">
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))',
            gap: '40px',
            alignItems: 'start'
          }}>
            {/* Coordonnées */}
            <div style={{
              background: 'var(--bg-light)',
              borderRadius: '16px',
              padding: '32px',
              border: '1px solid var(--border-color)'
            }}>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                marginBottom: '20px'
              }}>
                <div style={{
                  width: '48px',
                  height: '48px',
                  background: 'var(--blue-brand)',
                  borderRadius: '12px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '20px',
                  color: 'white'
                }}>
                  📍
                </div>
                <div>
                  <h3 style={{ fontSize: '20px', fontWeight: 700, color: 'var(--blue-deep)' }}>
                    {t('contact.coordonnees')}
                  </h3>
                </div>
              </div>

              <div style={{ marginBottom: '16px' }}>
                <div style={{ fontWeight: 600, color: 'var(--blue-deep)', marginBottom: '4px' }}>
                  {t('contact.adresse')}
                </div>
                <p style={{ color: 'var(--text-main)' }}>
                  1, Rue 8417, Messamendongo, Yaoundé 4
                  <br />
                  {t('contact.adresseDetail')}
                </p>
              </div>

              <div style={{ marginBottom: '16px' }}>
                <div style={{ fontWeight: 600, color: 'var(--blue-deep)', marginBottom: '4px' }}>
                  {t('contact.telephoneLabel')}
                </div>
                <p style={{ color: 'var(--text-main)' }}>
                  <a href="tel:+237689035188" style={{ color: 'var(--blue-brand)' }}>+237 689 03 51 88</a>
                  <br />
                  <a href="tel:+237671879494" style={{ color: 'var(--blue-brand)' }}>+237 671 87 94 94</a>
                </p>
              </div>

              <div style={{ marginBottom: '24px' }}>
                <div style={{ fontWeight: 600, color: 'var(--blue-deep)', marginBottom: '4px' }}>
                  {t('contact.emailLabel')}
                </div>
                <p>
                  <a href="mailto:icerdcameroon@gmail.com" style={{ color: 'var(--blue-brand)' }}>
                    icerdcameroon@gmail.com
                  </a>
                </p>
              </div>

              {/* ===== BLOC RÉSEAUX SOCIAUX ===== */}
              <div style={{
                marginBottom: '24px',
                padding: '16px 0',
                borderTop: '1px solid var(--border-color)',
                borderBottom: '1px solid var(--border-color)'
              }}>
                <div style={{ fontWeight: 600, color: 'var(--blue-deep)', marginBottom: '12px', fontSize: '14px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                  {t('contact.reseaux')}
                </div>
                <div style={{ display: 'flex', gap: '10px' }}>
                  <a 
                    href="https://www.linkedin.com" 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="social-btn platform--linkedin"
                    title="LinkedIn"
                  >
                    <ContactIcon name="linkedin" size={18} />
                    <span style={{ fontSize: '13px', fontWeight: 500 }}>LinkedIn</span>
                  </a>
                  <a 
                    href="https://www.youtube.com" 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="social-btn platform--youtube"
                    title="YouTube"
                  >
                    <ContactIcon name="youtube" size={18} />
                    <span style={{ fontSize: '13px', fontWeight: 500 }}>YouTube</span>
                  </a>
                  <a 
                    href="https://www.facebook.com" 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="social-btn platform--facebook"
                    title="Facebook"
                  >
                    <ContactIcon name="facebook" size={18} />
                    <span style={{ fontSize: '13px', fontWeight: 500 }}>Facebook</span>
                  </a>
                </div>
              </div>

              <div style={{
                marginTop: '20px'
              }}>
                <div style={{
                  fontFamily: 'var(--mono)',
                  fontSize: '13px',
                  color: 'var(--blue-deep)',
                  fontWeight: 500
                }}>
                  🌍 {t('contact.interventions')}
                </div>
              </div>

              <div style={{
                marginTop: '16px',
                display: 'flex',
                gap: '12px',
                flexWrap: 'wrap'
              }}>
                <span style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  fontSize: '12px',
                  color: 'var(--text-muted)',
                  background: 'white',
                  padding: '4px 12px',
                  borderRadius: '999px',
                  border: '1px solid var(--border-color)'
                }}>
                  🕐 {t('contact.horairesValeur')}
                </span>
                <span style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  fontSize: '12px',
                  color: 'var(--text-muted)',
                  background: 'white',
                  padding: '4px 12px',
                  borderRadius: '999px',
                  border: '1px solid var(--border-color)'
                }}>
                  ✅ ISO 17025
                </span>
              </div>
            </div>

            {/* Formulaire */}
            <div style={{
              background: 'white',
              borderRadius: '16px',
              padding: '32px',
              border: '1px solid var(--border-color)',
              boxShadow: 'var(--shadow-sm)'
            }}>
              {envoye ? (
                <div style={{
                  textAlign: 'center',
                  padding: '30px 20px'
                }}>
                  <div style={{ fontSize: '48px', marginBottom: '12px' }}>📧</div>
                  <h3 style={{ fontSize: '20px', fontWeight: 700, color: 'var(--blue-deep)', marginBottom: '8px' }}>
                    {t('contact.pret')}
                  </h3>
                  <p style={{ color: 'var(--text-muted)', marginBottom: '16px' }}>
                    {t('contact.pretTexte')}
                  </p>
                  <button
                    className="btn-lab btn-lab--primary"
                    onClick={() => { setEnvoye(false); setForm({ nom: '', email: '', telephone: '', objet: t('contact.objets.sol'), message: '' }); }}
                  >
                    ✏️ {t('contact.nouvelleDemande')}
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit}>
                  <h3 style={{
                    fontSize: '20px',
                    fontWeight: 700,
                    color: 'var(--blue-deep)',
                    marginBottom: '20px'
                  }}>
                    {t('contact.demandeDevis')}
                  </h3>

                  <div className="champ-lab">
                    <label>{t('contact.nom')} *</label>
                    <input
                      type="text"
                      name="nom"
                      value={form.nom}
                      onChange={handleChange}
                      required
                      placeholder={t('contact.nomPlaceholder')}
                    />
                  </div>

                  <div className="grid-responsive-inputs" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                    <div className="champ-lab">
                      <label>{t('contact.email')} *</label>
                      <input
                        type="email"
                        name="email"
                        value={form.email}
                        onChange={handleChange}
                        required
                        placeholder="vous@exemple.com"
                      />
                    </div>
                    <div className="champ-lab">
                      <label>{t('contact.telephone')}</label>
                      <input
                        type="tel"
                        name="telephone"
                        value={form.telephone}
                        onChange={handleChange}
                        placeholder="+237 6XX XX XX XX"
                      />
                    </div>
                  </div>

                  <div className="champ-lab">
                    <label>{t('contact.sujet')}</label>
                    <select
                      name="objet"
                      value={form.objet}
                      onChange={handleChange}
                    >
                      {objets.map(o => (
                        <option key={o} value={o}>{o}</option>
                      ))}
                    </select>
                  </div>

                  <div className="champ-lab">
                    <label>{t('contact.message')} *</label>
                    <textarea
                      name="message"
                      value={form.message}
                      onChange={handleChange}
                      required
                      rows="5"
                      placeholder={t('contact.messagePlaceholder')}
                    />
                  </div>

                  <div style={{
                    display: 'flex',
                    gap: '12px',
                    flexWrap: 'wrap',
                    marginTop: '4px'
                  }}>
                    <button type="submit" className="btn-lab btn-lab--primary">
                      📧 {t('contact.envoyer')}
                    </button>
                    <button
                      type="button"
                      className="btn-lab btn-lab--ghost"
                      onClick={() => {
                        setForm({ nom: '', email: '', telephone: '', objet: t('contact.objets.sol'), message: '' });
                      }}
                    >
                      🗑️ {t('commun.effacer')}
                    </button>
                  </div>

                  <p style={{
                    marginTop: '12px',
                    fontSize: '12px',
                    color: 'var(--text-muted)'
                  }}>
                    {t('contact.infoEmail')}
                  </p>
                </form>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Règles d'interactivité et styles des réseaux sociaux */}
      <style>{`
        /* --- Boutons Réseaux Sociaux Réactifs --- */
        .social-btn {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 8px 14px;
          border-radius: 8px;
          text-decoration: none;
          transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
          border: 1px solid var(--border-color);
          background: #ffffff;
          flex: 1;
          justify-content: center;
        }

        /* Couleurs thématiques natives au survol */
        .platform--linkedin { color: #64748b; }
        .platform--linkedin:hover { 
          color: #0077b5; 
          background: #0077b50a; 
          border-color: #0077b540;
          transform: translateY(-2px);
        }

        .platform--youtube { color: #64748b; }
        .platform--youtube:hover { 
          color: #ff0000; 
          background: #ff00000a; 
          border-color: #ff000040;
          transform: translateY(-2px);
        }

        .platform--facebook { color: #64748b; }
        .platform--facebook:hover { 
          color: #1877f2; 
          background: #1877f20a; 
          border-color: #1877f240;
          transform: translateY(-2px);
        }

        /* --- Améliorations de Saisie du Formulaire --- */
        .champ-lab input, 
        .champ-lab select, 
        .champ-lab textarea {
          width: 100%;
          padding: 10px 14px;
          border: 1.5px solid var(--border-color);
          border-radius: 8px;
          outline: none;
          font-size: 14px;
          background: #fff;
          transition: all 0.2s ease;
          box-sizing: border-box;
        }

        .champ-lab label {
          display: block;
          font-size: 13px;
          font-weight: 600;
          color: var(--blue-deep);
          margin-bottom: 6px;
        }

        .champ-lab input:focus, 
        .champ-lab select:focus, 
        .champ-lab textarea:focus {
          border-color: var(--blue-brand) !important;
          box-shadow: 0 0 0 3px rgba(29, 78, 216, 0.08);
        }

        .btn-lab {
          border-radius: 8px !important;
          padding: 10px 20px;
          font-size: 14px;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.2s ease;
          border: none;
        }
        .btn-lab--primary {
          background: var(--blue-brand);
          color: white;
        }
        .btn-lab--primary:hover {
          filter: brightness(0.93);
        }
        .btn-lab--ghost {
          background: transparent;
          color: var(--text-muted);
          border: 1px solid var(--border-color);
        }
        .btn-lab--ghost:hover {
          background: var(--bg-light);
          color: var(--blue-deep);
        }

        @media (max-width: 540px) {
          .grid-responsive-inputs {
            grid-template-columns: 1fr !important;
          }
          .social-btn {
            padding: 8px 10px;
          }
          .social-btn span {
            display: none;
          }
        }
      `}</style>
    </main>
  );
}