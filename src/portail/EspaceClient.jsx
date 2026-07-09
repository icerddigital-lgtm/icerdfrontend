// ============================================================================
// ESPACE CLIENT — visible uniquement pour le rôle CLIENT
// Le client suit ses demandes, télécharge ses rapports PDF et consulte ses factures.
// ============================================================================
import { useEffect, useState } from 'react';
import { api, fcfa, telechargerFichier } from '../api.js';
import { useT } from '../i18n/index.jsx';

const carte = { background: '#fff', borderRadius: 12, padding: 20, border: '1px solid #e2e8f0', marginBottom: 16 };
const etiq = (fond, texte) => ({ background: fond, color: texte, padding: '3px 10px', borderRadius: 6, fontSize: 12, fontWeight: 600 });

const STATUTS = {
  ENREGISTREE: ['#f6e7c8', '#7a5410', 'Enregistrée'],
  EN_COURS: ['#dbeafe', '#1e40af', 'Analyses en cours'],
  VALIDEE: ['#dcebdd', '#1d5c2e', 'Résultats validés'],
  RAPPORT_EMIS: ['#dcebdd', '#1d5c2e', 'Rapport disponible'],
  FACTUREE: ['#ede9fe', '#5b21b6', 'Facturée'],
  CLOTUREE: ['#e2e8f0', '#475569', 'Clôturée'],
};

