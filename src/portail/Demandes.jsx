import { useEffect, useState } from 'react';
import { api, fcfa, formatDate, telechargerFichier } from '../api.js';
import Modal from '../components/Modal.jsx';

export default function Demandes({ showToast }) {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState(null);
  const [detailModal, setDetailModal] = useState(null);
  const [clients, setClients] = useState([]);
  const [typesAnalyse, setTypesAnalyse] = useState([]);
  const [form, setForm] = useState({
    client_id: '',
    objet: '',
    urgence: false,
    date_echeance: '',
    echantillons: [{ matrice: 'SOL', designation: '', analyses: [] }]
  });

  const charger = async () => {
    try {
      setLoading(true);
      const [demandes, clientsList, analysesList] = await Promise.all([
        api('/demandes'),
        api('/clients'),
        api('/analyses/catalogue')
      ]);
      setData(demandes || []);
      setClients(clientsList || []);
      setTypesAnalyse(analysesList || []);
    } catch (e) {
      showToast(e.message, 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { charger(); }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Filtrer les échantillons vides
      const echantillonsValides = form.echantillons.filter(ech =>
        ech.designation.trim() !== '' && ech.analyses.length > 0
      );

      if (echantillonsValides.length === 0) {
        showToast('Ajoutez au moins un échantillon avec une analyse', 'error');
        return;
      }

      if (!form.client_id) {
        showToast('Veuillez sélectionner un client', 'error');
        return;
      }

      if (!form.objet.trim()) {
        showToast('Veuillez saisir un objet pour la demande', 'error');
        return;
      }

      const payload = {
        client_id: form.client_id,
        objet: form.objet.trim(),
        urgence: form.urgence,
        date_echeance: form.date_echeance || null,
        echantillons: echantillonsValides.map(ech => ({
          matrice: ech.matrice,
          designation: ech.designation.trim(),
          lieu_prelevement: ech.lieu_prelevement || '',
          quantite: parseInt(ech.quantite) || 1,
          analyses: ech.analyses.map(a => parseInt(a))
        }))
      };

      await api('/demandes', {
        method: 'POST',
        body: JSON.stringify(payload)
      });

      showToast('✅ Demande créée avec succès', 'success');
      setModal(null);
      resetForm();
      charger();
    } catch (e) {
      showToast(e.message, 'error');
    }
  };

  const resetForm = () => {
    setForm({
      client_id: clients[0]?.id || '',
      objet: '',
      urgence: false,
      date_echeance: '',
      echantillons: [{ matrice: 'SOL', designation: '', analyses: [] }]
    });
  };

  const handleChangerStatut = async (id, statut) => {
    try {
      await api(`/demandes/${id}/statut`, {
        method: 'PATCH',
        body: JSON.stringify({ statut })
      });
      showToast(`✅ Statut mis à jour: ${statut}`, 'success');
      charger();
    } catch (e) {
      showToast(e.message, 'error');
    }
  };

  const handleVoirDetail = async (id) => {
    try {
      const detail = await api(`/demandes/${id}`);
      setDetailModal(detail);
    } catch (e) {
      showToast(e.message, 'error');
    }
  };

  const ajouterEchantillon = () => {
    setForm({
      ...form,
      echantillons: [...form.echantillons, { matrice: 'SOL', designation: '', analyses: [] }]
    });
  };

  const supprimerEchantillon = (index) => {
    if (form.echantillons.length <= 1) return;
    const newEchantillons = form.echantillons.filter((_, i) => i !== index);
    setForm({ ...form, echantillons: newEchantillons });
  };

  const updateEchantillon = (index, field, value) => {
    const newEchantillons = [...form.echantillons];
    newEchantillons[index][field] = value;
    setForm({ ...form, echantillons: newEchantillons });
  };

  const toggleAnalyse = (echIndex, analyseId) => {
    const newEchantillons = [...form.echantillons];
    const analyses = newEchantillons[echIndex].analyses || [];
    const idx = analyses.indexOf(analyseId);
    if (idx > -1) {
      analyses.splice(idx, 1);
    } else {
      analyses.push(analyseId);
    }
    newEchantillons[echIndex].analyses = analyses;
    setForm({ ...form, echantillons: newEchantillons });
  };

  // ✅ STATUTS CORRECTS - Correspondent à l'énumération PostgreSQL
  const statutColors = {
    BROUILLON: 'badge-lab--secondary',
    ENREGISTREE: 'badge-lab--info',
    EN_COURS: 'badge-lab--warning',
    VALIDEE: 'badge-lab--success',
    RAPPORT_EMIS: 'badge-lab--primary',
    FACTUREE: 'badge-lab--primary',
    CLOTUREE: 'badge-lab--success',
    ANNULEE: 'badge-lab--danger'
  };

  const statutLabels = {
    BROUILLON: '📝 Brouillon',
    ENREGISTREE: '📥 Enregistrée',
    EN_COURS: '🔄 En cours',
    VALIDEE: '✅ Validée',
    RAPPORT_EMIS: '📄 Rapport émis',
    FACTUREE: '💰 Facturée',
    CLOTUREE: '🔒 Clôturée',
    ANNULEE: '❌ Annulée'
  };

  // ✅ STATISTIQUES MISES À JOUR
  const stats = {
    total: data.length,
    brouillon: data.filter(d => d.statut === 'BROUILLON').length,
    enregistree: data.filter(d => d.statut === 'ENREGISTREE').length,
    enCours: data.filter(d => d.statut === 'EN_COURS').length,
    validee: data.filter(d => d.statut === 'VALIDEE').length,
    rapportEmis: data.filter(d => d.statut === 'RAPPORT_EMIS').length,
    facturee: data.filter(d => d.statut === 'FACTUREE').length,
    cloturee: data.filter(d => d.statut === 'CLOTUREE').length,
    annulee: data.filter(d => d.statut === 'ANNULEE').length,
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
        <p style={{ color: '#64748b' }}>Chargement des demandes...</p>
      </div>
    );
  }

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
          <h2 style={{ fontSize: '20px', fontWeight: 700, color: '#0f2d80' }}>📋 Demandes d'analyses</h2>
          <div style={{ 
            display: 'flex', 
            gap: '16px', 
            marginTop: '4px', 
            fontSize: '13px', 
            color: '#64748b', 
            flexWrap: 'wrap' 
          }}>
            <span>📊 Total: <strong>{stats.total}</strong></span>
            <span>📝 Brouillons: <strong>{stats.brouillon}</strong></span>
            <span>📥 Enregistrées: <strong>{stats.enregistree}</strong></span>
            <span>🔄 En cours: <strong>{stats.enCours}</strong></span>
            <span>✅ Validées: <strong>{stats.validee}</strong></span>
            <span>📄 Rapports: <strong>{stats.rapportEmis}</strong></span>
            <span>💰 Facturées: <strong>{stats.facturee}</strong></span>
            <span>🔒 Clôturées: <strong>{stats.cloturee}</strong></span>
            {stats.annulee > 0 && (
              <span>❌ Annulées: <strong>{stats.annulee}</strong></span>
            )}
          </div>
        </div>
        <button
          className="btn-lab btn-lab--primary"
          onClick={() => {
            resetForm();
            setModal({ type: 'create' });
          }}
        >
          + Nouvelle demande
        </button>
      </div>

      {/* TABLEAU */}
      <div className="tableau-lab">
        <table>
          <thead>
            <tr>
              <th>N°</th>
              <th>Client</th>
              <th>Objet</th>
              <th style={{ textAlign: 'center' }}>Échantillons</th>
              <th style={{ textAlign: 'center' }}>Statut</th>
              <th style={{ textAlign: 'center' }}>Date</th>
              <th style={{ textAlign: 'center' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {data.length > 0 ? (
              data.map(d => (
                <tr key={d.id}>
                  <td style={{
                    fontFamily: 'var(--mono)',
                    fontSize: '12px',
                    color: 'var(--text-muted)',
                    fontWeight: 600
                  }}>
                    {d.numero}
                  </td>
                  <td><strong>{d.raison_sociale}</strong></td>
                  <td style={{ maxWidth: '180px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {d.objet}
                  </td>
                  <td style={{ textAlign: 'center' }}>
                    <span className="badge-lab badge-lab--primary">{d.nb_echantillons || 0}</span>
                  </td>
                  <td style={{ textAlign: 'center' }}>
                    <span className={`badge-lab ${statutColors[d.statut] || 'badge-lab--info'}`}>
                      {statutLabels[d.statut] || d.statut}
                    </span>
                  </td>
                  <td style={{ textAlign: 'center', fontSize: '13px' }}>
                    {formatDate(d.date_reception)}
                  </td>
                  <td style={{ textAlign: 'center' }}>
                    <div style={{ display: 'flex', gap: '4px', justifyContent: 'center', flexWrap: 'wrap' }}>
                      <button
                        className="btn-lab btn-lab--ghost btn-lab--xs"
                        onClick={() => handleVoirDetail(d.id)}
                        title="Voir détails"
                      >
                        👁️
                      </button>
                      <button
                        className="btn-lab btn-lab--ghost btn-lab--xs"
                        title="Rapport d'essai PDF (résultats validés requis)"
                        onClick={async () => {
                          try {
                            await telechargerFichier(`/rapports/demande/${d.id}/pdf`, `Rapport_${d.numero}.pdf`);
                            showToast?.('Rapport PDF téléchargé', 'success');
                          } catch (e) {
                            if (e.message.includes('non validé')) {
                              if (confirm(e.message + '\n\nTélécharger un PDF PROVISOIRE filigrané ?')) {
                                try {
                                  await telechargerFichier(`/rapports/demande/${d.id}/pdf?brouillon=1`, `Rapport_PROVISOIRE_${d.numero}.pdf`);
                                  showToast?.('PDF provisoire téléchargé', 'success');
                                } catch (e2) { showToast?.(e2.message, 'error'); }
                              }
                            } else showToast?.(e.message, 'error');
                          }
                        }}
                      >
                        📄 PDF
                      </button>
                      <button
                        className="btn-lab btn-lab--ghost btn-lab--xs"
                        title="Rapport Word éditable (usage interne)"
                        onClick={async () => {
                          try {
                            await telechargerFichier(`/rapports/demande/${d.id}/docx`, `Rapport_${d.numero}.docx`);
                            showToast?.('Rapport Word téléchargé', 'success');
                          } catch (e) { showToast?.(e.message, 'error'); }
                        }}
                      >
                        📝 DOCX
                      </button>
                      {/* ✅ MENU DÉROULANT AVEC LES BONS STATUTS */}
                      <select
                        value={d.statut}
                        onChange={e => handleChangerStatut(d.id, e.target.value)}
                        style={{
                          padding: '2px 6px',
                          borderRadius: '4px',
                          border: '1px solid var(--border-color)',
                          fontSize: '11px',
                          background: 'white',
                          cursor: 'pointer',
                          fontFamily: 'var(--texte)',
                          maxWidth: '100px'
                        }}
                      >
                        <option value="BROUILLON">📝 Brouillon</option>
                        <option value="ENREGISTREE">📥 Enregistrée</option>
                        <option value="EN_COURS">🔄 En cours</option>
                        <option value="VALIDEE">✅ Validée</option>
                        <option value="RAPPORT_EMIS">📄 Rapport émis</option>
                        <option value="FACTUREE">💰 Facturée</option>
                        <option value="CLOTUREE">🔒 Clôturée</option>
                        <option value="ANNULEE">❌ Annulée</option>
                      </select>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="7" style={{ textAlign: 'center', padding: '40px 20px', color: '#94a3b8' }}>
                  <div style={{ fontSize: '40px', marginBottom: '8px' }}>📋</div>
                  <p>Aucune demande enregistrée</p>
                  <p style={{ fontSize: '13px' }}>
                    Cliquez sur "Nouvelle demande" pour commencer
                  </p>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* MODAL - Création */}
      {modal?.type === 'create' && (
        <Modal title="Nouvelle demande d'analyse" onClose={() => setModal(null)} maxWidth="700px">
          <form onSubmit={handleSubmit}>
            {/* Informations générales */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              <div className="champ-lab">
                <label>Client *</label>
                <select
                  value={form.client_id}
                  onChange={e => setForm({ ...form, client_id: e.target.value })}
                  required
                >
                  <option value="">Sélectionner un client</option>
                  {clients.map(c => (
                    <option key={c.id} value={c.id}>{c.raison_sociale}</option>
                  ))}
                </select>
                {clients.length === 0 && (
                  <p style={{ color: '#dc2626', fontSize: '12px', marginTop: '4px' }}>
                    ⚠️ Aucun client disponible. Créez d'abord un client.
                  </p>
                )}
              </div>
              <div className="champ-lab">
                <label>Objet *</label>
                <input
                  value={form.objet}
                  onChange={e => setForm({ ...form, objet: e.target.value })}
                  placeholder="Ex: Analyse de sols agricoles"
                  required
                />
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              <div className="champ-lab">
                <label>Date d'échéance</label>
                <input
                  type="date"
                  value={form.date_echeance || ''}
                  onChange={e => setForm({ ...form, date_echeance: e.target.value })}
                />
              </div>
              <div className="champ-lab" style={{ flexDirection: 'row', alignItems: 'center', gap: '10px', marginTop: '8px' }}>
                <label style={{ marginBottom: 0 }}>🚨 Urgence</label>
                <input
                  type="checkbox"
                  checked={form.urgence}
                  onChange={e => setForm({ ...form, urgence: e.target.checked })}
                />
              </div>
            </div>

            {/* Échantillons */}
            <div style={{ marginTop: '16px', borderTop: '2px solid var(--border-color)', paddingTop: '16px' }}>
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '12px'
              }}>
                <h3 style={{ fontSize: '16px', fontWeight: 700, color: 'var(--blue-deep)' }}>
                  🧪 Échantillons
                </h3>
                <button
                  type="button"
                  className="btn-lab btn-lab--primary btn-lab--sm"
                  onClick={ajouterEchantillon}
                >
                  + Ajouter
                </button>
              </div>

              {form.echantillons.map((ech, idx) => (
                <div
                  key={idx}
                  style={{
                    background: 'var(--bg-light)',
                    borderRadius: '8px',
                    padding: '16px',
                    marginBottom: '12px',
                    border: '1px solid var(--border-color)'
                  }}
                >
                  <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginBottom: '8px'
                  }}>
                    <span style={{ fontWeight: 600, fontSize: '14px', color: 'var(--blue-deep)' }}>
                      Échantillon #{idx + 1}
                    </span>
                    <button
                      type="button"
                      className="btn-lab btn-lab--danger btn-lab--xs"
                      onClick={() => supprimerEchantillon(idx)}
                      disabled={form.echantillons.length <= 1}
                    >
                      ✕
                    </button>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                    <div className="champ-lab" style={{ marginBottom: 0 }}>
                      <label>Matrice</label>
                      <select
                        value={ech.matrice}
                        onChange={e => updateEchantillon(idx, 'matrice', e.target.value)}
                      >
                        {['SOL', 'EAU', 'PLANTE', 'ENGRAIS', 'MINERAI', 'HYDROCARBURE', 'AUTRE'].map(m => (
                          <option key={m}>{m}</option>
                        ))}
                      </select>
                    </div>
                    <div className="champ-lab" style={{ marginBottom: 0 }}>
                      <label>Désignation *</label>
                      <input
                        value={ech.designation}
                        onChange={e => updateEchantillon(idx, 'designation', e.target.value)}
                        placeholder="Ex: Échantillon de terre"
                        required
                      />
                    </div>
                  </div>

                  {/* Analyses pour cet échantillon */}
                  <div style={{ marginTop: '10px' }}>
                    <div style={{ 
                      fontSize: '12px', 
                      fontWeight: 600, 
                      color: 'var(--text-muted)', 
                      marginBottom: '6px',
                      display: 'flex',
                      justifyContent: 'space-between'
                    }}>
                      <span>Analyses sélectionnées ({ech.analyses?.length || 0})</span>
                      {ech.analyses?.length > 0 && (
                        <span style={{ color: 'var(--blue-brand)', fontWeight: 500 }}>
                          {fcfa(ech.analyses.reduce((sum, id) => {
                            const a = typesAnalyse.find(t => (t.id || t.code) === id);
                            return sum + (a?.prix_fcfa || 0);
                          }, 0))}
                        </span>
                      )}
                    </div>
                    <div style={{
                      display: 'flex',
                      gap: '6px',
                      flexWrap: 'wrap',
                      maxHeight: '100px',
                      overflowY: 'auto',
                      padding: '4px 0'
                    }}>
                      {typesAnalyse.map(a => {
                        const id = a.id || a.code;
                        const isSelected = (ech.analyses || []).includes(id);
                        return (
                          <button
                            key={id}
                            type="button"
                            onClick={() => toggleAnalyse(idx, id)}
                            style={{
                              padding: '2px 10px',
                              borderRadius: '999px',
                              border: isSelected
                                ? '2px solid var(--blue-brand)'
                                : '1px solid var(--border-color)',
                              background: isSelected
                                ? 'var(--blue-brand-light)'
                                : 'transparent',
                              color: isSelected
                                ? 'var(--blue-brand)'
                                : 'var(--text-muted)',
                              fontSize: '11px',
                              cursor: 'pointer',
                              transition: 'all 0.2s ease',
                              fontFamily: 'var(--texte)',
                              whiteSpace: 'nowrap'
                            }}
                          >
                            {a.code} - {a.nom}
                          </button>
                        );
                      })}
                      {typesAnalyse.length === 0 && (
                        <p style={{ color: '#94a3b8', fontSize: '12px' }}>
                          ⚠️ Aucune analyse disponible dans le catalogue
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div style={{ display: 'flex', gap: '12px', marginTop: '20px' }}>
              <button type="submit" className="btn-lab btn-lab--primary">
                💾 Créer la demande
              </button>
              <button type="button" className="btn-lab btn-lab--ghost" onClick={() => setModal(null)}>
                Annuler
              </button>
            </div>
          </form>
        </Modal>
      )}

      {/* MODAL - Détail */}
      {detailModal && (
        <Modal title={`Détail - ${detailModal.numero}`} onClose={() => setDetailModal(null)} maxWidth="800px">
          <div style={{ marginBottom: '16px' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              <div>
                <div style={{ fontSize: '12px', color: '#94a3b8' }}>Client</div>
                <div style={{ fontWeight: 600 }}>{detailModal.raison_sociale}</div>
              </div>
              <div>
                <div style={{ fontSize: '12px', color: '#94a3b8' }}>Objet</div>
                <div style={{ fontWeight: 600 }}>{detailModal.objet}</div>
              </div>
              <div>
                <div style={{ fontSize: '12px', color: '#94a3b8' }}>Statut</div>
                <div>
                  <span className={`badge-lab ${statutColors[detailModal.statut] || 'badge-lab--info'}`}>
                    {statutLabels[detailModal.statut] || detailModal.statut}
                  </span>
                </div>
              </div>
              <div>
                <div style={{ fontSize: '12px', color: '#94a3b8' }}>Date de réception</div>
                <div>{formatDate(detailModal.date_reception)}</div>
              </div>
            </div>
          </div>

          <h4 style={{ marginBottom: '12px', color: '#0f2d80' }}>🧪 Échantillons</h4>
          <div className="tableau-lab">
            <table>
              <thead>
                <tr>
                  <th>Code</th>
                  <th>Matrice</th>
                  <th>Désignation</th>
                  <th>Analyses</th>
                </tr>
              </thead>
              <tbody>
                {detailModal.echantillons?.map(e => (
                  <tr key={e.id}>
                    <td style={{ fontFamily: 'var(--mono)', fontSize: '12px', color: 'var(--text-muted)' }}>
                      {e.code}
                    </td>
                    <td><span className="badge-lab badge-lab--primary">{e.matrice}</span></td>
                    <td>{e.designation}</td>
                    <td>
                      {e.analyses?.filter(a => a).map((a, i) => (
                        <span key={i} className="badge-lab badge-lab--info" style={{ margin: '2px' }}>
                          {a.analyse}
                        </span>
                      ))}
                    </td>
                  </tr>
                ))}
                {(!detailModal.echantillons || detailModal.echantillons.length === 0) && (
                  <tr>
                    <td colSpan="4" style={{ textAlign: 'center', padding: '20px', color: '#94a3b8' }}>
                      Aucun échantillon
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          <div style={{ marginTop: '16px', display: 'flex', gap: '12px' }}>
            <button className="btn-lab btn-lab--ghost" onClick={() => setDetailModal(null)}>
              Fermer
            </button>
          </div>
        </Modal>
      )}
    </>
  );
}