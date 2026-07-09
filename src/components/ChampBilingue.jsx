// ============================================================================
// CHAMP BILINGUE — édition FR / EN côte à côte dans le portail
//
// Permet de saisir la version française (obligatoire) et la version anglaise
// (facultative). Si l'anglais reste vide, le site public affiche le français.
//
// UTILISATION dans un formulaire du portail :
//
//   import ChampBilingue from '../components/ChampBilingue.jsx';
//
//   <ChampBilingue
//     label="Question"
//     nom="question"                 // → gère « question » et « question_en »
//     valeurs={form}                 // objet du formulaire
//     onChange={setForm}             // setter React
//     multiligne                     // <textarea> au lieu de <input>
//     obligatoire
//   />
//
// L'objet `form` doit contenir les deux clés : question et question_en.
// ============================================================================
import { useState } from 'react';

export default function ChampBilingue({
  label,
  nom,
  valeurs,
  onChange,
  multiligne = false,
  obligatoire = false,
  lignes = 4,
  placeholder = '',
  placeholderEn = '',
}) {
  const [onglet, setOnglet] = useState('fr');

  const cleFr = nom;
  const cleEn = `${nom}_en`;
  const valeurFr = valeurs[cleFr] ?? '';
  const valeurEn = valeurs[cleEn] ?? '';

  const traduit = String(valeurEn).trim() !== '';
  const cle = onglet === 'fr' ? cleFr : cleEn;
  const valeur = onglet === 'fr' ? valeurFr : valeurEn;

  const majValeur = (v) => onChange({ ...valeurs, [cle]: v });

  const styleOnglet = (actif) => ({
    padding: '4px 12px',
    fontSize: 11.5,
    fontWeight: 700,
    letterSpacing: '.04em',
    border: 'none',
    borderRadius: 6,
    cursor: 'pointer',
    fontFamily: 'inherit',
    background: actif ? '#1d4ed8' : 'transparent',
    color: actif ? '#fff' : '#64748b',
  });

  const styleSaisie = {
    width: '100%',
    padding: '9px 12px',
    border: '1px solid #cbd5e1',
    borderRadius: 8,
    fontSize: 14,
    fontFamily: 'inherit',
    resize: multiligne ? 'vertical' : undefined,
  };

  return (
    <div className="champ-lab" style={{ marginBottom: 16 }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 6 }}>
        <label style={{ fontWeight: 600, fontSize: 13, color: '#0f2d80' }}>
          {label} {obligatoire && <span style={{ color: '#dc2626' }}>*</span>}
        </label>

        <div style={{ display: 'flex', gap: 2, background: '#eef2ff', padding: 3, borderRadius: 8 }}>
          <button type="button" onClick={() => setOnglet('fr')}
            style={styleOnglet(onglet === 'fr')} aria-pressed={onglet === 'fr'}>
            FR
          </button>
          <button type="button" onClick={() => setOnglet('en')}
            style={styleOnglet(onglet === 'en')} aria-pressed={onglet === 'en'}
            title={traduit ? 'Traduction saisie' : 'Pas encore traduit'}>
            EN {traduit ? '✓' : '○'}
          </button>
        </div>
      </div>

      {multiligne ? (
        <textarea
          lang={onglet}
          rows={lignes}
          value={valeur}
          required={obligatoire && onglet === 'fr'}
          onChange={e => majValeur(e.target.value)}
          placeholder={onglet === 'fr' ? placeholder : (placeholderEn || 'English version (optional)')}
          style={styleSaisie}
        />
      ) : (
        <input
          lang={onglet}
          value={valeur}
          required={obligatoire && onglet === 'fr'}
          onChange={e => majValeur(e.target.value)}
          placeholder={onglet === 'fr' ? placeholder : (placeholderEn || 'English version (optional)')}
          style={styleSaisie}
        />
      )}

      {onglet === 'en' && !traduit && (
        <p style={{ fontSize: 12, color: '#64748b', marginTop: 4 }}>
          Laissez vide : le site affichera automatiquement la version française.
        </p>
      )}
    </div>
  );
}