export function MesDemandes({ showToast }) {
  const { t, format } = useT();
  const [liste, setListe] = useState(null);
  const [detail, setDetail] = useState(null);

  useEffect(() => { api('/portail-client/mes-demandes').then(setListe).catch(e => showToast?.(e.message, 'error')); }, []);

  const voir = async (id) => {
    try { setDetail(await api(`/portail-client/mes-demandes/${id}`)); }
    catch (e) { showToast?.(e.message, 'error'); }
  };

  if (!liste) return <p>Chargement de vos demandes…</p>;
  return (
    <div>
      <h2 style={{ marginBottom: 6 }}>{t('portail.mesDemandes')}</h2>
      <p style={{ color: '#64748b', fontSize: 14, marginBottom: 20 }}>
        Suivez en temps réel l'avancement de vos échantillons au laboratoire.
      </p>
      {liste.length === 0 && <div style={carte}>Aucune demande enregistrée pour le moment.</div>}
      {liste.map(d => {
        const [fond, coul, lib] = STATUTS[d.statut] || ['#e2e8f0', '#475569', d.statut];
        const pct = d.nb_analyses ? Math.round(100 * d.analyses_validees / d.nb_analyses) : 0;
        return (
          <div key={d.id} style={carte}>
            <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: 10 }}>
              <div>
                <strong style={{ fontFamily: 'monospace' }}>{d.numero}</strong>
                <span style={{ color: '#64748b', marginLeft: 10, fontSize: 14 }}>{d.objet || ''}</span>
                <div style={{ fontSize: 12.5, color: '#64748b', marginTop: 4 }}>
                  Reçue le {d.recu_le}{d.echeance ? ` · échéance ${d.echeance}` : ''}
                </div>
              </div>
              <span style={etiq(fond, coul)}>{lib}</span>
            </div>
            <div style={{ marginTop: 12 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, color: '#64748b' }}>
                <span>Avancement : {d.analyses_validees}/{d.nb_analyses} analyses validées</span><span>{pct} %</span>
              </div>
              <div style={{ height: 8, background: '#e2e8f0', borderRadius: 4, marginTop: 4 }}>
                <div style={{ width: `${pct}%`, height: '100%', background: pct === 100 ? '#1d5c2e' : '#B4552D', borderRadius: 4, transition: 'width .3s' }} />
              </div>
            </div>
            <button onClick={() => voir(d.id)} style={{ marginTop: 12, background: 'none', border: '1px solid #cbd5e1',
              borderRadius: 7, padding: '6px 14px', fontSize: 13, cursor: 'pointer' }}>{t('commun.voirDetail')}</button>
            {detail?.id === d.id && (
              <div style={{ marginTop: 12, borderTop: '1px solid #e2e8f0', paddingTop: 12 }}>
                {detail.echantillons.map(e => (
                  <div key={e.code} style={{ fontSize: 13.5, marginBottom: 8 }}>
                    <strong style={{ fontFamily: 'monospace' }}>{e.code}</strong> — {e.designation || e.matrice}
                    <div style={{ color: '#64748b', fontSize: 12.5 }}>
                      {(e.analyses || []).filter(a => a.analyse).map(a => `${a.analyse} (${a.statut === 'VALIDEE' ? '✓ validée' : a.statut.toLowerCase().replace('_', ' ')})`).join(' · ')}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

export function MesRapports({ showToast }) {
  const { t, format } = useT();
  const [liste, setListe] = useState(null);
  const [enCours, setEnCours] = useState('');

  useEffect(() => { api('/portail-client/mes-rapports').then(setListe).catch(e => showToast?.(e.message, 'error')); }, []);

  const pdf = async (r) => {
    setEnCours(r.numero);
    try { await telechargerFichier(`/rapports/demande/${r.demande_id}/pdf`, `Rapport_${r.numero}.pdf`);
      showToast?.(t('commun.telecharger'), 'success'); }
    catch (e) { showToast?.(e.message, 'error'); }
    finally { setEnCours(''); }
  };

  if (!liste) return <p>Chargement de vos rapports…</p>;
  return (
    <div>
      <h2 style={{ marginBottom: 6 }}>{t('portail.mesRapports')}</h2>
      <p style={{ color: '#64748b', fontSize: 14, marginBottom: 20 }}>
        Téléchargez vos rapports officiels au format PDF. Chaque rapport porte une empreinte
        numérique (SHA-256) garantissant qu'il n'a pas été modifié depuis son émission.
      </p>
      {liste.length === 0 && <div style={carte}>Aucun rapport émis pour l'instant. Vous serez notifié dès validation de vos résultats.</div>}
      {liste.map(r => (
        <div key={r.numero} style={{ ...carte, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 10 }}>
          <div>
            <strong style={{ fontFamily: 'monospace' }}>{r.numero}</strong>
            {r.amende && <span style={{ ...etiq('#fef3c7', '#92400e'), marginLeft: 8 }}>{t('portail.rapportAmende')}</span>}
            <div style={{ fontSize: 13, color: '#64748b', marginTop: 4 }}>
              Demande {r.demande} · {r.objet || ''} · émis le {r.emis_le}
            </div>
          </div>
          <button onClick={() => pdf(r)} disabled={enCours === r.numero}
            style={{ background: '#B4552D', color: '#fff', border: 'none', borderRadius: 8,
              padding: '10px 18px', fontSize: 13.5, fontWeight: 600, cursor: 'pointer' }}>
            {enCours === r.numero ? t('portail.telechargement') : '⬇ Télécharger le PDF'}
          </button>
        </div>
      ))}
    </div>
  );
}

export function MesFactures({ showToast }) {
  const { t, format } = useT();
  const [liste, setListe] = useState(null);
  useEffect(() => { api('/portail-client/mes-factures').then(setListe).catch(e => showToast?.(e.message, 'error')); }, []);

  if (!liste) return <p>Chargement de vos factures…</p>;
  return (
    <div>
      <h2 style={{ marginBottom: 6 }}>{t('portail.mesFactures')}</h2>
      <p style={{ color: '#64748b', fontSize: 14, marginBottom: 20 }}>
        Règlement par virement, chèque, espèces au Centre, MTN Mobile Money ou Orange Money
        (références sur votre facture).
      </p>
      {liste.length === 0 && <div style={carte}>Aucune facture pour le moment.</div>}
      {liste.map(f => {
        const reste = Number(f.montant_ttc) - Number(f.total_paye);
        return (
          <div key={f.numero} style={{ ...carte, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 10 }}>
            <div>
              <strong style={{ fontFamily: 'monospace' }}>{f.numero}</strong>
              <div style={{ fontSize: 13, color: '#64748b', marginTop: 4 }}>
                Émise le {f.emise_le}{f.echeance ? ` · échéance ${f.echeance}` : ''}
              </div>
            </div>
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontWeight: 700 }}>{fcfa(f.montant_ttc)}</div>
              <span style={etiq(
                f.statut === 'PAYEE' ? '#dcebdd' : reste > 0 ? '#f6e7c8' : '#e2e8f0',
                f.statut === 'PAYEE' ? '#1d5c2e' : '#7a5410')}>
                {f.statut === 'PAYEE' ? 'Payée' : `Reste à payer : ${fcfa(reste)}`}
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
}
