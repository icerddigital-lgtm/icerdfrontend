// frontend/src/App.jsx
import { Routes, Route, NavLink, Link } from 'react-router-dom';
import { useState, useRef, useEffect } from 'react';
import { useT } from './i18n/index.jsx';
import SelecteurLangue from './components/SelecteurLangue.jsx';

// ============================================================
// REACT ICONS
// ============================================================
import { 
  FaHome, 
  FaUsers, 
  FaFlask, 
  FaBook, 
  FaPhone,
  FaUserCircle,
  FaFolder,
  FaHandshake,
  FaBriefcase,
  FaNewspaper,
  FaCalendarAlt,
  FaImages,
  FaQuestionCircle,
  FaLock,
  FaFacebook,
  FaTwitter,
  FaInstagram,
  FaLinkedin,
  FaMapMarkerAlt,
  FaEnvelope,
  FaBars,
  FaTimes
} from 'react-icons/fa';

// Pages publiques existantes
import Accueil from './pages/Accueil.jsx';
import Apropos from './pages/Apropos.jsx';
import Laboratoires from './pages/Laboratoires.jsx';
import Analyses from './pages/Analyses.jsx';
import Contact from './pages/Contact.jsx';

// Nouvelles pages publiques
import Equipe from './pages/Equipe.jsx';
import Publications from './pages/Publications.jsx';
import Projets from './pages/Projets.jsx';
import Partenaires from './pages/Partenaires.jsx';
import Carrieres from './pages/Carrieres.jsx';
import Actualites from './pages/Actualites.jsx';
import Evenements from './pages/Evenements.jsx';
import Galerie from './pages/Galerie.jsx';
import FAQ from './pages/FAQ.jsx';

// Portail
import Portail from './portail/Portail.jsx';

