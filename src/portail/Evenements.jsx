// frontend/src/portail/Evenements.jsx
import { useState, useEffect } from 'react';
import { api, formatDate } from '../api.js';
import Modal from '../components/Modal.jsx';

export default function GestionEvenements({ showToast }) {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState(null);
  const [form, setForm] = useState({
    titre: '',
    type: 'Séminaire',
    date: '',
    lieu: '',
    description: ''
  });

  const charger = async () => {
    try {
      setLoading(true);
      const result = await api('/evenements');
      setData(result || []);
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
        await api(`/evenements/${modal.id}`, { method: 'PATCH', body: JSON.stringify(form) });
        showToast('Événement modifié', 'success');
      } else {
        await api('/evenements', { method: 'POST', body: JSON.stringify(form) });
        showToast('Événement créé', 'success');
      }
      setModal(null);
      setForm({ titre: '', type: 'Séminaire', date: '', lieu: '', description: '' });
      charger();
    } catch (e) {
      showToast(e.message, 'error');
    }
  };

  const handleDelete = async (id, titre) => {
    if (!confirm(`Supprimer l'événement "${titre}" ?`)) return;
    try {
      await api(`/evenements/${id}`, { method: 'DELETE' });
      showToast('Événement supprimé', 'success');
      charger();
    } catch (e) {
      showToast(e.message, 'error');
    }
  };

  const types = ['Séminaire', 'Conférence', 'Atelier', 'Portes Ouvertes', 'Autre'];

  const typeColors = {
    'Séminaire': '#1d4ed8',
    'Conférence': '#7c3aed',
    'Atelier': '#f59e0b',
    'Portes Ouvertes': '#16a34a',
    'Autre': '#64748b'
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
        <p style={{ color: '#64748b' }}>Chargement des événements...</p>
      </div>
    );
  }

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
        <div>
          <h2 style={{ fontSize: '20px', fontWeight: 700, color: '#0f2d80' }}>📅 Événements</h2>
          <p style={{ fontSize: '13px', color: '#64748b' }}>
            {data.length} événement{data.length > 1 ? 's' : ''} enregistré{data.length > 1 ? 's' : ''}
          </p>
        </div>
        <button className="btn-lab btn-lab--primary" onClick={() => { setForm({ titre: '', type: 'Séminaire', date: '', lieu: '', description: '' }); setModal({}); }}>
          + Nouvel événement
        </button>
      </div>

      <div className="tableau-lab">
        <table>
          <thead>
            <tr>
              <th>Titre</th>
              <th>Type</th>
              <th>Date</th>
              <th>Lieu</th>
              <th style={{ textAlign: 'center' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {data.map(item => (
              <tr key={item.id}>
                <td><strong>{item.titre}</strong></td>
                <td>
                  <span className="badge-lab" style={{
                    background: typeColors[item.type] ? `${typeColors[item.type]}20` : 'var(--bg-light)',
                    color: typeColors[item.type] || 'var(--text-muted)'
                  }}>
                    {item.type}
                  </span>
                </td>
                <td>{formatDate(item.date)}</td>
                <td>{item.lieu}</td>
                <td style={{ textAlign: 'center' }}>
                  <button className="btn-lab btn-lab--ghost btn-lab--sm" onClick={() => { setForm(item); setModal({ id: item.id }); }}>✏️</button>
                  <button className="btn-lab btn-lab--danger btn-lab--sm" onClick={() => handleDelete(item.id, item.titre)}>🗑️</button>
                </td>
              </tr>
            ))}
            {data.length === 0 && (
              <tr><td colSpan="5" style={{ textAlign: 'center', padding: '30px', color: '#94a3b8' }}>Aucun événement</td></tr>
            )}
          </tbody>
        </table>
      </div>

      {modal && (
        <Modal title={modal.id ? 'Modifier l\'événement' : 'Nouvel événement'} onClose={() => setModal(null)}>
          <form onSubmit={handleSubmit}>
            <div className="champ-lab">
              <label>Titre *</label>
              <input value={form.titre || ''} onChange={e => setForm({ ...form, titre: e.target.value })} required />
            </div>
            <div className="champ-lab">
              <label>Type</label>
              <select value={form.type || 'Séminaire'} onChange={e => setForm({ ...form, type: e.target.value })}>
                {types.map(t => <option key={t}>{t}</option>)}
              </select>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              <div className="champ-lab">
                <label>Date</label>
                <input type="date" value={form.date || ''} onChange={e => setForm({ ...form, date: e.target.value })} />
              </div>
              <div className="champ-lab">
                <label>Lieu</label>
                <input value={form.lieu || ''} onChange={e => setForm({ ...form, lieu: e.target.value })} />
              </div>
            </div>
            <div className="champ-lab">
              <label>Description</label>
              <textarea value={form.description || ''} onChange={e => setForm({ ...form, description: e.target.value })} rows="3" />
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