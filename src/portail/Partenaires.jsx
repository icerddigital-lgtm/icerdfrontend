// frontend/src/portail/Partenaires.jsx
import { useState, useEffect } from 'react';
import { api } from '../api.js';
import Modal from '../components/Modal.jsx';
import CloudinaryUpload from '../components/CloudinaryUpload.jsx';

export default function GestionPartenaires({ showToast }) {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState(null);
  const [filtreType, setFiltreType] = useState('TOUTES');
  const [form, setForm] = useState({
    nom: '',
    type: 'Institutionnel',
    description: '',
    site: '',
    email: '',
    telephone: '',
    logo_url: '',
    adresse: ''
  });

  const types = ['Institutionnel', 'International', 'Académique', 'Privé', 'ONG', 'Association'];

  const typeColors = {
    'Institutionnel': '#1d4ed8',
    'International': '#7c3aed',
    'Académique': '#16a34a',
    'Privé': '#b4552d',
    'ONG': '#0891b2',
    'Association': '#d97706'
  };

  const typeBg = {
    'Institutionnel': '#e8edfd',
    'International': '#ede9fe',
    'Académique': '#dcfce7',
    'Privé': '#fdf0ea',
    'ONG': '#cffafe',
    'Association': '#fef3c7'
  };

  const charger = async () => {
    try {
      setLoading(true);
      const result = await api('/partenaires');
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
        await api(`/partenaires/${modal.id}`, { method: 'PATCH', body: JSON.stringify(form) });
        showToast('✅ Partenaire modifié avec succès', 'success');
      } else {
        await api('/partenaires', { method: 'POST', body: JSON.stringify(form) });
        showToast('✅ Partenaire créé avec succès', 'success');
      }
      setModal(null);
      resetForm();
      charger();
    } catch (e) {
      showToast(e.message, 'error');
    }
  };

  const handleDelete = async (id, nom) => {
    if (!confirm(`Supprimer définitivement le partenaire "${nom}" ?`)) return;
    try {
      await api(`/partenaires/${id}`, { method: 'DELETE' });
      showToast('✅ Partenaire supprimé', 'success');
      charger();
    } catch (e) {
      showToast(e.message, 'error');
    }
  };

  const handleTogglePublie = async (id, publie) => {
    try {
      await api(`/partenaires/${id}`, {
        method: 'PATCH',
        body: JSON.stringify({ publie: !publie })
      });
      showToast(`✅ Partenaire ${publie ? 'masqué' : 'publié'}`, 'success');
      charger();
    } catch (e) {
      showToast(e.message, 'error');
    }
  };

  const resetForm = () => {
    setForm({
      nom: '',
      type: 'Institutionnel',
      description: '',
      site: '',
      email: '',
      telephone: '',
      logo_url: '',
      adresse: ''
    });
  };

  const dataFiltree = filtreType === 'TOUTES'
    ? data
    : data.filter(item => item.type === filtreType);

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
        <p style={{ color: '#64748b' }}>Chargement des partenaires...</p>
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
          <h2 style={{ fontSize: '20px', fontWeight: 700, color: '#0f2d80' }}>🤝 Partenaires</h2>
          <p style={{ fontSize: '13px', color: '#64748b' }}>
            {data.length} partenaire{data.length > 1 ? 's' : ''} enregistré{data.length > 1 ? 's' : ''}
          </p>
        </div>
        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
          <select
            value={filtreType}
            onChange={e => setFiltreType(e.target.value)}
            style={{
              padding: '8px 14px',
              borderRadius: '8px',
              border: '1.5px solid var(--border-color)',
              fontSize: '13px',
              background: 'white',
              cursor: 'pointer'
            }}
          >
            <option value="TOUTES">Tous les types</option>
            {types.map(t => (
              <option key={t} value={t}>{t}</option>
            ))}
          </select>
          <button className="btn-lab btn-lab--primary" onClick={() => { resetForm(); setModal({}); }}>
            + Nouveau partenaire
          </button>
        </div>
      </div>

      {/* STATISTIQUES */}
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
          <div className="stat-card__value">{data.filter(p => p.publie).length}</div>
          <div className="stat-card__label">Publiés</div>
        </div>
        <div className="stat-card stat-card--danger">
          <div className="stat-card__value">{data.filter(p => !p.publie).length}</div>
          <div className="stat-card__label">Masqués</div>
        </div>
        {types.map(type => {
          const count = data.filter(p => p.type === type).length;
          if (count === 0) return null;
          return (
            <div key={type} className="stat-card" style={{ borderLeftColor: typeColors[type] }}>
              <div className="stat-card__value" style={{ color: typeColors[type] }}>{count}</div>
              <div className="stat-card__label">{type}</div>
            </div>
          );
        })}
      </div>

      {/* TABLEAU */}
      <div className="tableau-lab">
        <table>
          <thead>
            <tr>
              <th style={{ width: '50px', textAlign: 'center' }}>Logo</th>
              <th>Nom</th>
              <th>Type</th>
              <th>Description</th>
              <th>Contact</th>
              <th style={{ textAlign: 'center' }}>Statut</th>
              <th style={{ textAlign: 'center' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {dataFiltree.length > 0 ? (
              dataFiltree.map(item => (
                <tr key={item.id}>
                  <td style={{ textAlign: 'center', verticalAlign: 'middle' }}>
                    <div style={{
                      width: '40px',
                      height: '40px',
                      borderRadius: '6px',
                      background: '#f8fafc',
                      border: '1px solid #e2e8f0',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      overflow: 'hidden',
                      margin: '0 auto'
                    }}>
                      {item.logo_url ? (
                        <img
                          src={item.logo_url}
                          alt={item.nom}
                          style={{ width: '100%', height: '100%', objectFit: 'contain', padding: '2px' }}
                        />
                      ) : (
                        <span style={{ fontSize: '16px' }}>🤝</span>
                      )}
                    </div>
                  </td>
                  <td><strong>{item.nom}</strong></td>
                  <td>
                    <span className="badge-lab" style={{
                      background: typeBg[item.type] || 'var(--bg-light)',
                      color: typeColors[item.type] || 'var(--text-muted)',
                      fontWeight: 600
                    }}>
                      {item.type}
                    </span>
                  </td>
                  <td style={{ fontSize: '13px', color: '#334155', maxWidth: '200px' }}>
                    {item.description || '—'}
                  </td>
                  <td>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '2px', fontSize: '12px' }}>
                      {item.email && <span style={{ color: '#64748b' }}>✉️ {item.email}</span>}
                      {item.telephone && <span style={{ color: '#64748b' }}>📞 {item.telephone}</span>}
                      {item.site && (
                        <a
                          href={item.site}
                          target="_blank"
                          rel="noopener noreferrer"
                          style={{ color: 'var(--blue-brand)' }}
                        >
                          🔗 Site
                        </a>
                      )}
                    </div>
                  </td>
                  <td style={{ textAlign: 'center' }}>
                    <button
                      onClick={() => handleTogglePublie(item.id, item.publie)}
                      className={`badge-lab ${item.publie ? 'badge-lab--success' : 'badge-lab--danger'}`}
                      style={{
                        cursor: 'pointer',
                        border: 'none',
                        fontFamily: 'var(--texte)',
                        fontSize: '10px',
                        padding: '2px 10px'
                      }}
                    >
                      {item.publie ? '✅' : '❌'}
                    </button>
                  </td>
                  <td style={{ textAlign: 'center' }}>
                    <button
                      className="btn-lab btn-lab--ghost btn-lab--sm"
                      style={{ marginRight: '4px' }}
                      onClick={() => { setForm(item); setModal({ id: item.id }); }}
                      title="Modifier"
                    >
                      ✏️
                    </button>
                    <button
                      className="btn-lab btn-lab--danger btn-lab--sm"
                      onClick={() => handleDelete(item.id, item.nom)}
                      title="Supprimer"
                    >
                      🗑️
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="7" style={{ textAlign: 'center', padding: '30px', color: '#94a3b8' }}>
                  {filtreType === 'TOUTES' ? 'Aucun partenaire enregistré' : `Aucun partenaire de type "${filtreType}"`}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* MODAL */}
      {modal && (
        <Modal
          title={modal.id ? 'Modifier le partenaire' : 'Créer un nouveau partenaire'}
          onClose={() => setModal(null)}
          maxWidth="600px"
        >
          <form onSubmit={handleSubmit}>
            <div className="champ-lab">
              <label>Nom du partenaire *</label>
              <input
                value={form.nom || ''}
                onChange={e => setForm({ ...form, nom: e.target.value })}
                required
                placeholder="Ex: Université de Yaoundé I"
              />
            </div>

            <div className="champ-lab">
              <label>Type de partenariat</label>
              <select
                value={form.type || 'Institutionnel'}
                onChange={e => setForm({ ...form, type: e.target.value })}
              >
                {types.map(t => <option key={t} value={t}>{t}</option>)}
              </select>
            </div>

            <div className="champ-lab">
              <label>Logo / Image</label>
              <CloudinaryUpload
                folder="icerd/partenaires"
                onUpload={(url) => setForm({ ...form, logo_url: url })}
                onError={(msg) => showToast(msg, 'error')}
              />
              {form.logo_url && (
                <div style={{ marginTop: '8px', display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <img
                    src={form.logo_url}
                    alt="Aperçu"
                    style={{
                      width: '60px',
                      height: '60px',
                      objectFit: 'contain',
                      borderRadius: '6px',
                      border: '1px solid var(--border-color)',
                      background: 'white'
                    }}
                  />
                  <button
                    type="button"
                    className="btn-lab btn-lab--danger btn-lab--sm"
                    onClick={() => setForm({ ...form, logo_url: '' })}
                  >
                    Supprimer
                  </button>
                </div>
              )}
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              <div className="champ-lab">
                <label>Site web</label>
                <input
                  type="url"
                  value={form.site || ''}
                  onChange={e => setForm({ ...form, site: e.target.value })}
                  placeholder="https://..."
                />
              </div>
              <div className="champ-lab">
                <label>Email</label>
                <input
                  type="email"
                  value={form.email || ''}
                  onChange={e => setForm({ ...form, email: e.target.value })}
                  placeholder="contact@partenaire.cm"
                />
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              <div className="champ-lab">
                <label>Téléphone</label>
                <input
                  value={form.telephone || ''}
                  onChange={e => setForm({ ...form, telephone: e.target.value })}
                  placeholder="+237 6XX XX XX XX"
                />
              </div>
              <div className="champ-lab">
                <label>Adresse</label>
                <input
                  value={form.adresse || ''}
                  onChange={e => setForm({ ...form, adresse: e.target.value })}
                  placeholder="Yaoundé, Cameroun"
                />
              </div>
            </div>

            <div className="champ-lab">
              <label>Description</label>
              <textarea
                value={form.description || ''}
                onChange={e => setForm({ ...form, description: e.target.value })}
                rows="3"
                placeholder="Description des activités menées en commun..."
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