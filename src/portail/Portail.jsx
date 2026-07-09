// frontend/src/portail/Portail.jsx
import { useState, useEffect } from 'react';
import { Routes, Route, NavLink, Link, Navigate, useNavigate } from 'react-router-dom';
import { api, jeton } from '../api.js';

// Pages du portail
import TableauDeBord from './TableauDeBord.jsx';
import Clients from './Clients.jsx';
import Demandes from './Demandes.jsx';
import Echantillons from './Echantillons.jsx';
import Resultats from './Resultats.jsx';
import Stocks from './Stocks.jsx';
import Factures from './Factures.jsx';
import Utilisateurs from './Utilisateurs.jsx';
import Equipements from './Equipements.jsx';
import Exports from './Exports.jsx';

// Gestion de contenu
import GestionPublications from './Publications.jsx';
import GestionProjets from './Projets.jsx';
import GestionEvenements from './Evenements.jsx';
import GestionCarrieres from './Carrieres.jsx';
import GestionPartenaires from './Partenaires.jsx';
import GestionActualites from './Actualites.jsx';
import GestionGalerie from './Galerie.jsx';
import GestionEquipe from './Equipe.jsx';
import GestionFaq from './Faq.jsx';

// Banque de données
import BanqueDonnees from './BanqueDonnees.jsx';

// Espace Client
import { MesDemandes, MesRapports, MesFactures } from './EspaceClient.jsx';

// Composants
import Toast from '../components/Toast.jsx';

function Connexion({ onConnecte }) {
  const [email, setEmail] = useState('');
  const [mdp, setMdp] = useState('');
  const [erreur, setErreur] = useState('');
  const [chargement, setChargement] = useState(false);

  const connecter = async () => {
    setErreur('');
    setChargement(true);
    try {
      const { token, utilisateur } = await api('/auth/connexion', {
        method: 'POST',
        body: JSON.stringify({ email, mot_de_passe: mdp })
      });
      jeton.ecrire(token);
      onConnecte(utilisateur);
    } catch (e) {
      setErreur(e.message);
    } finally {
      setChargement(false);
    }
  };

  return (
    <div style={{
      display: 'grid',
      placeItems: 'center',
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #0f2d80, #1d4ed8)',
      padding: '20px'
    }}>
      <div style={{
        background: 'white',
        borderRadius: '20px',
        padding: '44px',
        maxWidth: '420px',
        width: '100%',
        boxShadow: '0 20px 60px rgba(0,0,0,0.3)'
      }}>
        <div style={{ textAlign: 'center', marginBottom: '28px' }}>
          <img
            src="/logo/logo-icerd-icon.png"
            alt="ICERD"
            width="72"
            height="72"
            style={{
              objectFit: 'contain',
              margin: '0 auto',
              display: 'block',
              borderRadius: '14px'
            }}
            onError={(e) => {
              e.target.style.display = 'none';
              e.target.parentElement.innerHTML = `
                <div style="
                  width: 72px;
                  height: 72px;
                  background: linear-gradient(135deg, #1d4ed8, #0f2d80);
                  border-radius: 14px;
                  margin: 0 auto 14px;
                  display: flex;
                  align-items: center;
                  justify-content: center;
                  font-size: 22px;
                  font-weight: 900;
                  color: white;
                  position: relative;
                ">
                  ICE
                  <span style="
                    position: absolute;
                    top: -3px;
                    right: -3px;
                    background: #ff6b35;
                    width: 18px;
                    height: 18px;
                    border-radius: 50%;
                    border: 2px solid white;
                  "></span>
                </div>
              `;
            }}
          />
          <h2 style={{ fontSize: '22px', fontWeight: 800, color: '#0f2d80', marginTop: '12px' }}>Portail ICERD</h2>
          <p style={{ color: '#64748b', fontSize: '13px' }}>
            Laboratory Information Management System
          </p>
        </div>

        {erreur && (
          <div style={{
            background: '#fee2e2',
            color: '#dc2626',
            padding: '12px 16px',
            borderRadius: '8px',
            marginBottom: '16px',
            fontSize: '14px'
          }}>
            ❌ {erreur}
          </div>
        )}

        <div className="champ-lab">
          <label>Email</label>
          <input
            type="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            placeholder="admin@icerd.cm"
            onKeyDown={e => e.key === 'Enter' && connecter()}
          />
        </div>

        <div className="champ-lab">
          <label>Mot de passe</label>
          <input
            type="password"
            value={mdp}
            onChange={e => setMdp(e.target.value)}
            placeholder="••••••••"
            onKeyDown={e => e.key === 'Enter' && connecter()}
          />
        </div>

        <button
          className="btn-lab btn-lab--primary"
          style={{ width: '100%', padding: '13px', fontSize: '15px', justifyContent: 'center' }}
          onClick={connecter}
          disabled={chargement}
        >
          {chargement ? 'Connexion...' : 'Se connecter'}
        </button>

        <p style={{ marginTop: '18px', fontSize: '13px', color: '#94a3b8', textAlign: 'center' }}>
          <Link to="/" style={{ color: '#1d4ed8', fontWeight: 600 }}>← Retour au site public</Link>
        </p>
      </div>
    </div>
  );
}

