import { useEffect, useState } from 'react';
import { api } from '../api.js';
import Modal from '../components/Modal.jsx';

export default function Utilisateurs({ showToast }) {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState(null);
  const [form, setForm] = useState({ nom: '', prenom: '', email: '', telephone: '', mot_de_passe: '', role_code: 'TECHNICIEN', actif: true });

  const charger = async () => {
    try {
      setLoading(true);
      const result = await api('/auth/utilisateurs');
      setData(result);
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
        await api(`/auth/utilisateurs/${modal.id}`, { method: 'PATCH', body: JSON.stringify(form) });
        showToast('Utilisateur modifié', 'success');
      } else {
        await api('/auth/utilisateurs', { method: 'POST', body: JSON.stringify(form) });
        showToast('Utilisateur créé', 'success');
      }
      setModal(null);
      setForm({ nom: '', prenom: '', email: '', telephone: '', mot_de_passe: '', role_code: 'TECHNICIEN', actif: true });
      charger();
    } catch (e) {
      showToast(e.message, 'error');
    }
  };

  const handleDelete = async (id, nom) => {
    if (!confirm(`Supprimer l'utilisateur "${nom}" ?`)) return;
    try {
      await api(`/auth/utilisateurs/${id}`, { method: 'DELETE' });
      showToast('Utilisateur supprimé', 'success');
      charger();
    } catch (e) {
      showToast(e.message, 'error');
    }
  };

  if (loading) return <p>Chargement...</p>;

  const roles = [
    { code: 'ADMIN', label: 'Administrateur' },
    { code: 'DIRECTION', label: 'Direction' },
    { code: 'CHEF_LABO', label: 'Chef de laboratoire' },
    { code: 'TECHNICIEN', label: 'Technicien' },
    { code: 'QUALITE', label: 'Qualité' },
    { code: 'COMMERCIAL', label: 'Commercial' },
    { code: 'COMPTABLE', label: 'Comptable' },
    { code: 'MAGASINIER', label: 'Magasinier' },
    { code: 'CLIENT', label: 'Client' },
  ];

  const roleColors = {
    ADMIN: 'badge-lab--danger',
    DIRECTION: 'badge-lab--warning',
    CHEF_LABO: 'badge-lab--primary',
    TECHNICIEN: 'badge-lab--info',
    QUALITE: 'badge-lab--success',
    COMMERCIAL: 'badge-lab--primary',
    COMPTABLE: 'badge-lab--primary',
    MAGASINIER: 'badge-lab--info',
    CLIENT: 'badge-lab--primary',
  };

  return (
    <>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap', gap: '12px' }}>
        <h2 style={{ fontSize: '20px', fontWeight: 700, color: '#0f2d80' }}>👤 Utilisateurs</h2>
        <button className="btn-lab btn-lab--primary" onClick={() => { setForm({ nom: '', prenom: '', email: '', telephone: '', mot_de_passe: '', role_code: 'TECHNICIEN', actif: true }); setModal({}); }}>
          + Nouvel utilisateur
        </button>
      </div>

      <div className="tableau-lab">
        <table>
          <thead>
            <tr>
              <th>Nom</th>
              <th>Prénom</th>
              <th>Email</th>
              <th>Rôle</th>
              <th>Statut</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {data.map(u => (
              <tr key={u.id}>
                <td><strong>{u.nom}</strong></td>
                <td>{u.prenom}</td>
                <td>{u.email}</td>
                <td><span className={`badge-lab ${roleColors[u.role_code] || 'badge-lab--primary'}`}>{u.role_code}</span></td>
                <td>
                  {u.actif ? (
                    <span className="badge-lab badge-lab--success">Actif</span>
                  ) : (
                    <span className="badge-lab badge-lab--danger">Inactif</span>
                  )}
                </td>
                <td>
                  <button className="btn-lab btn-lab--ghost btn-lab--sm" onClick={() => { setForm(u); setModal({ id: u.id }); }}>✏️</button>
                  <button className="btn-lab btn-lab--danger btn-lab--sm" onClick={() => handleDelete(u.id, u.nom)}>🗑️</button>
                </td>
              </tr>
            ))}
            {data.length === 0 && (
              <tr><td colSpan="6" style={{ textAlign: 'center', padding: '30px', color: '#94a3b8' }}>Aucun utilisateur</td></tr>
            )}
          </tbody>
        </table>
      </div>

      {modal && (
        <Modal title={modal.id ? 'Modifier l\'utilisateur' : 'Nouvel utilisateur'} onClose={() => setModal(null)}>
          <form onSubmit={handleSubmit}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              <div className="champ-lab">
                <label>Nom *</label>
                <input value={form.nom || ''} onChange={e => setForm({ ...form, nom: e.target.value })} required />
              </div>
              <div className="champ-lab">
                <label>Prénom *</label>
                <input value={form.prenom || ''} onChange={e => setForm({ ...form, prenom: e.target.value })} required />
              </div>
            </div>
            <div className="champ-lab">
              <label>Email *</label>
              <input type="email" value={form.email || ''} onChange={e => setForm({ ...form, email: e.target.value })} required />
            </div>
            <div className="champ-lab">
              <label>Téléphone</label>
              <input value={form.telephone || ''} onChange={e => setForm({ ...form, telephone: e.target.value })} />
            </div>
            {!modal.id && (
              <div className="champ-lab">
                <label>Mot de passe *</label>
                <input type="password" value={form.mot_de_passe || ''} onChange={e => setForm({ ...form, mot_de_passe: e.target.value })} required={!modal.id} placeholder="••••••••" />
              </div>
            )}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              <div className="champ-lab">
                <label>Rôle</label>
                <select value={form.role_code || 'TECHNICIEN'} onChange={e => setForm({ ...form, role_code: e.target.value })}>
                  {roles.map(r => (
                    <option key={r.code} value={r.code}>{r.label}</option>
                  ))}
                </select>
              </div>
              <div className="champ-lab" style={{ flexDirection: 'row', alignItems: 'center', gap: '10px', marginTop: '8px' }}>
                <label style={{ marginBottom: 0 }}>Actif</label>
                <input type="checkbox" checked={form.actif !== false} onChange={e => setForm({ ...form, actif: e.target.checked })} />
              </div>
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