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
  FaEnvelope
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

      {/* Navigation */}
      <nav aria-label={t('nav.menuPrincipal')} style={{
        display: 'flex',
        alignItems: 'center',
        gap: '4px',
        flexWrap: 'wrap',
        justifyContent: 'flex-end'
      }}>
        {mainLinks.map(item => (
          <NavLink
            key={item.path}
            to={item.path}
            end={item.path === '/'}
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
                    onClick={() => setDropdownOpen(false)}
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
        <div style={{ marginLeft: '8px' }}>
          <SelecteurLangue />
        </div>

        {/* Portail LIMS */}
        <Link
          to="/portail"
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

      {/* Animation CSS */}
      <style>{`
        @keyframes fadeInDown {
          from { opacity: 0; transform: translateY(-8px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @media (max-width: 768px) {
          nav {
            display: ${mobileMenuOpen ? 'flex' : 'none'} !important;
            flex-direction: column !important;
            position: absolute !important;
            top: 72px !important;
            left: 0 !important;
            right: 0 !important;
            background: white !important;
            padding: 16px 24px !important;
            box-shadow: 0 4px 20px rgba(0,0,0,0.1) !important;
            gap: 8px !important;
            border-bottom: 1px solid rgba(0,0,0,0.06) !important;
          }
          .dropdown-menu {
            position: static !important;
            box-shadow: none !important;
            border: none !important;
            padding: 8px 0 !important;
            grid-template-columns: 1fr !important;
          }
          .dropdown-menu a {
            padding: 8px 14px !important;
          }
        }
      `}</style>
    </header>
  );
}

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
      {/* Route pour le portail (sans header/footer) */}
      <Route path="/portail/*" element={<Portail />} />
      
      {/* Route principale avec header/footer */}
      <Route path="*" element={
        <>
          <Nav />
          <Routes>
            {/* Pages existantes */}
            <Route path="/" element={<Accueil />} />
            <Route path="/a-propos" element={<Apropos />} />
            <Route path="/laboratoires" element={<Laboratoires />} />
            <Route path="/analyses" element={<Analyses />} />
            <Route path="/contact" element={<Contact />} />
            
            {/* Nouvelles pages */}
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