export default function Portail() {
  const [utilisateur, setUtilisateur] = useState(null);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const token = jeton.lire();
    if (token) {
      api('/auth/moi')
        .then(u => setUtilisateur(u))
        .catch(() => jeton.effacer())
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, []);

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 4000);
  };

  if (loading) {
    return (
      <div style={{
        display: 'grid',
        placeItems: 'center',
        minHeight: '100vh',
        background: '#f4f7fc'
      }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{
            width: '48px',
            height: '48px',
            border: '4px solid #1d4ed8',
            borderTopColor: 'transparent',
            borderRadius: '50%',
            animation: 'spin 0.8s linear infinite',
            margin: '0 auto 16px'
          }}></div>
          <p style={{ color: '#64748b' }}>Chargement du portail...</p>
        </div>
        <style>{`
          @keyframes spin { to { transform: rotate(360deg); } }
        `}</style>
      </div>
    );
  }

  if (!utilisateur) {
    return <Connexion onConnecte={setUtilisateur} />;
  }

  const deconnecter = () => {
    jeton.effacer();
    setUtilisateur(null);
    navigate('/portail');
  };

  const initiales = `${utilisateur.prenom?.[0] || ''}${utilisateur.nom?.[0] || ''}`.toUpperCase();
  const isAdmin = utilisateur.role === 'ADMIN' || utilisateur.role === 'DIRECTION';
  const estClient = utilisateur?.role === 'CLIENT';

  // Menu pour les clients
  const menuItemsClient = [
    { path: '/portail', icon: '📋', label: 'Mes demandes' },
    { path: '/portail/mes-rapports', icon: '📄', label: 'Mes rapports' },
    { path: '/portail/mes-factures', icon: '💰', label: 'Mes factures' },
  ];

  // ✅ Menu complet pour le personnel
  const menuItemsStaff = [
    // Gestion principale
    { path: '/portail', icon: '📊', label: 'Tableau de bord' },
    { path: '/portail/clients', icon: '👥', label: 'Clients' },
    { path: '/portail/demandes', icon: '📋', label: 'Demandes' },
    { path: '/portail/echantillons', icon: '🧪', label: 'Échantillons' },
    { path: '/portail/resultats', icon: '📈', label: 'Résultats' },
    { path: '/portail/stocks', icon: '📦', label: 'Stocks' },
    { path: '/portail/factures', icon: '💰', label: 'Factures' },
    { path: '/portail/exports', icon: '⬇️', label: 'Exports' },
    
    // Gestion de contenu
    { path: '/portail/publications', icon: '📚', label: 'Publications' },
    { path: '/portail/projets', icon: '📋', label: 'Projets' },
    { path: '/portail/evenements', icon: '📅', label: 'Événements' },
    { path: '/portail/carrieres', icon: '💼', label: 'Carrières' },
    { path: '/portail/partenaires', icon: '🤝', label: 'Partenaires' },
    { path: '/portail/actualites', icon: '📰', label: 'Actualités' },
    { path: '/portail/galerie', icon: '🖼️', label: 'Galerie' },
    { path: '/portail/equipe', icon: '👥', label: 'Équipe' },
    { path: '/portail/faq', icon: '❓', label: 'FAQ' },
    
    // Banque de données
    { path: '/portail/banque-donnees', icon: '📊', label: 'Banque de données' },
    
    // Administration
    { path: '/portail/utilisateurs', icon: '👤', label: 'Utilisateurs' },
    { path: '/portail/equipements', icon: '🔬', label: 'Équipements' },
  ];

  const menuItems = estClient ? menuItemsClient : menuItemsStaff;

  // Séparer les menus pour une meilleure organisation
  const mainItems = menuItems.filter(item => 
    !['/portail/utilisateurs', '/portail/equipements'].includes(item.path)
  );
  const adminItems = menuItems.filter(item => 
    ['/portail/utilisateurs', '/portail/equipements'].includes(item.path)
  );

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', background: '#f4f7fc' }}>
      
      {/* HEADER */}
      <header style={{
        background: 'white',
        borderBottom: '1px solid rgba(0,0,0,0.06)',
        padding: '0 28px',
        height: '64px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        position: 'sticky',
        top: 0,
        zIndex: 100,
        boxShadow: '0 1px 3px rgba(0,0,0,0.04)'
      }}>
        <Link to="/portail" style={{
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          textDecoration: 'none'
        }}>
          <img
            src="/logo/logo-icerd-icon.png"
            alt="ICERD"
            width="36"
            height="36"
            style={{ objectFit: 'contain' }}
            onError={(e) => {
              e.target.style.display = 'none';
              e.target.parentElement.innerHTML = `
                <div style="
                  width: 36px;
                  height: 36px;
                  background: linear-gradient(135deg, #1d4ed8, #0f2d80);
                  border-radius: 8px;
                  display: flex;
                  align-items: center;
                  justify-content: center;
                  color: white;
                  font-size: 12px;
                  font-weight: 700;
                ">
                  ICE
                </div>
              `;
            }}
          />
          <div>
            <div style={{
              fontWeight: 700,
              fontSize: '16px',
              color: '#0f2d80',
              lineHeight: 1.1,
              letterSpacing: '-0.3px'
            }}>
              ICERD <span style={{ color: '#1d4ed8' }}>LIMS</span>
            </div>
            <div style={{
              fontSize: '9px',
              color: '#94a3b8',
              fontWeight: 500,
              letterSpacing: '0.5px',
              textTransform: 'uppercase'
            }}>
              Laboratory Information System
            </div>
          </div>
        </Link>

        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{ textAlign: 'right' }}>
            <div style={{
              fontWeight: 600,
              fontSize: '14px',
              color: '#0f2d80'
            }}>
              {utilisateur.prenom} {utilisateur.nom}
            </div>
            <div style={{
              fontSize: '11px',
              color: '#94a3b8'
            }}>
              {utilisateur.role}
            </div>
          </div>
          <div style={{
            width: '36px',
            height: '36px',
            borderRadius: '50%',
            background: 'linear-gradient(135deg, #1d4ed8, #0f2d80)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'white',
            fontWeight: 600,
            fontSize: '14px'
          }}>
            {initiales || '👤'}
          </div>
          <button
            onClick={deconnecter}
            style={{
              padding: '6px 16px',
              borderRadius: '6px',
              border: 'none',
              background: '#f1f5f9',
              color: '#475569',
              fontWeight: 500,
              fontSize: '13px',
              cursor: 'pointer',
              transition: 'all 0.2s ease'
            }}
            onMouseEnter={(e) => {
              e.target.style.background = '#fee2e2';
              e.target.style.color = '#dc2626';
            }}
            onMouseLeave={(e) => {
              e.target.style.background = '#f1f5f9';
              e.target.style.color = '#475569';
            }}
          >
            Déconnexion
          </button>
        </div>
      </header>

      {/* LAYOUT AVEC SIDEBAR */}
      <div style={{ display: 'flex', flex: 1 }}>
        
        {/* SIDEBAR */}
        <aside style={{
          width: '220px',
          background: 'white',
          borderRight: '1px solid rgba(0,0,0,0.04)',
          minHeight: 'calc(100vh - 64px)',
          padding: '20px 12px',
          position: 'sticky',
          top: '64px',
          height: 'calc(100vh - 64px)',
          overflowY: 'auto'
        }}>
          <div style={{
            fontSize: '10px',
            textTransform: 'uppercase',
            letterSpacing: '0.8px',
            color: '#94a3b8',
            fontWeight: 600,
            padding: '0 12px',
            marginBottom: '8px'
          }}>
            {estClient ? 'Espace Client' : 'Gestion'}
          </div>
          
          {/* Menu principal */}
          {mainItems.map(item => {
            if ((item.path === '/portail/utilisateurs' || item.path === '/portail/equipements') && !isAdmin) return null;
            return (
              <NavLink
                key={item.path}
                to={item.path}
                end={item.path === '/portail'}
                style={({ isActive }) => ({
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  padding: '10px 14px',
                  borderRadius: '8px',
                  textDecoration: 'none',
                  fontSize: '14px',
                  fontWeight: isActive ? 600 : 500,
                  color: isActive ? '#1d4ed8' : '#475569',
                  background: isActive ? '#e8edfd' : 'transparent',
                  transition: 'all 0.15s ease',
                  marginBottom: '2px'
                })}
                onMouseEnter={(e) => {
                  if (!e.target.classList.contains('active')) {
                    e.target.style.background = '#f1f5f9';
                  }
                }}
                onMouseLeave={(e) => {
                  if (!e.target.classList.contains('active')) {
                    e.target.style.background = 'transparent';
                  }
                }}
              >
                <span style={{ fontSize: '18px' }}>{item.icon}</span>
                {item.label}
              </NavLink>
            );
          })}

          {/* Administration (séparateur) */}
          {isAdmin && adminItems.length > 0 && (
            <>
              <div style={{
                fontSize: '10px',
                textTransform: 'uppercase',
                letterSpacing: '0.8px',
                color: '#94a3b8',
                fontWeight: 600,
                padding: '12px 12px 6px',
                marginTop: '8px',
                borderTop: '1px solid rgba(0,0,0,0.04)'
              }}>
                Administration
              </div>
              {adminItems.map(item => (
                <NavLink
                  key={item.path}
                  to={item.path}
                  end={item.path === '/portail'}
                  style={({ isActive }) => ({
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    padding: '10px 14px',
                    borderRadius: '8px',
                    textDecoration: 'none',
                    fontSize: '14px',
                    fontWeight: isActive ? 600 : 500,
                    color: isActive ? '#1d4ed8' : '#475569',
                    background: isActive ? '#e8edfd' : 'transparent',
                    transition: 'all 0.15s ease',
                    marginBottom: '2px'
                  })}
                >
                  <span style={{ fontSize: '18px' }}>{item.icon}</span>
                  {item.label}
                </NavLink>
              ))}
            </>
          )}

          {/* Lien site public */}
          <div style={{
            marginTop: 'auto',
            borderTop: '1px solid rgba(0,0,0,0.04)',
            paddingTop: '12px'
          }}>
            <NavLink
              to="/"
              style={({ isActive }) => ({
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                padding: '10px 14px',
                borderRadius: '8px',
                textDecoration: 'none',
                fontSize: '14px',
                fontWeight: isActive ? 600 : 500,
                color: isActive ? '#1d4ed8' : '#94a3b8',
                background: isActive ? '#e8edfd' : 'transparent',
                transition: 'all 0.15s ease'
              })}
            >
              <span style={{ fontSize: '18px' }}>🏠</span>
              Site public
            </NavLink>
          </div>
        </aside>

        {/* MAIN CONTENT */}
        <main style={{
          padding: '28px 32px',
          flex: 1,
          minHeight: 'calc(100vh - 64px)',
          background: '#f4f7fc'
        }}>
          <Routes>
            {/* Espace Client */}
            {estClient ? (
              <>
                <Route index element={<MesDemandes showToast={showToast} />} />
                <Route path="mes-rapports" element={<MesRapports showToast={showToast} />} />
                <Route path="mes-factures" element={<MesFactures showToast={showToast} />} />
              </>
            ) : (
              <>
                {/* Tableau de bord */}
                <Route index element={<TableauDeBord utilisateur={utilisateur} />} />
                
                {/* Gestion principale */}
                <Route path="clients" element={<Clients showToast={showToast} />} />
                <Route path="demandes" element={<Demandes showToast={showToast} />} />
                <Route path="echantillons" element={<Echantillons showToast={showToast} />} />
                <Route path="resultats" element={<Resultats showToast={showToast} />} />
                <Route path="stocks" element={<Stocks showToast={showToast} />} />
                <Route path="factures" element={<Factures showToast={showToast} />} />
                <Route path="exports" element={<Exports showToast={showToast} />} />
                
                {/* ✅ Gestion de contenu */}
                <Route path="publications" element={<GestionPublications showToast={showToast} />} />
                <Route path="projets" element={<GestionProjets showToast={showToast} />} />
                <Route path="evenements" element={<GestionEvenements showToast={showToast} />} />
                <Route path="carrieres" element={<GestionCarrieres showToast={showToast} />} />
                <Route path="partenaires" element={<GestionPartenaires showToast={showToast} />} />
                <Route path="actualites" element={<GestionActualites showToast={showToast} />} />
                <Route path="galerie" element={<GestionGalerie showToast={showToast} />} />
                <Route path="equipe" element={<GestionEquipe showToast={showToast} />} />
                <Route path="faq" element={<GestionFaq showToast={showToast} />} />
                
                {/* Banque de données */}
                <Route path="banque-donnees" element={<BanqueDonnees showToast={showToast} />} />
                
                {/* Administration */}
                <Route path="utilisateurs" element={isAdmin ? <Utilisateurs showToast={showToast} /> : <Navigate to="/portail" />} />
                <Route path="equipements" element={isAdmin ? <Equipements showToast={showToast} /> : <Navigate to="/portail" />} />
              </>
            )}
            
            {/* Fallback */}
            <Route path="*" element={<Navigate to="/portail" replace />} />
          </Routes>
        </main>
      </div>

      {/* TOAST */}
      {toast && <Toast message={toast.message} type={toast.type} />}
    </div>
  );
}