// frontend/src/pages/Equipe.jsx
import { useState, useEffect } from 'react';
import { useT } from '../i18n/index.jsx';
import { api } from '../api.js';

const CATEGORIES = ['TOUS', 'Direction', 'Chercheurs', 'Techniciens', 'Administratif', 'Stagiaires'];

const CATEGORY_MAP = {
  'Direction': ['Directeur', 'Directrice', 'DG', 'Directeur Général', 'Directrice Générale'],
  'Chercheurs': ['Chercheur', 'Chercheuse', 'Dr.', 'PhD', 'Professeur', 'Pr.', 'Senior'],
  'Techniciens': ['Technicien', 'Technicienne', 'Assistant', 'Ingénieur', 'Laborantin'],
  'Administratif': ['Administratif', 'Administrative', 'Comptable', 'RH', 'Gestionnaire', 'Secrétaire'],
  'Stagiaires': ['Stagiaire', 'Intern', 'Apprenti']
};

export default function Equipe() {
  const { t, libelleCategorie } = useT();

  const [membres, setMembres] = useState([]);
  const [loading, setLoading] = useState(true);
  const [erreur, setErreur] = useState('');
  const [categorie, setCategorie] = useState('TOUS');

  useEffect(() => {
    api('/equipe')
      .then(data => {
        setMembres(data || []);
        setLoading(false);
      })
      .catch(err => {
        setErreur(err.message);
        setLoading(false);
      });
  }, []);

  // Fonction de filtrage par mots-clés
  const filtrerMembre = (m, cat) => {
    if (cat === 'TOUS') return true;
    const motsCles = CATEGORY_MAP[cat] || [];
    const texte = `${m.poste} ${m.titre} ${m.domaine} ${m.bio || ''}`.toLowerCase();
    return motsCles.some(mot => texte.includes(mot.toLowerCase()));
  };

  const filtres = membres.filter(m => filtrerMembre(m, categorie));

  // Générateur d'initiales pour le fallback des photos
  const getInitials = (prenom, nom) => {
    return `${prenom?.charAt(0) || ''}${nom?.charAt(0) || ''}`.toUpperCase() || '👨‍🔬';
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
        <p style={{ color: '#64748b' }}>{t('cms.chargement.equipe')}</p>
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
              {t('cms.surtitre.equipe')}
            </span>
            <h1 style={{
              color: 'var(--blue-deep)',
              fontSize: 'clamp(28px, 3.5vw, 42px)',
              fontWeight: 800,
              lineHeight: 1.15,
              marginBottom: '12px'
            }}>
              {t('pages.equipe.titre')}
            </h1>
            <p style={{
              fontSize: '17px',
              color: 'var(--text-main)',
              lineHeight: 1.7
            }}>
              {t('cms.intro.equipe')}
            </p>
            <p style={{
              fontSize: '14px',
              color: 'var(--text-muted)',
              marginTop: '8px'
            }}>
              {membres.length} membre{membres.length > 1 ? 's' : ''} de l'équipe
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
            {CATEGORIES.map(c => {
              const count = membres.filter(m => filtrerMembre(m, c)).length;
              return (
                <button
                  key={c}
                  onClick={() => setCategorie(c)}
                  className={`btn-lab ${categorie === c ? 'btn-lab--primary' : 'btn-lab--ghost'}`}
                  style={{ fontSize: '13px', padding: '6px 16px', cursor: 'pointer' }}
                >
                  {libelleCategorie(c)} ({count})
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* GRILLE MEMBRES */}
      <section style={{ padding: '24px 0 60px' }}>
        <div className="conteneur">
          {filtres.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '60px 20px', color: '#94a3b8' }}>
              <div style={{ fontSize: '48px', marginBottom: '12px' }}>👥</div>
              <p>{t('cms.vide.equipe')}</p>
            </div>
          ) : (
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
              gap: '30px'
            }}>
              {filtres.map(m => (
                <div 
                  key={m.id} 
                  className="carte-membre-interactive" 
                  style={{ 
                    textAlign: 'center', 
                    padding: '30px',
                    background: 'white',
                    borderRadius: '12px',
                    border: '1px solid var(--border-color)',
                    boxShadow: 'var(--shadow-sm)'
                  }}
                >
                  {/* Photo / Avatar avec Fallback Texte */}
                  <div className="wrapper-avatar-membre" style={{
                    width: '120px',
                    height: '120px',
                    borderRadius: '50%',
                    background: m.photo_url ? 'var(--bg-light)' : 'linear-gradient(135deg, var(--blue-brand) 0%, var(--blue-deep) 100%)',
                    margin: '0 auto 16px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#ffffff',
                    fontSize: m.photo_url ? '48px' : '28px',
                    fontWeight: '700',
                    fontFamily: 'var(--mono)',
                    letterSpacing: '1px',
                    border: `3px solid ${m.photo_url ? 'var(--blue-brand)' : 'var(--border-color)'}`,
                    overflow: 'hidden'
                  }}>
                    {m.photo_url ? (
                      <img 
                        src={m.photo_url} 
                        alt={`${m.prenom} ${m.nom}`} 
                        className="img-membre"
                        style={{ 
                          width: '100%', 
                          height: '100%', 
                          objectFit: 'cover'
                        }} 
                      />
                    ) : (
                      <span>{getInitials(m.prenom, m.nom)}</span>
                    )}
                  </div>
                  
                  <h3 style={{ 
                    color: 'var(--blue-deep)', 
                    fontSize: '18px', 
                    fontWeight: '700',
                    marginBottom: '4px' 
                  }}>
                    {m.prenom} {m.nom}
                  </h3>
                  
                  <p style={{ 
                    color: 'var(--orange-brand)', 
                    fontWeight: 600, 
                    fontSize: '14px',
                    marginBottom: '2px'
                  }}>
                    {m.poste}
                  </p>
                  
                  <p style={{ 
                    color: 'var(--text-muted)', 
                    fontSize: '13px'
                  }}>
                    {m.domaine || "—"}
                  </p>
                  
                  {/* Contacts */}
                  <div style={{ marginTop: '12px', display: 'flex', flexDirection: 'column', gap: '4px' }}>
                    {m.email && (
                      <p style={{ fontSize: '13px', margin: 0 }}>
                        <a 
                          href={`mailto:${m.email}`} 
                          className="lien-contact-membre"
                          style={{ color: 'var(--blue-brand)', textDecoration: 'none' }}
                        >
                          📧 {m.email}
                        </a>
                      </p>
                    )}
                    
                    {m.telephone && (
                      <p style={{ fontSize: '12px', color: 'var(--text-muted)', margin: 0 }}>
                        u️ {m.telephone}
                      </p>
                    )}
                  </div>
                  
                  {m.bio && (
                    <p style={{ 
                      fontSize: '13px', 
                      color: 'var(--text-main)', 
                      marginTop: '16px', 
                      textAlign: 'left',
                      lineHeight: 1.6,
                      paddingTop: '12px',
                      borderTop: '1px solid var(--border-color)'
                    }}>
                      {m.bio}
                    </p>
                  )}
                  
                  {/* Status Ancien Membre */}
                  {m.actif === false && (
                    <span style={{
                      display: 'inline-block',
                      marginTop: '12px',
                      padding: '2px 12px',
                      borderRadius: '999px',
                      fontSize: '11px',
                      fontWeight: 600,
                      background: '#fef3c7',
                      color: '#d97706'
                    }}>
                      ⏳ Ancien membre
                    </span>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* REJOINDRE L'ÉQUIPE */}
      <section style={{
        padding: '50px 0',
        background: 'var(--bg-light)',
        borderTop: '1px solid var(--border-color)'
      }}>
        <div className="conteneur">
          <div style={{ textAlign: 'center', maxWidth: '640px', margin: '0 auto' }}>
            <div style={{ fontSize: '40px', marginBottom: '8px' }}>🌟</div>
            <h3 style={{ fontSize: '20px', fontWeight: 700, color: 'var(--blue-deep)', marginBottom: '8px' }}>
              {t('cms.rejoindreTitre')}
            </h3>
            <p style={{ fontSize: '15px', color: 'var(--text-muted)', marginBottom: '20px', lineHeight: 1.6 }}>
              {t('cms.rejoindreTexte')}
            </p>
            <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' }}>
              <a href="/carrieres" className="btn-lab btn-lab--primary" style={{ textDecoration: 'none' }}>
                💼 {t('cms.voirOffres')}
              </a>
              <a href="/contact" className="btn-lab btn-lab--outline" style={{ textDecoration: 'none' }}>
                ✉️ Nous contacter
              </a>
            </div>
          </div>
        </div>
      </section>

      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        
        .carte-membre-interactive {
          transition: transform 0.2s ease, box-shadow 0.2s ease !important;
        }
        .carte-membre-interactive:hover {
          transform: translateY(-5px);
          box-shadow: 0 12px 24px rgba(15, 45, 128, 0.08) !important;
        }
        .carte-membre-interactive:hover .wrapper-avatar-membre {
          border-color: var(--orange-brand) !important;
        }
        .carte-membre-interactive:hover .img-membre {
          transform: scale(1.05);
        }
        .img-membre {
          transition: transform 0.2s ease;
        }
        .lien-contact-membre:hover {
          text-decoration: underline !important;
          color: var(--blue-deep) !important;
        }
      `}</style>
    </main>
  );
}