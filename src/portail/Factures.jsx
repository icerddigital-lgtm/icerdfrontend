import { useEffect, useState } from 'react';
import { api, fcfa, formatDate, telechargerFichier } from '../api.js';
import Modal from '../components/Modal.jsx';

const ETIQ = {
  PAYEE: 'badge-lab badge-lab--success',
  EMISE: 'badge-lab badge-lab--warning',
  PARTIELLEMENT_PAYEE: 'badge-lab badge-lab--warning',
  IMPAYEE: 'badge-lab badge-lab--danger',
  ANNULEE: 'badge-lab badge-lab--danger'
};

export default function Factures({ showToast }) {
  const [liste, setListe] = useState([]);
  const [soldes, setSoldes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [erreur, setErreur] = useState('');
  const [modal, setModal] = useState(null);
  const [form, setForm] = useState({ demande_id: '', tva_taux: 19.25 });
  const [demandes, setDemandes] = useState([]);
  const [paiement, setPaiement] = useState({ montant: '', mode: 'ESPECES', reference: '' });
  const [selectedFacture, setSelectedFacture] = useState(null);
  const [detailModal, setDetailModal] = useState(null);

  const charger = async () => {
    try {
      setLoading(true);
      const [factures, soldesList, demandesList] = await Promise.all([
        api('/factures'),
        api('/factures/tresorerie/soldes').catch(() => []),
        // ✅ Utilisation de la nouvelle route /facturables
        api('/demandes/facturables').catch(() => [])
      ]);
      setListe(factures || []);
      setSoldes(soldesList || []);
      setDemandes(demandesList || []);
    } catch (e) {
      setErreur(e.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { charger(); }, []);

  // Générer une facture depuis une demande
  const handleGenererFacture = async (e) => {
    e.preventDefault();
    try {
      if (!form.demande_id) {
        showToast('Veuillez sélectionner une demande', 'error');
        return;
      }
      await api(`/factures/depuis-demande/${form.demande_id}`, {
        method: 'POST',
        body: JSON.stringify({ tva_taux: parseFloat(form.tva_taux) || 19.25 })
      });
      showToast('✅ Facture générée avec succès', 'success');
      setModal(null);
      setForm({ demande_id: '', tva_taux: 19.25 });
      charger();
    } catch (e) {
      showToast(e.message, 'error');
    }
  };

  // Enregistrer un paiement
  const handlePaiement = async (e) => {
    e.preventDefault();
    try {
      const montant = parseFloat(paiement.montant);
      if (!montant || montant <= 0) {
        showToast('Veuillez saisir un montant valide', 'error');
        return;
      }
      const reste = selectedFacture.montant_ttc - selectedFacture.total_paye;
      if (montant > reste) {
        showToast(`Le montant ne peut pas dépasser ${fcfa(reste)}`, 'error');
        return;
      }
      await api(`/factures/${selectedFacture.id}/paiements`, {
        method: 'POST',
        body: JSON.stringify({
          montant: montant,
          mode: paiement.mode,
          reference: paiement.reference || null
        })
      });
      showToast('✅ Paiement enregistré avec succès', 'success');
      setSelectedFacture(null);
      setPaiement({ montant: '', mode: 'ESPECES', reference: '' });
      charger();
    } catch (e) {
      showToast(e.message, 'error');
    }
  };

  // Annuler une facture
  const handleAnnuler = async (id) => {
    if (!confirm('Annuler cette facture ?')) return;
    try {
      await api(`/factures/${id}`, {
        method: 'PATCH',
        body: JSON.stringify({ statut: 'ANNULEE' })
      });
      showToast('✅ Facture annulée', 'success');
      charger();
    } catch (e) {
      showToast(e.message, 'error');
    }
  };

  // ✅ Voir le détail complet d'une facture
  const handleVoirDetail = async (id) => {
    try {
      const detail = await api(`/factures/${id}`);
      setDetailModal(detail);
    } catch (e) {
      showToast(e.message, 'error');
    }
  };

  // ✅ Télécharger le PDF
  const handleTelechargerPDF = async (id, numero) => {
    try {
      await telechargerFichier(`/factures/${id}/pdf`, `Facture_${numero}.pdf`);
      showToast('📄 PDF téléchargé avec succès', 'success');
    } catch (e) {
      showToast(e.message, 'error');
    }
  };

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '40px 0' }}>
        <div style={{
          width: '32px',
          height: '32px',
          border: '3px solid #1d4ed8',
          borderTopColor: 'transparent',
          borderRadius: '50%',
          animation: 'spin 0.8s linear infinite',
          margin: '0 auto 12px'
        }}></div>
        <p style={{ color: '#64748b' }}>Chargement des factures...</p>
      </div>
    );
  }

  if (erreur) {
    return (
      <div style={{
        background: '#fee2e2',
        color: '#dc2626',
        padding: '16px 20px',
        borderRadius: '12px'
      }}>
        ❌ {erreur}
      </div>
    );
  }

  // Statistiques
  const totalImpaye = liste
    .filter(f => f.statut === 'IMPAYEE' || f.statut === 'PARTIELLEMENT_PAYEE')
    .reduce((sum, f) => sum + (f.montant_ttc - (f.total_paye || 0)), 0);

  const totalPaye = liste
    .filter(f => f.statut === 'PAYEE')
    .reduce((sum, f) => sum + (f.montant_ttc || 0), 0);

  const totalFactures = liste.length;

  return (
    <>
      {/* HEADER */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '20px',
        flexWrap: 'wrap',
        gap: '12px'
      }}>
        <div>
          <h2 style={{ fontSize: '20px', fontWeight: 700, color: '#0f2d80' }}>💰 Facturation & trésorerie</h2>
          <div style={{ 
            display: 'flex', 
            gap: '20px', 
            marginTop: '4px', 
            fontSize: '14px', 
            color: '#64748b',
            flexWrap: 'wrap'
          }}>
            <span>📊 Total: <strong>{totalFactures}</strong></span>
            <span>💳 Payé: <strong style={{ color: '#16a34a' }}>{fcfa(totalPaye)}</strong></span>
            <span>⚠️ Impayé: <strong style={{ color: '#dc2626' }}>{fcfa(totalImpaye)}</strong></span>
          </div>
        </div>
        <button 
          className="btn-lab btn-lab--primary" 
          onClick={() => { 
            setForm({ demande_id: demandes[0]?.id || '', tva_taux: 19.25 }); 
            setModal({ type: 'generer' }); 
          }}
          disabled={demandes.length === 0}
          title={demandes.length === 0 ? "Aucune demande éligible pour la facturation" : ""}
        >
          + Nouvelle facture
        </button>
      </div>

      {/* SOLDES DES COMPTES */}
      {soldes.length > 0 && (
        <div className="stats-grid" style={{ marginBottom: '20px' }}>
          {soldes.map(s => (
            <div key={s.id} className="stat-card stat-card--success">
              <div className="stat-card__value" style={{ fontSize: '20px' }}>{fcfa(s.solde)}</div>
              <div className="stat-card__label">{s.libelle}</div>
            </div>
          ))}
        </div>
      )}

      {/* TABLEAU DES FACTURES */}
      <div className="tableau-lab">
        <table>
          <thead>
            <tr>
              <th>N°</th>
              <th>Client</th>
              <th>Émise le</th>
              <th style={{ textAlign: 'right' }}>Montant TTC</th>
              <th style={{ textAlign: 'right' }}>Payé</th>
              <th style={{ textAlign: 'right' }}>Reste</th>
              <th>Statut</th>
              <th style={{ textAlign: 'center' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {liste.length > 0 ? (
              liste.map(f => {
                const reste = (f.montant_ttc || 0) - (f.total_paye || 0);
                return (
                  <tr key={f.id}>
                    <td style={{ 
                      fontFamily: 'var(--mono)', 
                      fontSize: '12px', 
                      color: 'var(--text-muted)' 
                    }}>
                      {f.numero}
                    </td>
                    <td><strong>{f.raison_sociale || '—'}</strong></td>
                    <td style={{ fontSize: '13px' }}>
                      {f.date_emission ? formatDate(f.date_emission) : '—'}
                    </td>
                    <td style={{ textAlign: 'right', fontFamily: 'var(--mono)', fontWeight: 600 }}>
                      {fcfa(f.montant_ttc || 0)}
                    </td>
                    <td style={{ textAlign: 'right', fontFamily: 'var(--mono)', color: '#16a34a' }}>
                      {fcfa(f.total_paye || 0)}
                    </td>
                    <td style={{
                      textAlign: 'right',
                      fontFamily: 'var(--mono)',
                      fontWeight: 700,
                      color: reste > 0 ? '#dc2626' : '#16a34a'
                    }}>
                      {fcfa(reste)}
                    </td>
                    <td>
                      <span className={ETIQ[f.statut] || 'badge-lab'}>
                        {f.statut || '—'}
                      </span>
                    </td>
                    <td style={{ textAlign: 'center' }}>
                      <div style={{ display: 'flex', gap: '4px', justifyContent: 'center', flexWrap: 'wrap' }}>
                        <button
                          className="btn-lab btn-lab--ghost btn-lab--xs"
                          onClick={() => handleVoirDetail(f.id)}
                          title="Voir détails"
                        >
                          👁️
                        </button>
                        <button
                          className="btn-lab btn-lab--ghost btn-lab--xs"
                          onClick={() => handleTelechargerPDF(f.id, f.numero)}
                          title="Télécharger PDF"
                        >
                          📄
                        </button>
                        {f.statut !== 'PAYEE' && f.statut !== 'ANNULEE' && (
                          <button
                            className="btn-lab btn-lab--success btn-lab--xs"
                            onClick={() => { 
                              setSelectedFacture(f); 
                              setPaiement({ 
                                montant: reste > 0 ? reste : 0, 
                                mode: 'ESPECES', 
                                reference: '' 
                              }); 
                            }}
                            title="Enregistrer un paiement"
                          >
                            💳
                          </button>
                        )}
                        {f.statut !== 'ANNULEE' && f.statut !== 'PAYEE' && (
                          <button
                            className="btn-lab btn-lab--danger btn-lab--xs"
                            onClick={() => handleAnnuler(f.id)}
                            title="Annuler la facture"
                          >
                            ✕
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan="8" style={{ 
                  textAlign: 'center', 
                  padding: '40px 20px', 
                  color: '#94a3b8' 
                }}>
                  <div style={{ fontSize: '40px', marginBottom: '8px' }}>💰</div>
                  <p>Aucune facture enregistrée</p>
                  <p style={{ fontSize: '13px' }}>
                    Générez une facture à partir d'une demande en cours
                  </p>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* MODAL - Générer une facture */}
      {modal?.type === 'generer' && (
        <Modal title="Générer une facture" onClose={() => setModal(null)}>
          <form onSubmit={handleGenererFacture}>
            <div className="champ-lab">
              <label>Demande *</label>
              <select
                value={form.demande_id}
                onChange={e => setForm({ ...form, demande_id: e.target.value })}
                required
              >
                <option value="">Sélectionner une demande</option>
                {demandes.map(d => (
                  <option key={d.id} value={d.id}>
                    {d.numero} - {d.objet} - {d.raison_sociale}
                  </option>
                ))}
              </select>
              {demandes.length === 0 && (
                <p style={{ fontSize: '13px', color: '#f59e0b', marginTop: '4px' }}>
                  ⚠️ Aucune demande en cours disponible pour la facturation
                </p>
              )}
            </div>
            <div className="champ-lab">
              <label>Taux de TVA (%)</label>
              <input
                type="number"
                step="0.01"
                min="0"
                max="100"
                value={form.tva_taux}
                onChange={e => setForm({ ...form, tva_taux: parseFloat(e.target.value) || 0 })}
                required
              />
            </div>
            <div style={{
              background: 'var(--bg-light)',
              padding: '12px 16px',
              borderRadius: '8px',
              marginBottom: '16px',
              fontSize: '13px',
              color: '#64748b'
            }}>
              💡 La facture sera générée à partir des analyses commandées dans la demande.
              Les lignes de la facture correspondront aux analyses sélectionnées.
            </div>
            <div style={{ display: 'flex', gap: '12px' }}>
              <button type="submit" className="btn-lab btn-lab--primary">
                📄 Générer la facture
              </button>
              <button type="button" className="btn-lab btn-lab--ghost" onClick={() => setModal(null)}>
                Annuler
              </button>
            </div>
          </form>
        </Modal>
      )}

      {/* MODAL - Paiement */}
      {selectedFacture && (
        <Modal
          title={`Paiement - ${selectedFacture.numero}`}
          onClose={() => setSelectedFacture(null)}
        >
          <form onSubmit={handlePaiement}>
            <div style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: '12px',
              marginBottom: '16px',
              padding: '16px',
              background: 'var(--bg-light)',
              borderRadius: '8px'
            }}>
              <div>
                <div style={{ fontSize: '11px', color: '#64748b' }}>Montant total</div>
                <div style={{ fontSize: '18px', fontWeight: 700, color: '#0f2d80' }}>
                  {fcfa(selectedFacture.montant_ttc || 0)}
                </div>
              </div>
              <div>
                <div style={{ fontSize: '11px', color: '#64748b' }}>Déjà payé</div>
                <div style={{ fontSize: '18px', fontWeight: 700, color: '#16a34a' }}>
                  {fcfa(selectedFacture.total_paye || 0)}
                </div>
              </div>
              <div style={{ gridColumn: 'span 2' }}>
                <div style={{ fontSize: '11px', color: '#64748b' }}>Reste à payer</div>
                <div style={{ 
                  fontSize: '24px', 
                  fontWeight: 800, 
                  color: (selectedFacture.montant_ttc - selectedFacture.total_paye) > 0 ? '#dc2626' : '#16a34a'
                }}>
                  {fcfa((selectedFacture.montant_ttc || 0) - (selectedFacture.total_paye || 0))}
                </div>
              </div>
            </div>

            <div className="champ-lab">
              <label>Montant du paiement *</label>
              <input
                type="number"
                step="1"
                min="1"
                max={selectedFacture.montant_ttc - selectedFacture.total_paye}
                value={paiement.montant}
                onChange={e => setPaiement({ ...paiement, montant: e.target.value })}
                required
              />
            </div>

            <div className="champ-lab">
              <label>Mode de paiement</label>
              <select
                value={paiement.mode}
                onChange={e => setPaiement({ ...paiement, mode: e.target.value })}
              >
                <option value="ESPECES">💵 Espèces</option>
                <option value="VIREMENT">🏦 Virement bancaire</option>
                <option value="CHEQUE">📝 Chèque</option>
                <option value="MOBILE_MONEY">📱 Mobile Money</option>
                <option value="CARTE">💳 Carte bancaire</option>
              </select>
            </div>

            <div className="champ-lab">
              <label>Référence (optionnel)</label>
              <input
                value={paiement.reference || ''}
                onChange={e => setPaiement({ ...paiement, reference: e.target.value })}
                placeholder="N° de chèque, transaction, etc."
              />
            </div>

            <div style={{ display: 'flex', gap: '12px', marginTop: '20px' }}>
              <button type="submit" className="btn-lab btn-lab--success">
                💾 Enregistrer le paiement
              </button>
              <button type="button" className="btn-lab btn-lab--ghost" onClick={() => setSelectedFacture(null)}>
                Annuler
              </button>
            </div>
          </form>
        </Modal>
      )}

      {/* ✅ MODAL - Détail complet de la facture */}
      {detailModal && (
        <Modal 
          title={`Facture ${detailModal.numero}`} 
          onClose={() => setDetailModal(null)}
          maxWidth="800px"
        >
          <div style={{ marginBottom: '20px' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              <div>
                <div style={{ fontSize: '12px', color: '#94a3b8' }}>Client</div>
                <div style={{ fontWeight: 600 }}>{detailModal.raison_sociale || '—'}</div>
              </div>
              <div>
                <div style={{ fontSize: '12px', color: '#94a3b8' }}>Demande</div>
                <div style={{ fontWeight: 600 }}>{detailModal.demande_numero || '—'}</div>
              </div>
              <div>
                <div style={{ fontSize: '12px', color: '#94a3b8' }}>Date d'émission</div>
                <div>{detailModal.date_emission ? formatDate(detailModal.date_emission) : '—'}</div>
              </div>
              <div>
                <div style={{ fontSize: '12px', color: '#94a3b8' }}>Date d'échéance</div>
                <div>{detailModal.date_echeance ? formatDate(detailModal.date_echeance) : '—'}</div>
              </div>
              <div>
                <div style={{ fontSize: '12px', color: '#94a3b8' }}>Statut</div>
                <span className={ETIQ[detailModal.statut] || 'badge-lab'}>
                  {detailModal.statut || '—'}
                </span>
              </div>
            </div>
          </div>

          {/* Lignes de la facture */}
          <h4 style={{ marginBottom: '12px', color: '#0f2d80' }}>📋 Détail des prestations</h4>
          <div className="tableau-lab">
            <table>
              <thead>
                <tr>
                  <th>Code</th>
                  <th>Description</th>
                  <th style={{ textAlign: 'right' }}>Prix unitaire</th>
                  <th style={{ textAlign: 'center' }}>Qté</th>
                  <th style={{ textAlign: 'right' }}>Total</th>
                </tr>
              </thead>
              <tbody>
                {detailModal.lignes?.map((l, idx) => (
                  <tr key={idx}>
                    <td style={{ fontFamily: 'var(--mono)', fontSize: '12px' }}>{l.code_analyse || '—'}</td>
                    <td>{l.nom_analyse || l.description || '—'}</td>
                    <td style={{ textAlign: 'right', fontFamily: 'var(--mono)' }}>
                      {fcfa(l.prix_unitaire || 0)}
                    </td>
                    <td style={{ textAlign: 'center' }}>{l.quantite || 1}</td>
                    <td style={{ textAlign: 'right', fontFamily: 'var(--mono)', fontWeight: 600 }}>
                      {fcfa((l.prix_unitaire || 0) * (l.quantite || 1))}
                    </td>
                  </tr>
                ))}
                {(!detailModal.lignes || detailModal.lignes.length === 0) && (
                  <tr>
                    <td colSpan="5" style={{ textAlign: 'center', padding: '20px', color: '#94a3b8' }}>
                      Aucune ligne détaillée
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Récapitulatif des montants */}
          <div style={{ 
            marginTop: '16px', 
            padding: '16px', 
            background: 'var(--bg-light)', 
            borderRadius: '8px',
            display: 'flex',
            justifyContent: 'flex-end',
            gap: '30px',
            flexWrap: 'wrap'
          }}>
            <div>
              <div style={{ fontSize: '12px', color: '#64748b' }}>Total HT</div>
              <div style={{ fontSize: '18px', fontWeight: 600 }}>{fcfa(detailModal.montant_ht || 0)}</div>
            </div>
            <div>
              <div style={{ fontSize: '12px', color: '#64748b' }}>TVA ({detailModal.tva_taux || 0}%)</div>
              <div style={{ fontSize: '18px', fontWeight: 600 }}>{fcfa(detailModal.montant_tva || 0)}</div>
            </div>
            <div>
              <div style={{ fontSize: '12px', color: '#64748b' }}>Total TTC</div>
              <div style={{ fontSize: '24px', fontWeight: 800, color: '#0f2d80' }}>
                {fcfa(detailModal.montant_ttc || 0)}
              </div>
            </div>
            <div>
              <div style={{ fontSize: '12px', color: '#64748b' }}>Payé</div>
              <div style={{ fontSize: '18px', fontWeight: 700, color: '#16a34a' }}>
                {fcfa(detailModal.total_paye || 0)}
              </div>
            </div>
            <div>
              <div style={{ fontSize: '12px', color: '#64748b' }}>Reste</div>
              <div style={{ 
                fontSize: '18px', 
                fontWeight: 700, 
                color: ((detailModal.montant_ttc || 0) - (detailModal.total_paye || 0)) > 0 ? '#dc2626' : '#16a34a'
              }}>
                {fcfa((detailModal.montant_ttc || 0) - (detailModal.total_paye || 0))}
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '12px', marginTop: '20px' }}>
            <button 
              className="btn-lab btn-lab--primary"
              onClick={() => handleTelechargerPDF(detailModal.id, detailModal.numero)}
            >
              📄 Télécharger PDF
            </button>
            <button className="btn-lab btn-lab--ghost" onClick={() => setDetailModal(null)}>
              Fermer
            </button>
          </div>
        </Modal>
      )}
    </>
  );
}