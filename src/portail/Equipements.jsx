import { useEffect, useState } from 'react';
import { api } from '../api.js';
import Modal from '../components/Modal.jsx';

export default function Equipements({ showToast }) {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState(null);
  const [form, setForm] = useState({
    code: '',
    designation: '',
    laboratoire_id: '',
    numero_serie: '',
    date_mise_service: '',
    frequence_etalonnage_mois: 12,
    prochain_etalonnage: ''
  });
  const [labos, setLabos] = useState([]);

  const charger = async () => {
    try {
      setLoading(true);
      const [equipements, laboratoires] = await Promise.all([
        api('/equipements'),
        api('/laboratoires').catch(() => [])
      ]);
      setData(equipements);
      setLabos(laboratoires);
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
      if (modal?.id) {
        await api(`/equipements/${modal.id}`, { method: 'PATCH', body: JSON.stringify(form) });
        showToast('Équipement modifié', 'success');
      } else {
        await api('/equipements', { method: 'POST', body: JSON.stringify(form) });
        showToast('Équipement créé', 'success');
      }
      setModal(null);
      setForm({
        code: '',
        designation: '',
        laboratoire_id: '',
        numero_serie: '',
        date_mise_service: '',
        frequence_etalonnage_mois: 12,
        prochain_etalonnage: ''
      });
      charger();
    } catch (e) {
      showToast(e.message, 'error');
    }
  };

  const handleIntervention = async (id, type) => {
    try {
      await api(`/equipements/${id}/interventions`, {
        method: 'POST',
        body: JSON.stringify({
          type: type,
          date_intervention: new Date().toISOString().split('T')[0],
          resultat: 'OK',
          prochaine_echeance: new Date(Date.now() + 12 * 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
        })
      });
      showToast('Intervention enregistrée', 'success');
      charger();
    } catch (e) {
      showToast(e.message, 'error');
    }
  };

  if (loading) return <p>Chargement...</p>;

  // Vérifier les étalonnages à prévoir
  const today = new Date();
  const soon = new Date(today);
  soon.setDate(soon.getDate() + 30);

  return (
    <>
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '20px',
        flexWrap: 'wrap',
        gap: '12px'
      }}>
        <h2 style={{ fontSize: '20px', fontWeight: 700, color: '#0f2d80' }}>🔬 Équipements</h2>
        <button
          className="btn-lab btn-lab--primary"
          onClick={() => {
            setForm({
              code: '',
              designation: '',
              laboratoire_id: labos[0]?.id || '',
              numero_serie: '',
              date_mise_service: '',
              frequence_etalonnage_mois: 12,
              prochain_etalonnage: ''
            });
            setModal({});
          }}
        >
          + Nouvel équipement
        </button>
      </div>

      <div className="tableau-lab">
        <table>
          <thead>
            <tr>
              <th>Code</th>
              <th>Désignation</th>
              <th>Laboratoire</th>
              <th>N° Série</th>
              <th>Prochain étalonnage</th>
              <th>Statut</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {data.map(e => {
              const etalonnageDate = new Date(e.prochain_etalonnage);
              const diffDays = Math.ceil((etalonnageDate - today) / (1000 * 60 * 60 * 24));
              let statut = 'OK';
              let statutColor = 'badge-lab--success';
              if (diffDays < 0) { statut = '⚠️ Dépassé'; statutColor = 'badge-lab--danger'; }
              else if (diffDays < 30) { statut = `⏳ ${diffDays} j`; statutColor = 'badge-lab--warning'; }

              return (
                <tr key={e.id}>
                  <td style={{ fontFamily: 'var(--mono)', fontSize: '12px', color: 'var(--text-muted)' }}>
                    {e.code}
                  </td>
                  <td><strong>{e.designation}</strong></td>
                  <td>{e.laboratoire}</td>
                  <td style={{ fontFamily: 'var(--mono)', fontSize: '12px', color: 'var(--text-muted)' }}>
                    {e.numero_serie || '—'}
                  </td>
                  <td style={{ fontFamily: 'var(--mono)', fontSize: '13px' }}>
                    {new Date(e.prochain_etalonnage).toLocaleDateString('fr-FR')}
                  </td>
                  <td><span className={`badge-lab ${statutColor}`}>{statut}</span></td>
                  <td>
                    <button
                      className="btn-lab btn-lab--ghost btn-lab--sm"
                      onClick={() => { setForm(e); setModal({ id: e.id }); }}
                      title="Modifier"
                    >
                      ✏️
                    </button>
                    <button
                      className="btn-lab btn-lab--primary btn-lab--sm"
                      onClick={() => handleIntervention(e.id, 'ETALONNAGE')}
                      title="Enregistrer un étalonnage"
                      style={{ marginLeft: '4px' }}
                    >
                      🔧
                    </button>
                  </td>
                </tr>
              );
            })}
            {data.length === 0 && (
              <tr>
                <td colSpan="7" style={{ textAlign: 'center', padding: '30px', color: '#94a3b8' }}>
                  Aucun équipement enregistré
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {modal && (
        <Modal
          title={modal.id ? 'Modifier l\'équipement' : 'Nouvel équipement'}
          onClose={() => setModal(null)}
        >
          <form onSubmit={handleSubmit}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              <div className="champ-lab">
                <label>Code *</label>
                <input
                  value={form.code || ''}
                  onChange={e => setForm({ ...form, code: e.target.value })}
                  required
                />
              </div>
              <div className="champ-lab">
                <label>Désignation *</label>
                <input
                  value={form.designation || ''}
                  onChange={e => setForm({ ...form, designation: e.target.value })}
                  required
                />
              </div>
            </div>

            <div className="champ-lab">
              <label>Laboratoire</label>
              <select
                value={form.laboratoire_id || ''}
                onChange={e => setForm({ ...form, laboratoire_id: e.target.value })}
              >
                <option value="">Sélectionner un laboratoire</option>
                {labos.map(l => (
                  <option key={l.id} value={l.id}>{l.code} - {l.nom}</option>
                ))}
              </select>
            </div>

            <div className="champ-lab">
              <label>Numéro de série</label>
              <input
                value={form.numero_serie || ''}
                onChange={e => setForm({ ...form, numero_serie: e.target.value })}
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              <div className="champ-lab">
                <label>Date de mise en service</label>
                <input
                  type="date"
                  value={form.date_mise_service || ''}
                  onChange={e => setForm({ ...form, date_mise_service: e.target.value })}
                />
              </div>
              <div className="champ-lab">
                <label>Fréquence étalonnage (mois)</label>
                <input
                  type="number"
                  min="1"
                  value={form.frequence_etalonnage_mois || 12}
                  onChange={e => setForm({ ...form, frequence_etalonnage_mois: parseInt(e.target.value) || 12 })}
                />
              </div>
            </div>

            <div className="champ-lab">
              <label>Prochain étalonnage</label>
              <input
                type="date"
                value={form.prochain_etalonnage || ''}
                onChange={e => setForm({ ...form, prochain_etalonnage: e.target.value })}
                required
              />
            </div>

            <div style={{ display: 'flex', gap: '12px', marginTop: '20px' }}>
              <button type="submit" className="btn-lab btn-lab--primary">
                {modal.id ? 'Modifier' : 'Créer'}
              </button>
              <button type="button" className="btn-lab btn-lab--ghost" onClick={() => setModal(null)}>
                Annuler
              </button>
            </div>
          </form>
        </Modal>
      )}
    </>
  );
}