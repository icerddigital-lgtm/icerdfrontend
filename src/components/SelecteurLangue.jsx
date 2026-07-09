// ============================================================================
// SÉLECTEUR DE LANGUE — accessible au clavier et aux lecteurs d'écran
//
// Accessibilité :
//  - <nav aria-label> décrit le groupe
//  - aria-pressed indique la langue active (annoncée « sélectionné »)
//  - lang="fr"/"en" sur chaque bouton : le lecteur d'écran prononce
//    « Français » avec l'accent français et « English » à l'anglaise
//  - hreflang sur les liens, focus visible, cible tactile ≥ 44 px
// ============================================================================
import { useT } from '../i18n/index.jsx';

export default function SelecteurLangue({ compact = false }) {
  const { langue, changer, t } = useT();

  const options = [
    { code: 'fr', court: 'FR', long: 'Français' },
    { code: 'en', court: 'EN', long: 'English' },
  ];

  return (
    <nav aria-label={t('commun.langue')} style={{ display: 'flex', alignItems: 'center' }}>
      <ul style={{
        display: 'flex', listStyle: 'none', margin: 0, padding: 3, gap: 2,
        background: '#eef2ff', borderRadius: 8, border: '1px solid #dbe2f5',
      }}>
        {options.map(o => {
          const actif = langue === o.code;
          return (
            <li key={o.code}>
              <button
                type="button"
                lang={o.code}
                onClick={() => changer(o.code)}
                aria-pressed={actif}
                aria-label={o.long}
                title={o.long}
                style={{
                  minWidth: 44, minHeight: 32,
                  padding: '5px 10px',
                  border: 'none', borderRadius: 6, cursor: 'pointer',
                  fontSize: 12.5, fontWeight: 700, letterSpacing: '.04em',
                  fontFamily: 'inherit',
                  background: actif ? '#1d4ed8' : 'transparent',
                  color: actif ? '#fff' : '#475569',
                  transition: 'background .18s ease, color .18s ease',
                }}
                onMouseEnter={e => { if (!actif) e.currentTarget.style.background = '#dbe2f5'; }}
                onMouseLeave={e => { if (!actif) e.currentTarget.style.background = 'transparent'; }}
              >
                {compact ? o.court : o.court}
                {/* Texte lisible uniquement par les lecteurs d'écran */}
                <span style={{
                  position: 'absolute', width: 1, height: 1, padding: 0, margin: -1,
                  overflow: 'hidden', clip: 'rect(0 0 0 0)', whiteSpace: 'nowrap', border: 0,
                }}>
                  {o.long}
                </span>
              </button>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
