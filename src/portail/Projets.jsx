// frontend/src/portail/Projets.jsx
import { useState, useEffect } from 'react';
import { api, formatDate } from '../api.js';
import Modal from '../components/Modal.jsx';
import CloudinaryUpload from '../components/CloudinaryUpload.jsx';

export default function GestionProjets({ showToast }) {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState(null);
  const [form, setForm] = useState({
    titre: '',
    statut: 'En cours',
    financement: '',
    description: '',
    image_url: '',
    date_debut: '',
    date_fin: ''
  });

  const charger = async () => {
    try {
      setLoading(true);
      const result = await api('/projets');
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
        await api(`/projets/${modal.id}`, { 
          method: 'PATCH', 
          body: JSON.stringify(form) 
        });
        showToast('✅ Projet modifié avec succès', 'success');
      } else {
        await api('/projets', { 
          method: 'POST', 
          body: JSON.stringify(form) 
        });
        showToast('✅ Projet créé avec succès', 'success');
      }
      setModal(null);
      setForm({ titre: '', statut: 'En cours', financement: '', description: '', image_url: '', date_debut: '', date_fin: '' });
      charger();
    } catch (e) {
      showToast(e.message, 'error');
    }
  };

  const handleDelete = async (id, titre) => {
    if (!confirm(`Supprimer le projet "${titre}" ?`)) return;
    try {
      await api(`/projets/${id}`, { method: 'DELETE' });
      showToast('✅ Projet supprimé', 'success');
      charger();
    } catch (e) {
      showToast(e.message, 'error');
    }
  };

  const handleTogglePublie = async (id, publie) => {
    try {
      await api(`/projets/${id}`, { 
        method: 'PATCH', 
        body: JSON.stringify({ publie: !publie }) 
      });
      showToast(`✅ Projet ${publie ? 'masqué' : 'publié'}`, 'success');
      charger();
    } catch (e) {
      showToast(e.message, 'error');
    }
  };

  const statuts = ['En cours', 'Terminé', 'En préparation'];

  const statutColors = {
    'En cours': '#1d4ed8',
    'Terminé': '#16a34a',
    'En préparation': '#f59e0b'
  };

  const statutBg = {
    'En cours': '#e8edfd',
    'Terminé': '#dcfce7',
    'En préparation': '#fef3c7'
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
        <p style={{ color: '#64748b' }}>Chargement des projets...</p>
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
          <h2 style={{ fontSize: '20px', fontWeight: 700, color: '#0f2d80' }}>📋 Projets de recherche</h2>
          <p style={{ fontSize: '13px', color: '#64748b' }}>
            {data.length} projet{data.length > 1 ? 's' : ''} enregistré{data.length > 1 ? 's' : ''}
          </p>
        </div>
        <button 
          className="btn-lab btn-lab--primary" 
          onClick={() => { 
            setForm({ titre: '', statut: 'En cours', financement: '', description: '', image_url: '', date_debut: '', date_fin: '' }); 
            setModal({}); 
          }}
        >
          + Nouveau projet
        </button>
      </div>

      {/* STATISTIQUES */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))',
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
        {statuts.map(statut => {
          const count = data.filter(p => p.statut === statut).length;
          if (count === 0) return null;
          return (
            <div key={statut} className="stat-card" style={{ borderLeftColor: statutColors[statut] }}>
              <div className="stat-card__value" style={{ color: statutColors[statut] }}>{count}</div>
              <div className="stat-card__label">{statut}</div>
            </div>
          );
        })}
      </div>

      {/* TABLEAU */}
      <div className="tableau-lab">
        <table>
          <thead>
            <tr>
              <th style={{ width: '30px' }}>#</th>
              <th>Titre</th>
              <th>Financement</th>
              <th>Statut</th>
              <th style={{ textAlign: 'center' }}>Dates</th>
              <th style={{ textAlign: 'center' }}>Statut</th>
              <th style={{ textAlign: 'center' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {data.length > 0 ? (
              data.map((item, index) => (
                <tr key={item.id}>
                  <td style={{ 
                    fontFamily: 'var(--mono)', 
                    fontSize: '12px', 
                    color: 'var(--text-muted)',
                    textAlign: 'center'
                  }}>
                    {index + 1}
                  </td>
                  <td>
                    <strong>{item.titre}</strong>
                    {item.description && (
                      <div style={{ 
                        fontSize: '13px', 
                        color: 'var(--text-muted)',
                        maxWidth: '250px',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap'
                      }}>
                        {item.description}
                      </div>
                    )}
                  </td>
                  <td>{item.financement || '—'}</td>
                  <td>
                    <span className="badge-lab" style={{
                      background: statutBg[item.statut] || 'var(--bg-light)',
                      color: statutColors[item.statut] || 'var(--text-muted)'
                    }}>
                      {item.statut}
                    </span>
                  </td>
                  <td style={{ textAlign: 'center', fontSize: '13px' }}>
                    {item.date_debut && formatDate(item.date_debut)}
                    {item.date_debut && item.date_fin && ' → '}
                    {item.date_fin && formatDate(item.date_fin)}
                    {!item.date_debut && !item.date_fin && '—'}
                  </td>
                  <td style={{ textAlign: 'center' }}>
                    <button
                      onClick={() => handleTogglePublie(item.id, item.publie)}
                      className={`badge-lab ${item.publie ? 'badge-lab--success' : 'badge-lab--danger'}`}
                      style={{ 
                        cursor: 'pointer',
                        border: 'none',
                        fontFamily: 'var(--texte)',
                        fontSize: '11px'
                      }}
                    >
                      {item.publie ? '✅ Publié' : '❌ Masqué'}
                    </button>
                  </td>
                  <td style={{ textAlign: 'center' }}>
                    <div style={{ display: 'flex', gap: '4px', justifyContent: 'center', flexWrap: 'wrap' }}>
                      <button
                        className="btn-lab btn-lab--ghost btn-lab--xs"
                        onClick={() => { 
                          setForm(item); 
                          setModal({ id: item.id }); 
                        }}
                        title="Modifier"
                      >
                        ✏️
                      </button>
                      <button
                        className="btn-lab btn-lab--danger btn-lab--xs"
                        onClick={() => handleDelete(item.id, item.titre)}
                        title="Supprimer"
                      >
                        🗑️
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="7" style={{ 
                  textAlign: 'center', 
                  padding: '40px 20px', 
                  color: '#94a3b8' 
                }}>
                  <div style={{ fontSize: '40px', marginBottom: '8px' }}>📋</div>
                  <p>Aucun projet enregistré</p>
                  <p style={{ fontSize: '13px' }}>
                    Cliquez sur "Nouveau projet" pour commencer
                  </p>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* MODAL - Création/Modification */}
      {modal && (
        <Modal 
          title={modal.id ? 'Modifier le projet' : 'Nouveau projet'} 
          onClose={() => setModal(null)}
          maxWidth="650px"
        >
          <form onSubmit={handleSubmit}>
            <div className="champ-lab">
              <label>Titre *</label>
              <input 
                value={form.titre || ''} 
                onChange={e => setForm({ ...form, titre: e.target.value })} 
                required 
                placeholder="Ex: Intensification agricole durable..."
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              <div className="champ-lab">
                <label>Statut</label>
                <select 
                  value={form.statut || 'En cours'} 
                  onChange={e => setForm({ ...form, statut: e.target.value })}
                >
                  {statuts.map(s => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
              </div>
              <div className="champ-lab">
                <label>Financement</label>
                <input 
                  value={form.financement || ''} 
                  onChange={e => setForm({ ...form, financement: e.target.value })} 
                  placeholder="Ex: MINADER - 2024-2027"
                />
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              <div className="champ-lab">
                <label>Date de début</label>
                <input 
                  type="date" 
                  value={form.date_debut || ''} 
                  onChange={e => setForm({ ...form, date_debut: e.target.value })} 
                />
              </div>
              <div className="champ-lab">
                <label>Date de fin</label>
                <input 
                  type="date" 
                  value={form.date_fin || ''} 
                  onChange={e => setForm({ ...form, date_fin: e.target.value })} 
                />
              </div>
            </div>

            <div className="champ-lab">
              <label>Description</label>
              <textarea 
                value={form.description || ''} 
                onChange={e => setForm({ ...form, description: e.target.value })} 
                rows="4"
                placeholder="Description détaillée du projet..."
              />
            </div>

            {/* Upload Image */}
            <div className="champ-lab">
              <label>Image (optionnel)</label>
              <CloudinaryUpload 
                folder="icerd/projets"
                onUpload={(url) => setForm({ ...form, image_url: url })}
                onError={(msg) => showToast(msg, 'error')}
              />
              {form.image_url && (
                <div style={{ marginTop: '8px', display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <img 
                    src={form.image_url} 
                    alt="Aperçu" 
                    style={{ 
                      width: '80px', 
                      height: '80px', 
                      objectFit: 'cover', 
                      borderRadius: '6px',
                      border: '1px solid var(--border-color)'
                    }} 
                  />
                  <button 
                    type="button"
                    className="btn-lab btn-lab--danger btn-lab--sm"
                    onClick={() => setForm({ ...form, image_url: '' })}
                  >
                    Supprimer
                  </button>
                </div>
              )}
            </div>

            <div style={{ display: 'flex', gap: '12px', marginTop: '16px' }}>
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