// frontend/src/portail/Carrieres.jsx
import { useState, useEffect } from 'react';
import { api, formatDate } from '../api.js';
import Modal from '../components/Modal.jsx';
import CloudinaryUpload from '../components/CloudinaryUpload.jsx';

export default function GestionCarrieres({ showToast }) {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState(null);
  const [form, setForm] = useState({
    titre: '',
    type: 'CDI',
    lieu: 'Yaoundé',
    date_publication: '',   // ✅ Changé de 'date' à 'date_publication'
    date_limite: '',        // ✅ Ajouté pour la date limite
    description: '',
    contact: 'recrutement@icerd.cm',
    image_url: ''
  });

  const types = ['CDI', 'CDD', 'Stage', 'Alternance', 'Freelance', 'Volontariat'];

  const typeColors = {
    'CDI': '#1d4ed8',
    'CDD': '#f59e0b',
    'Stage': '#16a34a',
    'Alternance': '#7c3aed',
    'Freelance': '#0891b2',
    'Volontariat': '#b4552d'
  };

  const typeBg = {
    'CDI': '#e8edfd',
    'CDD': '#fef3c7',
    'Stage': '#dcfce7',
    'Alternance': '#ede9fe',
    'Freelance': '#cffafe',
    'Volontariat': '#fdf0ea'
  };

  const charger = async () => {
    try {
      setLoading(true);
      const result = await api('/carrieres');
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
        await api(`/carrieres/${modal.id}`, { 
          method: 'PATCH', 
          body: JSON.stringify(form) 
        });
        showToast('✅ Offre modifiée avec succès', 'success');
      } else {
        await api('/carrieres', { 
          method: 'POST', 
          body: JSON.stringify({
            ...form,
            date_publication: form.date_publication || new Date().toISOString().split('T')[0],
            date_limite: form.date_limite || null
          }) 
        });
        showToast('✅ Offre créée avec succès', 'success');
      }
      setModal(null);
      resetForm();
      charger();
    } catch (e) {
      showToast(e.message, 'error');
    }
  };

  const handleDelete = async (id, titre) => {
    if (!confirm(`Supprimer l'offre "${titre}" ?`)) return;
    try {
      await api(`/carrieres/${id}`, { method: 'DELETE' });
      showToast('✅ Offre supprimée', 'success');
      charger();
    } catch (e) {
      showToast(e.message, 'error');
    }
  };

  const handleTogglePublie = async (id, publie) => {
    try {
      await api(`/carrieres/${id}`, {
        method: 'PATCH',
        body: JSON.stringify({ publie: !publie })
      });
      showToast(`✅ Offre ${publie ? 'masquée' : 'publiée'}`, 'success');
      charger();
    } catch (e) {
      showToast(e.message, 'error');
    }
  };

  const resetForm = () => {
    setForm({
      titre: '',
      type: 'CDI',
      lieu: 'Yaoundé',
      date_publication: '',
      date_limite: '',
      description: '',
      contact: 'recrutement@icerd.cm',
      image_url: ''
    });
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
        <p style={{ color: '#64748b' }}>Chargement des offres...</p>
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
          <h2 style={{ fontSize: '20px', fontWeight: 700, color: '#0f2d80' }}>💼 Offres d'emploi</h2>
          <p style={{ fontSize: '13px', color: '#64748b' }}>
            {data.length} offre{data.length > 1 ? 's' : ''} enregistrée{data.length > 1 ? 's' : ''}
          </p>
        </div>
        <button 
          className="btn-lab btn-lab--primary" 
          onClick={() => { resetForm(); setModal({}); }}
        >
          + Nouvelle offre
        </button>
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
          <div className="stat-card__label">Publiées</div>
        </div>
        <div className="stat-card stat-card--danger">
          <div className="stat-card__value">{data.filter(p => !p.publie).length}</div>
          <div className="stat-card__label">Masquées</div>
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
              <th>Titre</th>
              <th>Type</th>
              <th>Lieu</th>
              <th>Date limite</th>
              <th style={{ textAlign: 'center' }}>Statut</th>
              <th style={{ textAlign: 'center' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {data.length > 0 ? (
              data.map(item => {
                const isExpired = item.date_limite && new Date(item.date_limite) < new Date();
                return (
                  <tr key={item.id} style={{ opacity: isExpired ? 0.6 : 1 }}>
                    <td>
                      <strong>{item.titre}</strong>
                      {isExpired && (
                        <span style={{ fontSize: '11px', color: '#dc2626', marginLeft: '8px' }}>
                          (expirée)
                        </span>
                      )}
                    </td>
                    <td>
                      <span className="badge-lab" style={{
                        background: typeBg[item.type] || 'var(--bg-light)',
                        color: typeColors[item.type] || 'var(--text-muted)',
                        fontWeight: 600
                      }}>
                        {item.type}
                      </span>
                    </td>
                    <td>{item.lieu}</td>
                    <td style={{ fontSize: '13px' }}>
                      {item.date_limite ? formatDate(item.date_limite) : '—'}
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
                        onClick={() => handleDelete(item.id, item.titre)}
                        title="Supprimer"
                      >
                        🗑️
                      </button>
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan="6" style={{ textAlign: 'center', padding: '30px', color: '#94a3b8' }}>
                  Aucune offre enregistrée
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* MODAL */}
      {modal && (
        <Modal 
          title={modal.id ? 'Modifier l\'offre' : 'Nouvelle offre'} 
          onClose={() => setModal(null)}
          maxWidth="600px"
        >
          <form onSubmit={handleSubmit}>
            <div className="champ-lab">
              <label>Titre *</label>
              <input 
                value={form.titre || ''} 
                onChange={e => setForm({ ...form, titre: e.target.value })} 
                required 
                placeholder="Ex: Chimiste Analyste"
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              <div className="champ-lab">
                <label>Type de contrat</label>
                <select 
                  value={form.type || 'CDI'} 
                  onChange={e => setForm({ ...form, type: e.target.value })}
                >
                  {types.map(t => <option key={t} value={t}>{t}</option>)}
                </select>
              </div>
              <div className="champ-lab">
                <label>Lieu</label>
                <input 
                  value={form.lieu || 'Yaoundé'} 
                  onChange={e => setForm({ ...form, lieu: e.target.value })} 
                  placeholder="Yaoundé, Douala..."
                />
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              <div className="champ-lab">
                <label>Date de publication</label>
                <input 
                  type="date" 
                  value={form.date_publication || ''} 
                  onChange={e => setForm({ ...form, date_publication: e.target.value })} 
                />
              </div>
              <div className="champ-lab">
                <label>Date limite</label>
                <input 
                  type="date" 
                  value={form.date_limite || ''} 
                  onChange={e => setForm({ ...form, date_limite: e.target.value })} 
                />
              </div>
            </div>

            <div className="champ-lab">
              <label>Description *</label>
              <textarea 
                value={form.description || ''} 
                onChange={e => setForm({ ...form, description: e.target.value })} 
                rows="4"
                required 
                placeholder="Description détaillée de l'offre..."
              />
            </div>

            <div className="champ-lab">
              <label>Contact (email)</label>
              <input 
                type="email"
                value={form.contact || 'recrutement@icerd.cm'} 
                onChange={e => setForm({ ...form, contact: e.target.value })} 
                placeholder="recrutement@icerd.cm"
              />
            </div>

            <div className="champ-lab">
              <label>Image (optionnel)</label>
              <CloudinaryUpload 
                folder="icerd/carrieres"
                onUpload={(url) => setForm({ ...form, image_url: url })}
                onError={(msg) => showToast(msg, 'error')}
              />
              {form.image_url && (
                <div style={{ marginTop: '8px', display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <img 
                    src={form.image_url} 
                    alt="Aperçu" 
                    style={{ 
                      width: '60px', 
                      height: '60px', 
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