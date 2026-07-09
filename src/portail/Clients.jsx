import { useEffect, useState } from 'react';
import { api } from '../api.js';
import Modal from '../components/Modal.jsx';

export default function Clients({ showToast }) {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [erreur, setErreur] = useState('');
  const [modal, setModal] = useState(null);
  const [form, setForm] = useState({ raison_sociale: '', email: '', telephone: '', adresse: '', ville: '', type: 'PARTICULIER' });

  const charger = async () => {
    try {
      setLoading(true);
      const result = await api('/clients');
      setData(result);
    } catch (e) {
      setErreur(e.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { charger(); }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (modal?.id) {
        // Modification
        await api(`/clients/${modal.id}`, { method: 'PATCH', body: JSON.stringify(form) });
        showToast('Client modifié avec succès', 'success');
      } else {
        // Création
        await api('/clients', { method: 'POST', body: JSON.stringify(form) });
        showToast('Client créé avec succès', 'success');
      }
      setModal(null);
      setForm({ raison_sociale: '', email: '', telephone: '', adresse: '', ville: '', type: 'PARTICULIER' });
      charger();
    } catch (e) {
      showToast(e.message, 'error');
    }
  };

  const handleDelete = async (id, nom) => {
    if (!confirm(`Supprimer le client "${nom}" ?`)) return;
    try {
      await api(`/clients/${id}`, { method: 'DELETE' });
      showToast('Client supprimé', 'success');
      charger();
    } catch (e) {
      showToast(e.message, 'error');
    }
  };

  if (loading) return <p>Chargement...</p>;
  if (erreur) return <div style={{ color: '#dc2626' }}>❌ {erreur}</div>;

  return (
    <>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap', gap: '12px' }}>
        <h2 style={{ fontSize: '20px', fontWeight: 700, color: '#0f2d80' }}>👥 Clients</h2>
        <button className="btn-lab btn-lab--primary" onClick={() => { setForm({ raison_sociale: '', email: '', telephone: '', adresse: '', ville: '', type: 'PARTICULIER' }); setModal({}); }}>
          + Nouveau client
        </button>
      </div>

      <div className="tableau-lab">
        <table>
          <thead>
            <tr>
              <th>Code</th>
              <th>Raison sociale</th>
              <th>Email</th>
              <th>Téléphone</th>
              <th>Ville</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {data.map(c => (
              <tr key={c.id}>
                <td style={{ fontFamily: 'var(--mono)', fontSize: '12px', color: 'var(--text-muted)' }}>{c.code}</td>
                <td><strong>{c.raison_sociale}</strong></td>
                <td>{c.email}</td>
                <td>{c.telephone}</td>
                <td>{c.ville}</td>
                <td>
                  <button className="btn-lab btn-lab--ghost btn-lab--sm" onClick={() => { setForm(c); setModal({ id: c.id }); }}>✏️</button>
                  <button className="btn-lab btn-lab--danger btn-lab--sm" onClick={() => handleDelete(c.id, c.raison_sociale)}>🗑️</button>
                </td>
              </tr>
            ))}
            {data.length === 0 && (
              <tr><td colSpan="6" style={{ textAlign: 'center', padding: '30px', color: '#94a3b8' }}>Aucun client enregistré</td></tr>
            )}
          </tbody>
        </table>
      </div>

      {modal && (
        <Modal title={modal.id ? 'Modifier le client' : 'Nouveau client'} onClose={() => setModal(null)}>
          <form onSubmit={handleSubmit}>
            <div className="champ-lab">
              <label>Raison sociale *</label>
              <input value={form.raison_sociale || ''} onChange={e => setForm({ ...form, raison_sociale: e.target.value })} required />
            </div>
            <div className="champ-lab">
              <label>Email</label>
              <input type="email" value={form.email || ''} onChange={e => setForm({ ...form, email: e.target.value })} />
            </div>
            <div className="champ-lab">
              <label>Téléphone</label>
              <input value={form.telephone || ''} onChange={e => setForm({ ...form, telephone: e.target.value })} />
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              <div className="champ-lab">
                <label>Ville</label>
                <input value={form.ville || ''} onChange={e => setForm({ ...form, ville: e.target.value })} />
              </div>
              <div className="champ-lab">
                <label>Type</label>
                <select value={form.type || 'PARTICULIER'} onChange={e => setForm({ ...form, type: e.target.value })}>
                  <option value="PARTICULIER">Particulier</option>
                  <option value="ENTREPRISE">Entreprise</option>
                  <option value="ONG">ONG</option>
                  <option value="INSTITUTION">Institution</option>
                </select>
              </div>
            </div>
            <div className="champ-lab">
              <label>Adresse</label>
              <input value={form.adresse || ''} onChange={e => setForm({ ...form, adresse: e.target.value })} />
            </div>
            <div style={{ display: 'flex', gap: '12px', marginTop: '20px' }}>
              <button type="submit" className="btn-lab btn-lab--primary">{modal.id ? 'Modifier' : 'Créer'}</button>
              <button type="button" className="btn-lab btn-lab--ghost" onClick={() => setModal(null)}>Annuler</button>
            </div>
          </form>
        </Modal>
      )}
    </>
  );
}