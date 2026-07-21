// frontend/src/portail/Utilisateurs.jsx
import { useEffect, useState } from 'react';
import { api } from '../api.js';
import Modal from '../components/Modal.jsx';
import { 
  FaUsers, 
  FaUserPlus, 
  FaEdit, 
  FaTrash, 
  FaSearch,
  FaUserShield,
  FaUserCog,
  FaUserTie,
  FaUser,
  FaCheckCircle,
  FaTimesCircle,
  FaEnvelope,
  FaPhone
} from 'react-icons/fa';

export default function Utilisateurs({ showToast }) {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [form, setForm] = useState({ 
    nom: '', 
    prenom: '', 
    email: '', 
    telephone: '', 
    mot_de_passe: '', 
    role_code: 'TECHNICIEN', 
    actif: true 
  });

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
        showToast('✅ Utilisateur modifié avec succès', 'success');
      } else {
        await api('/auth/utilisateurs', { method: 'POST', body: JSON.stringify(form) });
        showToast('✅ Utilisateur créé avec succès', 'success');
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
      showToast('✅ Utilisateur supprimé', 'success');
      charger();
    } catch (e) {
      showToast(e.message, 'error');
    }
  };

  const roles = [
    { code: 'ADMIN', label: 'Administrateur', icon: FaUserShield, color: '#dc2626' },
    { code: 'DIRECTION', label: 'Direction', icon: FaUserTie, color: '#7c3aed' },
    { code: 'CHEF_LABO', label: 'Chef de laboratoire', icon: FaUserCog, color: '#1d4ed8' },
    { code: 'TECHNICIEN', label: 'Technicien', icon: FaUser, color: '#0891b2' },
    { code: 'QUALITE', label: 'Qualité', icon: FaUser, color: '#16a34a' },
    { code: 'COMMERCIAL', label: 'Commercial', icon: FaUser, color: '#f59e0b' },
    { code: 'COMPTABLE', label: 'Comptable', icon: FaUser, color: '#b4552d' },
    { code: 'MAGASINIER', label: 'Magasinier', icon: FaUser, color: '#8b5cf6' },
    { code: 'CLIENT', label: 'Client', icon: FaUser, color: '#06b6d4' },
  ];

  const filteredData = data.filter(u =>
    u.nom?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    u.prenom?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    u.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '60px 0' }}>
        <div style={{
          width: '40px',
          height: '40px',
          border: '3px solid #1d4ed8',
          borderTopColor: 'transparent',
          borderRadius: '50%',
          animation: 'spin 0.8s linear infinite',
          margin: '0 auto 16px'
        }}></div>
        <p style={{ color: '#64748b' }}>Chargement des utilisateurs...</p>
      </div>
    );
  }

  return (
    <>
      {/* HEADER */}
      <div style={{ marginBottom: '24px' }}>
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '16px'
        }}>
          <div>
            <h2 style={{ fontSize: '22px', fontWeight: 800, color: '#0f2d80', display: 'flex', alignItems: 'center', gap: '10px' }}>
              <FaUsers style={{ color: '#1d4ed8' }} />
              Utilisateurs
            </h2>
            <p style={{ color: '#64748b', fontSize: '14px', marginTop: '2px' }}>
              {data.length} utilisateur{data.length > 1 ? 's' : ''} enregistré{data.length > 1 ? 's' : ''}
            </p>
          </div>
          <button 
            className="btn-lab btn-lab--primary" 
            onClick={() => { 
              setForm({ nom: '', prenom: '', email: '', telephone: '', mot_de_passe: '', role_code: 'TECHNICIEN', actif: true }); 
              setModal({}); 
            }}
            style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
          >
            <FaUserPlus /> Nouvel utilisateur
          </button>
        </div>

        {/* Barre de recherche */}
        <div style={{
          marginTop: '16px',
          display: 'flex',
          gap: '12px',
          alignItems: 'center',
          background: 'white',
          padding: '8px 16px',
          borderRadius: '10px',
          border: '1px solid #e2e8f0'
        }}>
          <FaSearch style={{ color: '#94a3b8' }} />
          <input
            type="text"
            placeholder="Rechercher un utilisateur par nom, prénom ou email..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            style={{
              border: 'none',
              outline: 'none',
              flex: 1,
              padding: '8px 0',
              fontSize: '14px',
              fontFamily: 'var(--texte)'
            }}
          />
          {searchTerm && (
            <button
              onClick={() => setSearchTerm('')}
              style={{
                background: 'none',
                border: 'none',
                color: '#94a3b8',
                cursor: 'pointer',
                fontSize: '14px'
              }}
            >
              ✕
            </button>
          )}
        </div>
      </div>

      {/* STATISTIQUES RAPIDES */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(120px, 1fr))',
        gap: '12px',
        marginBottom: '20px'
      }}>
        <div className="stat-card">
          <div className="stat-card__value">{data.length}</div>
          <div className="stat-card__label">Total</div>
        </div>
        <div className="stat-card stat-card--success">
          <div className="stat-card__value">{data.filter(u => u.actif).length}</div>
          <div className="stat-card__label">Actifs</div>
        </div>
        <div className="stat-card stat-card--danger">
          <div className="stat-card__value">{data.filter(u => !u.actif).length}</div>
          <div className="stat-card__label">Inactifs</div>
        </div>
      </div>

      {/* TABLEAU */}
      <div className="tableau-lab">
        <table>
          <thead>
            <tr>
              <th>Utilisateur</th>
              <th>Contact</th>
              <th>Rôle</th>
              <th style={{ textAlign: 'center' }}>Statut</th>
              <th style={{ textAlign: 'center' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredData.length > 0 ? (
              filteredData.map(u => {
                const role = roles.find(r => r.code === u.role_code);
                const RoleIcon = role?.icon || FaUser;
                return (
                  <tr key={u.id}>
                    <td>
                      <strong style={{ color: '#0f2d80' }}>{u.nom}</strong>
                      <div style={{ fontSize: '13px', color: '#64748b' }}>{u.prenom}</div>
                    </td>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '13px', color: '#475569' }}>
                        <FaEnvelope size={12} style={{ color: '#94a3b8' }} />
                        {u.email}
                      </div>
                      {u.telephone && (
                        <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '13px', color: '#475569', marginTop: '2px' }}>
                          <FaPhone size={12} style={{ color: '#94a3b8' }} />
                          {u.telephone}
                        </div>
                      )}
                    </td>
                    <td>
                      <span className="badge-lab" style={{
                        background: `${role?.color}20`,
                        color: role?.color || '#475569',
                        fontWeight: 600,
                        fontSize: '11px',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '4px'
                      }}>
                        <RoleIcon size={12} />
                        {role?.label || u.role_code}
                      </span>
                    </td>
                    <td style={{ textAlign: 'center' }}>
                      {u.actif ? (
                        <span className="badge-lab badge-lab--success" style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                          <FaCheckCircle size={12} /> Actif
                        </span>
                      ) : (
                        <span className="badge-lab badge-lab--danger" style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                          <FaTimesCircle size={12} /> Inactif
                        </span>
                      )}
                    </td>
                    <td style={{ textAlign: 'center' }}>
                      <div style={{ display: 'flex', gap: '6px', justifyContent: 'center' }}>
                        <button 
                          className="btn-lab btn-lab--ghost btn-lab--sm" 
                          onClick={() => { setForm({ ...u, mot_de_passe: '' }); setModal({ id: u.id }); }}
                          title="Modifier"
                        >
                          <FaEdit />
                        </button>
                        <button 
                          className="btn-lab btn-lab--danger btn-lab--sm" 
                          onClick={() => handleDelete(u.id, u.nom)}
                          title="Supprimer"
                        >
                          <FaTrash />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan="5" style={{ 
                  textAlign: 'center', 
                  padding: '60px 20px', 
                  color: '#94a3b8' 
                }}>
                  <div style={{ fontSize: '48px', marginBottom: '12px' }}>👤</div>
                  <p style={{ fontSize: '16px', fontWeight: 500 }}>
                    {searchTerm ? 'Aucun utilisateur ne correspond à votre recherche' : 'Aucun utilisateur enregistré'}
                  </p>
                  <p style={{ fontSize: '13px', marginTop: '4px' }}>
                    {searchTerm ? 'Essayez d\'autres termes' : 'Cliquez sur "Nouvel utilisateur" pour commencer'}
                  </p>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* MODAL */}
      {modal && (
        <Modal 
          title={modal.id ? '✏️ Modifier l\'utilisateur' : '👤 Nouvel utilisateur'} 
          onClose={() => setModal(null)}
          maxWidth="600px"
        >
          <form onSubmit={handleSubmit}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              <div className="champ-lab">
                <label>Nom *</label>
                <input 
                  value={form.nom || ''} 
                  onChange={e => setForm({ ...form, nom: e.target.value })} 
                  required 
                  placeholder="Nom"
                />
              </div>
              <div className="champ-lab">
                <label>Prénom *</label>
                <input 
                  value={form.prenom || ''} 
                  onChange={e => setForm({ ...form, prenom: e.target.value })} 
                  required 
                  placeholder="Prénom"
                />
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              <div className="champ-lab">
                <label>Email *</label>
                <input 
                  type="email" 
                  value={form.email || ''} 
                  onChange={e => setForm({ ...form, email: e.target.value })} 
                  required 
                  placeholder="email@example.com"
                />
              </div>
              <div className="champ-lab">
                <label>Téléphone</label>
                <input 
                  value={form.telephone || ''} 
                  onChange={e => setForm({ ...form, telephone: e.target.value })} 
                  placeholder="+237 6XX XX XX XX"
                />
              </div>
            </div>

            {!modal.id && (
              <div className="champ-lab">
                <label>Mot de passe *</label>
                <input 
                  type="password" 
                  value={form.mot_de_passe || ''} 
                  onChange={e => setForm({ ...form, mot_de_passe: e.target.value })} 
                  required={!modal.id} 
                  placeholder="••••••••"
                />
              </div>
            )}

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              <div className="champ-lab">
                <label>Rôle</label>
                <select 
                  value={form.role_code || 'TECHNICIEN'} 
                  onChange={e => setForm({ ...form, role_code: e.target.value })}
                >
                  {roles.map(r => (
                    <option key={r.code} value={r.code}>{r.label}</option>
                  ))}
                </select>
              </div>
              <div className="champ-lab" style={{ flexDirection: 'row', alignItems: 'center', gap: '10px', marginTop: '8px' }}>
                <label style={{ marginBottom: 0 }}>Actif</label>
                <input 
                  type="checkbox" 
                  checked={form.actif !== false} 
                  onChange={e => setForm({ ...form, actif: e.target.checked })} 
                  style={{ width: '18px', height: '18px' }}
                />
              </div>
            </div>

            <div style={{ display: 'flex', gap: '12px', marginTop: '20px' }}>
              <button type="submit" className="btn-lab btn-lab--primary">
                {modal.id ? '💾 Modifier' : '💾 Créer'}
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