function Nav() {
  const { t } = useT();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const dropdownRef = useRef(null);
  const buttonRef = useRef(null);
  const mobileMenuRef = useRef(null);

  // Fermer le dropdown quand on clique en dehors
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        dropdownRef.current && 
        !dropdownRef.current.contains(event.target) &&
        buttonRef.current &&
        !buttonRef.current.contains(event.target)
      ) {
        setDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Fermer le menu mobile quand on clique en dehors
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        mobileMenuRef.current && 
        !mobileMenuRef.current.contains(event.target)
      ) {
        setMobileMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Fermer le dropdown avec la touche Escape
  useEffect(() => {
    const handleEsc = (event) => {
      if (event.key === 'Escape') {
        setDropdownOpen(false);
        setMobileMenuOpen(false);
      }
    };
    document.addEventListener('keydown', handleEsc);
    return () => {
      document.removeEventListener('keydown', handleEsc);
    };
  }, []);

  // Empêcher le scroll quand le menu mobile est ouvert
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [mobileMenuOpen]);

  const mainLinks = [
    { path: '/', label: t('nav.accueil') },
    { path: '/a-propos', label: t('nav.centre') },
    { path: '/laboratoires', label: t('nav.laboratoires') },
    { path: '/analyses', label: t('nav.analyses') },
    { path: '/publications', label: t('nav.publications') },
    { path: '/contact', label: t('nav.contact') }
  ];

  const secondaryLinks = [
    { path: '/equipe', label: t('nav.equipe'), icon: FaUserCircle },
    { path: '/projets', label: t('nav.projets'), icon: FaFolder },
    { path: '/partenaires', label: t('nav.partenaires'), icon: FaHandshake },
    { path: '/carrieres', label: t('nav.carrieres'), icon: FaBriefcase },
    { path: '/actualites', label: t('nav.actualites'), icon: FaNewspaper },
    { path: '/evenements', label: t('nav.evenements'), icon: FaCalendarAlt },
    { path: '/galerie', label: t('nav.galerie'), icon: FaImages },
    { path: '/faq', label: t('nav.faq'), icon: FaQuestionCircle }
  ];

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
    if (!mobileMenuOpen) {
      setDropdownOpen(false);
    }
  };

  const closeMobileMenu = () => {
    setMobileMenuOpen(false);
  };

  return (
    <header style={{
      background: 'white',
      borderBottom: '1px solid rgba(0,0,0,0.06)',
      padding: '0 24px',
      height: '72px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      position: 'sticky',
      top: 0,
      zIndex: 100,
      boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
      fontFamily: '"IBM Plex Sans", sans-serif'
    }}>
      {/* Logo */}
      <Link to="/" style={{
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        textDecoration: 'none',
        flexShrink: 0
      }}>
        <img
          src="/logo/logo-icerd-icon.png"
          alt="ICERD"
          width="42"
          height="42"
          style={{ objectFit: 'contain' }}
          onError={(e) => {
            e.target.style.display = 'none';
            const parent = e.target.parentElement;
            if (parent) {
              const fallback = document.createElement('div');
              fallback.style.cssText = `
                width: 42px;
                height: 42px;
                background: linear-gradient(135deg, #1d4ed8, #0f2d80);
                border-radius: 10px;
                display: flex;
                align-items: center;
                justify-content: center;
                color: white;
                font-size: 14px;
                font-weight: 800;
              `;
              fallback.textContent = 'ICE';
              parent.insertBefore(fallback, e.target);
            }
          }}
        />
        <div>
          <div style={{
            fontWeight: 700,
            fontSize: '18px',
            color: '#0f2d80',
            lineHeight: 1.1,
            letterSpacing: '-0.3px'
          }}>
            ICERD
          </div>
          <div style={{
            fontSize: '9px',
            color: '#94a3b8',
            fontWeight: 500,
            letterSpacing: '0.8px',
            textTransform: 'uppercase'
          }}>
            Centre de Recherche
          </div>
        </div>
      </Link>

      {/* Menu Burger pour mobile */}
      <button
        onClick={toggleMobileMenu}
        aria-label={mobileMenuOpen ? t('nav.fermerMenu') : t('nav.ouvrirMenu')}
        className="menu-burger-btn"
        style={{
          background: 'none',
          border: 'none',
          cursor: 'pointer',
          padding: '8px',
          fontSize: '24px',
          color: '#0f2d80',
          zIndex: 101,
          display: 'block'
        }}
      >
        {mobileMenuOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
      </button>

      {/* Navigation Desktop & Mobile overlay wrapper */}
      {mobileMenuOpen && (
        <div 
          className="nav-overlay"
          onClick={closeMobileMenu}
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100vw',
            height: '100vh',
            background: 'rgba(15, 23, 42, 0.4)',
            backdropFilter: 'blur(4px)',
            zIndex: 98,
            transition: 'opacity 0.3s ease'
          }}
        />
      )}

      <nav 
        ref={mobileMenuRef}
        aria-label={t('nav.menuPrincipal')} 
        className={`nav-desktop ${mobileMenuOpen ? 'nav-mobile-open' : ''}`}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '4px',
          flexWrap: 'wrap',
          justifyContent: 'flex-end'
        }}
      >
        {mainLinks.map(item => (
          <NavLink
            key={item.path}
            to={item.path}
            end={item.path === '/'}
            onClick={closeMobileMenu}
            style={({ isActive }) => ({
              padding: '6px 14px',
              borderRadius: '8px',
              textDecoration: 'none',
              fontSize: '13px',
              fontWeight: isActive ? 600 : 500,
              color: isActive ? '#1d4ed8' : '#475569',
              background: isActive ? '#e8edfd' : 'transparent',
              transition: 'all 0.2s ease'
            })}
          >
            {item.label}
          </NavLink>
        ))}

        {/* Dropdown "Plus" amélioré avec icônes */}
        <div style={{ position: 'relative', display: 'inline-block' }}>
          <button
            ref={buttonRef}
            onClick={() => setDropdownOpen(!dropdownOpen)}
            style={{
              padding: '6px 14px',
              borderRadius: '8px',
              border: 'none',
              background: dropdownOpen ? '#f1f5f9' : 'transparent',
              fontSize: '13px',
              fontWeight: 500,
              color: dropdownOpen ? '#1d4ed8' : '#475569',
              cursor: 'pointer',
              fontFamily: '"IBM Plex Sans", sans-serif',
              transition: 'all 0.2s ease',
              display: 'flex',
              alignItems: 'center',
              gap: '4px'
            }}
            onMouseEnter={(e) => {
              if (!dropdownOpen) {
                e.currentTarget.style.background = '#f1f5f9';
              }
            }}
            onMouseLeave={(e) => {
              if (!dropdownOpen) {
                e.currentTarget.style.background = 'transparent';
              }
            }}
            aria-expanded={dropdownOpen}
            aria-haspopup="true"
          >
            {t('nav.plus')}
            <span style={{
              display: 'inline-block',
              transform: dropdownOpen ? 'rotate(180deg)' : 'rotate(0)',
              transition: 'transform 0.3s ease'
            }}>
              ▼
            </span>
          </button>

          {/* Dropdown menu */}
          {dropdownOpen && (
            <div
              ref={dropdownRef}
              className="dropdown-menu"
              style={{
                position: 'absolute',
                top: 'calc(100% + 8px)',
                right: 0,
                background: 'white',
                borderRadius: '12px',
                boxShadow: '0 12px 40px rgba(0,0,0,0.15)',
                padding: '10px',
                minWidth: '200px',
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: '4px',
                border: '1px solid rgba(0,0,0,0.06)',
                zIndex: 1000,
                animation: 'fadeInDown 0.2s ease'
              }}
            >
              {secondaryLinks.map(item => {
                const Icon = item.icon;
                return (
                  <NavLink
                    key={item.path}
                    to={item.path}
                    onClick={() => { setDropdownOpen(false); closeMobileMenu(); }}
                    style={({ isActive }) => ({
                      padding: '8px 14px',
                      borderRadius: '6px',
                      textDecoration: 'none',
                      fontSize: '13px',
                      fontWeight: isActive ? 600 : 500,
                      color: isActive ? '#1d4ed8' : '#475569',
                      background: isActive ? '#e8edfd' : 'transparent',
                      transition: 'all 0.15s ease',
                      whiteSpace: 'nowrap',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px'
                    })}
                    onMouseEnter={(e) => {
                      if (!e.currentTarget.classList.contains('active')) {
                        e.currentTarget.style.background = '#f1f5f9';
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (!e.currentTarget.classList.contains('active')) {
                        e.currentTarget.style.background = 'transparent';
                      }
                    }}
                  >
                    <Icon size={16} />
                    {item.label}
                  </NavLink>
                );
              })}
            </div>
          )}
        </div>

        {/* Sélecteur de langue */}
        <div style={{ marginLeft: '8px' }} className="lang-container">
          <SelecteurLangue />
        </div>

        {/* Portail LIMS */}
        <Link
          to="/portail"
          onClick={closeMobileMenu}
          style={{
            padding: '6px 18px',
            borderRadius: '8px',
            background: 'linear-gradient(135deg, #1d4ed8, #0f2d80)',
            color: 'white',
            textDecoration: 'none',
            fontSize: '13px',
            fontWeight: 600,
            marginLeft: '4px',
            transition: 'all 0.2s ease',
            boxShadow: '0 2px 8px rgba(29, 78, 216, 0.25)',
            whiteSpace: 'nowrap',
            display: 'flex',
            alignItems: 'center',
            gap: '6px'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'translateY(-1px)';
            e.currentTarget.style.boxShadow = '0 4px 16px rgba(29, 78, 216, 0.35)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.boxShadow = '0 2px 8px rgba(29, 78, 216, 0.25)';
          }}
        >
          <FaLock size={16} />
          {t('nav.portail')}
        </Link>
      </nav>

      {/* Styles CSS modifiés pour le menu mobile */}
      <style>{`
        .menu-burger-btn {
          display: none !important;
        }

        /* ✅ Desktop (> 1024px) */
        @media (min-width: 1025px) {
          .menu-burger-btn {
            display: none !important;
          }
          
          .nav-desktop {
            display: flex !important;
            position: static !important;
            background: transparent !important;
            flex-direction: row !important;
            padding: 0 !important;
            transform: none !important;
            box-shadow: none !important;
            overflow: visible !important;
            height: auto !important;
            width: auto !important;
          }
        }

        /* ✅ Mobile & Tablet (<= 1024px) - Transformation en Tiroir Coulissant à droite */
        @media (max-width: 1024px) {
          .menu-burger-btn {
            display: block !important;
          }

          .nav-desktop {
            position: fixed !important;
            top: 0 !important;
            right: 0 !important;
            bottom: 0 !important;
            width: 280px !important; /* Ajuste la largeur du menu ici */
            height: 100vh !important;
            background: white !important;
            flex-direction: column !important;
            padding: 80px 20px 24px !important;
            gap: 4px !important;
            justify-content: flex-start !important;
            align-items: stretch !important;
            
            /* Effet de glissement par défaut masqué */
            transform: translateX(100%) !important; 
            visibility: hidden !important;
            transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1), visibility 0.3s !important;
            z-index: 99 !important;
            overflow-y: auto !important;
            box-shadow: -4px 0 20px rgba(0, 0, 0, 0.1) !important;
            flex-wrap: nowrap !important;
          }

          /* Menu Ouvert */
          .nav-mobile-open {
            transform: translateX(0) !important;
            visibility: visible !important;
          }

          .nav-desktop a,
          .nav-desktop button:not(.menu-burger-btn) {
            width: 100% !important;
            justify-content: flex-start !important;
            padding: 12px 14px !important;
            font-size: 15px !important;
            border-radius: 8px !important;
            text-align: left !important;
            border: 1px solid transparent !important;
            box-sizing: border-box;
          }

          .nav-desktop a:hover {
            background: #f1f5f9 !important;
          }

          /* Liste déroulante "Plus" en Mobile */
          .nav-desktop .dropdown-menu {
            position: static !important;
            box-shadow: none !important;
            border: none !important;
            padding: 4px 0 4px 12px !important;
            grid-template-columns: 1fr !important;
            animation: none !important;
            background: #f8fafc !important;
            width: 100% !important;
            border-left: 2px solid #cbd5e1 !important;
            border-radius: 0 8px 8px 0 !important;
            margin-top: 4px;
          }

          .nav-desktop .dropdown-menu a {
            padding: 10px 14px !important;
            font-size: 14px !important;
          }

          .nav-desktop > div {
            width: 100% !important;
          }

          .nav-desktop > div > button {
            background: transparent !important;
            border: 1px solid #e2e8f0 !important;
            justify-content: space-between !important;
          }

          /* Alignement du Sélecteur de langue en mobile */
          .nav-desktop .lang-container {
            margin: 8px 0 !important;
            padding: 0 !important;
          }
          .nav-desktop .lang-container * {
            width: 100% !important;
          }

          /* Portail LIMS en mobile */
          .nav-desktop a[href="/portail"] {
            margin-top: 12px !important;
            justify-content: center !important;
            background: linear-gradient(135deg, #1d4ed8, #0f2d80) !important;
            color: white !important;
          }

          /* On supprime le pseudo-élément "Fermer" car le bouton X suffit */
          .nav-desktop::before {
            display: none !important;
          }
        }

        @media (max-width: 480px) {
          header {
            padding: 0 16px !important;
          }
          .nav-desktop {
            width: 85% !important; /* Prend plus de place sur les très petits écrans */
          }
        }

        @keyframes fadeInDown {
          from { opacity: 0; transform: translateY(-8px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </header>
  );
}

// Le reste du code (Pied et App) reste exactement identique
function Pied() {
  const { t } = useT();
  const lienStyle = {
    color: '#93c5fd',
    textDecoration: 'none',
    transition: 'color 0.2s ease'
  };

  const handleMouseEnter = (e) => { e.currentTarget.style.color = 'white'; };
  const handleMouseLeave = (e) => { e.currentTarget.style.color = '#93c5fd'; };

  return (
    <footer style={{
      background: '#0f2d80',
      color: 'white',
      padding: '48px 0 24px'
    }}>
      <div className="conteneur">
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '36px',
          marginBottom: '32px'
        }}>
          {/* Colonne 1 - Logo et description */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px' }}>
              <img
                src="/logo/logo-icerd-icon.png"
                alt="ICERD"
                width="36"
                height="36"
                style={{ objectFit: 'contain', filter: 'brightness(0) invert(1)' }}
                onError={(e) => { e.target.style.display = 'none'; }}
              />
              <span style={{ fontSize: '20px', fontWeight: 700 }}>ICERD</span>
            </div>
            <p style={{
              fontSize: '14px',
              color: 'rgba(255,255,255,0.7)',
              lineHeight: 1.6
            }}>
              {t('pied.description')}
            </p>
            <div style={{ marginTop: '12px', display: 'flex', gap: '12px' }}>
              <a href="#" style={{ color: 'rgba(255,255,255,0.5)', textDecoration: 'none' }}><FaFacebook size={20} /></a>
              <a href="#" style={{ color: 'rgba(255,255,255,0.5)', textDecoration: 'none' }}><FaTwitter size={20} /></a>
              <a href="#" style={{ color: 'rgba(255,255,255,0.5)', textDecoration: 'none' }}><FaInstagram size={20} /></a>
              <a href="#" style={{ color: 'rgba(255,255,255,0.5)', textDecoration: 'none' }}><FaLinkedin size={20} /></a>
            </div>
          </div>

          {/* Colonne 2 - Navigation rapide */}
          <div>
            <h4 style={{ fontSize: '12px', color: '#93c5fd', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '12px' }}>
              {t('pied.liens')}
            </h4>
            <ul style={{ listStyle: 'none', padding: 0, fontSize: '14px', color: 'rgba(255,255,255,0.7)', lineHeight: 2 }}>
              <li><Link to="/" style={lienStyle} onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>{t('nav.accueil')}</Link></li>
              <li><Link to="/a-propos" style={lienStyle} onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>{t('nav.centre')}</Link></li>
              <li><Link to="/laboratoires" style={lienStyle} onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>{t('nav.laboratoires')}</Link></li>
              <li><Link to="/analyses" style={lienStyle} onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>{t('nav.analyses')}</Link></li>
              <li><Link to="/contact" style={lienStyle} onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>{t('nav.contact')}</Link></li>
            </ul>
          </div>

          {/* Colonne 3 - Informations */}
          <div>
            <h4 style={{ fontSize: '12px', color: '#93c5fd', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '12px' }}>
              {t('pied.contactez')}
            </h4>
            <ul style={{ listStyle: 'none', padding: 0, fontSize: '14px', color: 'rgba(255,255,255,0.7)', lineHeight: 1.8 }}>
              <li><FaMapMarkerAlt size={14} style={{ display: 'inline', marginRight: '6px', color: '#93c5fd' }} />1, Rue 8417, Messamendongo</li>
              <li style={{ paddingLeft: '24px' }}>Yaoundé 4 — Cameroun</li>
              <li>📞 +237 689 03 51 88</li>
              <li>📞 +237 671 87 94 94</li>
              <li><FaEnvelope size={14} style={{ display: 'inline', marginRight: '6px', color: '#93c5fd' }} /><a href="mailto:icerdcameroon@gmail.com" style={lienStyle} onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>icerdcameroon@gmail.com</a></li>
            </ul>
          </div>

          {/* Colonne 4 - Laboratoires */}
          <div>
            <h4 style={{ fontSize: '12px', color: '#93c5fd', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '12px' }}>
              {t('nav.laboratoires')}
            </h4>
            <ul style={{ listStyle: 'none', padding: 0, fontSize: '14px', color: 'rgba(255,255,255,0.7)', lineHeight: 1.8 }}>
              <li>🔬 <Link to="/laboratoires#icepc" style={lienStyle} onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>ICEPC-LAB</Link></li>
              <li>🏗️ <Link to="/laboratoires#icgtec" style={lienStyle} onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>ICGTEC-LAB</Link></li>
              <li>🗺️ <Link to="/laboratoires#icemap" style={lienStyle} onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>ICEMAP-LAB</Link></li>
            </ul>
            <div style={{ marginTop: '12px' }}>
              <Link to="/portail" style={{
                ...lienStyle,
                background: 'rgba(255,255,255,0.1)',
                padding: '6px 16px',
                borderRadius: '6px',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                fontSize: '13px',
                transition: 'background 0.2s ease'
              }}
              onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(255,255,255,0.2)'; }}
              onMouseLeave={(e) => { e.currentTarget.style.background = 'rgba(255,255,255,0.1)'; }}
              >
                <FaLock size={14} />
                {t('nav.portail')}
              </Link>
            </div>
          </div>
        </div>

        {/* Bas de page */}
        <div style={{
          borderTop: '1px solid rgba(255,255,255,0.08)',
          paddingTop: '16px',
          display: 'flex',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '8px',
          fontSize: '12px',
          color: 'rgba(255,255,255,0.4)'
        }}>
          <span>© {new Date().getFullYear()} ICERD — {t('pied.droits')}</span>
          <span>Yaoundé · Cameroun · Afrique Centrale</span>
          <span>
            <a href="#" style={{ color: 'rgba(255,255,255,0.4)', textDecoration: 'none', transition: 'color 0.2s ease' }}
               onMouseEnter={(e) => { e.currentTarget.style.color = 'white'; }}
               onMouseLeave={(e) => { e.currentTarget.style.color = 'rgba(255,255,255,0.4)'; }}
            >{t('pied.mentionsLegales')}</a>
            {' · '}
            <a href="#" style={{ color: 'rgba(255,255,255,0.4)', textDecoration: 'none', transition: 'color 0.2s ease' }}
               onMouseEnter={(e) => { e.currentTarget.style.color = 'white'; }}
               onMouseLeave={(e) => { e.currentTarget.style.color = 'rgba(255,255,255,0.4)'; }}
            >Politique de confidentialité</a>
          </span>
        </div>
      </div>
    </footer>
  );
}

export default function App() {
  return (
    <Routes>
      <Route path="/portail/*" element={<Portail />} />
      <Route path="*" element={
        <>
          <Nav />
          <Routes>
            <Route path="/" element={<Accueil />} />
            <Route path="/a-propos" element={<Apropos />} />
            <Route path="/laboratoires" element={<Laboratoires />} />
            <Route path="/analyses" element={<Analyses />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/equipe" element={<Equipe />} />
            <Route path="/publications" element={<Publications />} />
            <Route path="/projets" element={<Projets />} />
            <Route path="/partenaires" element={<Partenaires />} />
            <Route path="/carrieres" element={<Carrieres />} />
            <Route path="/actualites" element={<Actualites />} />
            <Route path="/evenements" element={<Evenements />} />
            <Route path="/galerie" element={<Galerie />} />
            <Route path="/faq" element={<FAQ />} />
          </Routes>
          <Pied />
        </>
      } />
    </Routes>
  );
}