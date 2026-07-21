// frontend/src/portail/Clients.jsx
import { useEffect, useState } from 'react';
import { api } from '../api.js';
import Modal from '../components/Modal.jsx';
import { 
  FaUsers, 
  FaUserPlus, 
  FaEdit, 
  FaTrash, 
  FaSearch, 
  FaBuilding, 
  FaEnvelope, 
  FaPhone, 
  FaMapMarkerAlt,
  FaUserTie,
  FaCode
} from 'react-icons/fa';

export default function Clients({ showToast }) {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [erreur, setErreur] = useState('');
  const [modal, setModal] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [form, setForm] = useState({ 
    raison_sociale: '', 
    email: '', 
    telephone: '', 
    adresse: '', 
    ville: '', 
    type: 'PARTICULIER' 
  });

  const charger = async () => {
    try {
      setLoading(true);
      const result = await api('/clients');
      setData(result || []);
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
        await api(`/clients/${modal.id}`, { method: 'PATCH', body: JSON.stringify(form) });
        showToast('✅ Client modifié avec succès', 'success');
      } else {
        await api('/clients', { method: 'POST', body: JSON.stringify(form) });
        showToast('✅ Client créé avec succès', 'success');
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
      showToast('✅ Client supprimé', 'success');
      charger();
    } catch (e) {
      showToast(e.message, 'error');
    }
  };

  const filteredData = data.filter(c => 
    c.raison_sociale?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.code?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const typeColors = {
    PARTICULIER: { bg: '#dbeafe', color: '#1e40af' },
    ENTREPRISE: { bg: '#dcebdd', color: '#1d5c2e' },
    ONG: { bg: '#fef3c7', color: '#92400e' },
    INSTITUTION: { bg: '#ede9fe', color: '#5b21b6' }
  };

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
        <p style={{ color: '#64748b' }}>Chargement des clients...</p>
      </div>
    );
  }

  if (erreur) return <div style={{ color: '#dc2626', padding: '20px' }}>❌ {erreur}</div>;

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
              Clients
            </h2>
            <p style={{ color: '#64748b', fontSize: '14px', marginTop: '2px' }}>
              {data.length} client{data.length > 1 ? 's' : ''} enregistré{data.length > 1 ? 's' : ''}
            </p>
          </div>
          <button 
            className="btn-lab btn-lab--primary" 
            onClick={() => { 
              setForm({ raison_sociale: '', email: '', telephone: '', adresse: '', ville: '', type: 'PARTICULIER' }); 
              setModal({}); 
            }}
            style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
          >
            <FaUserPlus /> Nouveau client
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
            placeholder="Rechercher un client par nom, code ou email..."
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

      {/* TABLEAU */}
      <div className="tableau-lab">
        <table>
          <thead>
            <tr>
              <th>Code</th>
              <th>Raison sociale</th>
              <th>Contact</th>
              <th>Type</th>
              <th>Ville</th>
              <th style={{ textAlign: 'center' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredData.length > 0 ? (
              filteredData.map(c => (
                <tr key={c.id}>
                  <td style={{ 
                    fontFamily: 'var(--mono)', 
                    fontSize: '12px', 
                    color: '#64748b',
                    fontWeight: 600
                  }}>
                    <FaCode style={{ display: 'inline', marginRight: '4px', fontSize: '11px' }} />
                    {c.code}
                  </td>
                  <td>
                    <strong style={{ color: '#0f2d80' }}>{c.raison_sociale}</strong>
                  </td>
                  <td>
                    <div style={{ fontSize: '13px' }}>
                      {c.email && (
                        <div style={{ display: 'flex', alignItems: 'center', gap: '4px', color: '#475569' }}>
                          <FaEnvelope size={12} style={{ color: '#94a3b8' }} />
                          {c.email}
                        </div>
                      )}
                      {c.telephone && (
                        <div style={{ display: 'flex', alignItems: 'center', gap: '4px', color: '#475569', marginTop: '2px' }}>
                          <FaPhone size={12} style={{ color: '#94a3b8' }} />
                          {c.telephone}
                        </div>
                      )}
                    </div>
                  </td>
                  <td>
                    <span className="badge-lab" style={{
                      background: typeColors[c.type]?.bg || '#e2e8f0',
                      color: typeColors[c.type]?.color || '#475569',
                      fontWeight: 600,
                      fontSize: '11px'
                    }}>
                      {c.type === 'PARTICULIER' ? '👤 Particulier' :
                       c.type === 'ENTREPRISE' ? '🏢 Entreprise' :
                       c.type === 'ONG' ? '🌍 ONG' :
                       c.type === 'INSTITUTION' ? '🏛️ Institution' : c.type}
                    </span>
                  </td>
                  <td>
                    {c.ville && (
                      <span style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '13px', color: '#475569' }}>
                        <FaMapMarkerAlt size={12} style={{ color: '#94a3b8' }} />
                        {c.ville}
                      </span>
                    )}
                  </td>
                  <td style={{ textAlign: 'center' }}>
                    <div style={{ display: 'flex', gap: '6px', justifyContent: 'center' }}>
                      <button 
                        className="btn-lab btn-lab--ghost btn-lab--sm" 
                        onClick={() => { setForm(c); setModal({ id: c.id }); }}
                        title="Modifier"
                      >
                        <FaEdit />
                      </button>
                      <button 
                        className="btn-lab btn-lab--danger btn-lab--sm" 
                        onClick={() => handleDelete(c.id, c.raison_sociale)}
                        title="Supprimer"
                      >
                        <FaTrash />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" style={{ 
                  textAlign: 'center', 
                  padding: '60px 20px', 
                  color: '#94a3b8' 
                }}>
                  <div style={{ fontSize: '48px', marginBottom: '12px' }}>👥</div>
                  <p style={{ fontSize: '16px', fontWeight: 500 }}>
                    {searchTerm ? 'Aucun client ne correspond à votre recherche' : 'Aucun client enregistré'}
                  </p>
                  <p style={{ fontSize: '13px', marginTop: '4px' }}>
                    {searchTerm ? 'Essayez d\'autres termes' : 'Cliquez sur "Nouveau client" pour commencer'}
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
          title={modal.id ? '✏️ Modifier le client' : '👤 Nouveau client'} 
          onClose={() => setModal(null)}
          maxWidth="600px"
        >
          <form onSubmit={handleSubmit}>
            <div className="champ-lab">
              <label>Raison sociale *</label>
              <input 
                value={form.raison_sociale || ''} 
                onChange={e => setForm({ ...form, raison_sociale: e.target.value })} 
                required 
                placeholder="Nom de l'entreprise ou du client"
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              <div className="champ-lab">
                <label>Email</label>
                <input 
                  type="email" 
                  value={form.email || ''} 
                  onChange={e => setForm({ ...form, email: e.target.value })} 
                  placeholder="client@example.com"
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

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              <div className="champ-lab">
                <label>Ville</label>
                <input 
                  value={form.ville || ''} 
                  onChange={e => setForm({ ...form, ville: e.target.value })} 
                  placeholder="Yaoundé, Douala..."
                />
              </div>
              <div className="champ-lab">
                <label>Type</label>
                <select 
                  value={form.type || 'PARTICULIER'} 
                  onChange={e => setForm({ ...form, type: e.target.value })}
                >
                  <option value="PARTICULIER">👤 Particulier</option>
                  <option value="ENTREPRISE">🏢 Entreprise</option>
                  <option value="ONG">🌍 ONG</option>
                  <option value="INSTITUTION">🏛️ Institution</option>
                </select>
              </div>
            </div>

            <div className="champ-lab">
              <label>Adresse</label>
              <input 
                value={form.adresse || ''} 
                onChange={e => setForm({ ...form, adresse: e.target.value })} 
                placeholder="Adresse complète"
              />
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