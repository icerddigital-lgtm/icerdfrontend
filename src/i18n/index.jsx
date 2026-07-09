// ============================================================================
// ICERD — NOYAU D'INTERNATIONALISATION (français / anglais)
//
// Aucune dépendance externe : ~120 lignes de React natif.
//
// PRINCIPES
//  1. Repli automatique : si une clé manque en anglais, le français s'affiche.
//     Une page ne peut donc JAMAIS apparaître vide ou cassée.
//  2. Le choix de langue est mémorisé (localStorage) et survit au rechargement.
//  3. L'attribut <html lang="…"> est mis à jour : indispensable pour les
//     lecteurs d'écran, la synthèse vocale et le référencement.
//  4. Nombres, dates et montants sont formatés selon la langue active
//     (« 15 503 FCFA » en français, « XAF 15,503 » en anglais).
//
// UTILISATION
//   import { useT } from '../i18n/index.jsx';
//   const { t, langue, basculer } = useT();
//   <h1>{t('accueil.titre')}</h1>
//   <p>{t('accueil.compteurs', { n: 164 })}</p>   // interpolation {n}
//
//   // Valeurs venues de la base (catégories, statuts) : traduction silencieuse
//   const { libelleCategorie } = useT();
//   <span>{libelleCategorie(projet.statut)}</span>   // « En cours » → « Ongoing »
// ============================================================================
import { createContext, useContext, useEffect, useMemo, useState, useCallback } from 'react';
import { fr } from './fr.js';
import { en } from './en.js';

const DICTIONNAIRES = { fr, en };
const LANGUES = ['fr', 'en'];
const CLE_STOCKAGE = 'icerd_langue';

const ContexteI18n = createContext(null);

/** Détecte la langue initiale : choix mémorisé > langue du navigateur > français */
function langueInitiale() {
  try {
    const memorisee = localStorage.getItem(CLE_STOCKAGE);
    if (LANGUES.includes(memorisee)) return memorisee;
  } catch { /* mode privé : localStorage indisponible */ }
  const nav = (navigator.language || 'fr').slice(0, 2).toLowerCase();
  return LANGUES.includes(nav) ? nav : 'fr';
}

/** Résout « accueil.heros.titre » dans un objet imbriqué */
function resoudre(dictionnaire, chemin) {
  return chemin.split('.').reduce((noeud, cle) => (noeud == null ? undefined : noeud[cle]), dictionnaire);
}

/** Remplace {nom} par la valeur correspondante */
function interpoler(texte, valeurs) {
  if (!valeurs || typeof texte !== 'string') return texte;
  return texte.replace(/\{(\w+)\}/g, (brut, cle) =>
    Object.prototype.hasOwnProperty.call(valeurs, cle) ? String(valeurs[cle]) : brut);
}

export function FournisseurI18n({ children }) {
  const [langue, setLangue] = useState(langueInitiale);

  // Met à jour <html lang> et <html dir> — accessibilité et SEO
  useEffect(() => {
    document.documentElement.lang = langue;
    document.documentElement.dir = 'ltr';
    try { localStorage.setItem(CLE_STOCKAGE, langue); } catch { /* ignoré */ }
  }, [langue]);

  const t = useCallback((cle, valeurs) => {
    const actif = resoudre(DICTIONNAIRES[langue], cle);
    if (actif !== undefined) return interpoler(actif, valeurs);

    // Repli sur le français
    const repli = resoudre(DICTIONNAIRES.fr, cle);
    if (repli !== undefined) {
      if (import.meta.env.DEV && langue !== 'fr')
        console.warn(`[i18n] Clé absente en « ${langue} » : ${cle} (repli français)`);
      return interpoler(repli, valeurs);
    }

    // Clé inconnue : on renvoie la clé pour la repérer immédiatement
    if (import.meta.env.DEV) console.error(`[i18n] Clé inconnue : ${cle}`);
    return cle;
  }, [langue]);


  /**
   * Traduction SILENCIEUSE, pour les valeurs venues de la base de données.
   *
   * Une catégorie créée dans le portail (« Portes Ouvertes », « Alternance »…)
   * n'existe pas dans le dictionnaire : c'est normal, ce n'est pas une erreur
   * de programmation. On renvoie alors le repli fourni, sans rien journaliser.
   *
   *   tOu('cms.cat.Alternance', 'Alternance')  →  'Alternance'
   *   tOu('cms.cat.Terrain', 'Terrain')        →  'Field'  (en anglais)
   */
  const tOu = useCallback((cle, repli) => {
    const actif = resoudre(DICTIONNAIRES[langue], cle);
    if (actif !== undefined) return actif;
    const fallbackFr = resoudre(DICTIONNAIRES.fr, cle);
    if (fallbackFr !== undefined) return fallbackFr;
    return repli;
  }, [langue]);

  /**
   * Libellé traduit d'une valeur de catégorie stockée en base.
   * La valeur elle-même n'est jamais modifiée : elle sert de filtre.
   */
  const libelleCategorie = useCallback(
    (valeur) => (valeur == null || valeur === '' ? '' : tOu(`cms.cat.${valeur}`, valeur)),
    [tOu]
  );

  const changer = useCallback((nouvelle) => {
    if (LANGUES.includes(nouvelle)) setLangue(nouvelle);
  }, []);

  const basculer = useCallback(() => setLangue(l => (l === 'fr' ? 'en' : 'fr')), []);

  // Formatage local
  const locale = langue === 'fr' ? 'fr-FR' : 'en-GB';
  const format = useMemo(() => ({
    /** 15503 → « 15 503 FCFA » (fr) / « XAF 15,503 » (en) */
    fcfa: (n) => {
      const v = Number(n || 0);
      return langue === 'fr'
        ? `${new Intl.NumberFormat('fr-FR').format(v)} FCFA`
        : `XAF ${new Intl.NumberFormat('en-GB').format(v)}`;
    },
    nombre: (n) => new Intl.NumberFormat(locale).format(Number(n || 0)),
    /** Date longue : « 9 juillet 2026 » / « 9 July 2026 » */
    date: (d) => d ? new Date(d).toLocaleDateString(locale, { day: 'numeric', month: 'long', year: 'numeric' }) : '—',
    /** Date courte : « 09/07/2026 » / « 09/07/2026 » */
    dateCourte: (d) => d ? new Date(d).toLocaleDateString(locale) : '—',
  }), [langue, locale]);

  const valeur = useMemo(
    () => ({ langue, changer, basculer, t, tOu, libelleCategorie, format, locale, langues: LANGUES }),
    [langue, changer, basculer, t, tOu, libelleCategorie, format, locale]
  );

  return <ContexteI18n.Provider value={valeur}>{children}</ContexteI18n.Provider>;
}

/** Hook principal : const { t, langue, basculer, format } = useT(); */
export function useT() {
  const ctx = useContext(ContexteI18n);
  if (!ctx) throw new Error('useT() doit être utilisé à l\'intérieur de <FournisseurI18n>.');
  return ctx;
}

/** Langue courante hors composant React (pour les appels API) */
export function langueCourante() {
  try {
    const l = localStorage.getItem(CLE_STOCKAGE);
    return LANGUES.includes(l) ? l : 'fr';
  } catch { return 'fr'; }
}
