// frontend/src/portail/Actualites.jsx
import { useState, useEffect } from 'react';
import { api, formatDate } from '../api.js';
import Modal from '../components/Modal.jsx';
import CloudinaryUpload from '../components/CloudinaryUpload.jsx';

export default function GestionActualites({ showToast }) {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState(null);
  const [form, setForm] = useState({
    titre: '',
    categorie: 'Annonce',
    date_publication: '',
    resume: '',
    contenu: '',
    image_url: '',
    lien: '',
    auteur: ''
  });

  const charger = async () => {
    try {
      setLoading(true);
      const result = await api('/actualites');
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
        await api(`/actualites/${modal.id}`, { 
          method: 'PATCH', 
          body: JSON.stringify(form) 
        });
        showToast('✅ Actualité modifiée avec succès', 'success');
      } else {
        await api('/actualites', { 
          method: 'POST', 
          body: JSON.stringify(form) 
        });
        showToast('✅ Actualité créée avec succès', 'success');
      }
      setModal(null);
      setForm({ titre: '', categorie: 'Annonce', date_publication: '', resume: '', contenu: '', image_url: '', lien: '', auteur: '' });
      charger();
    } catch (e) {
      showToast(e.message, 'error');
    }
  };

  const handleDelete = async (id, titre) => {
    if (!confirm(`Supprimer l'actualité "${titre}" ?`)) return;
    try {
      await api(`/actualites/${id}`, { method: 'DELETE' });
      showToast('✅ Actualité supprimée', 'success');
      charger();
    } catch (e) {
      showToast(e.message, 'error');
    }
  };

  const handleTogglePublie = async (id, publie) => {
    try {
      await api(`/actualites/${id}`, { 
        method: 'PATCH', 
        body: JSON.stringify({ publie: !publie }) 
      });
      showToast(`✅ Actualité ${publie ? 'masquée' : 'publiée'}`, 'success');
      charger();
    } catch (e) {
      showToast(e.message, 'error');
    }
  };

  const categories = ['Annonce', 'Événement', 'Publication', 'Projet', 'Communiqué'];

  const categoryColors = {
    'Annonce': '#1d4ed8',
    'Événement': '#db2777',
    'Publication': '#16a34a',
    'Projet': '#d97706',
    'Communiqué': '#2563eb'
  };

  const categoryBg = {
    'Annonce': '#e8edfd',
    'Événement': '#fce7f3',
    'Publication': '#dcfce7',
    'Projet': '#fef3c7',
    'Communiqué': '#dbeafe'
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
        <p style={{ color: '#64748b' }}>Chargement des actualités...</p>
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
          <h2 style={{ fontSize: '20px', fontWeight: 700, color: '#0f2d80' }}>📰 Actualités</h2>
          <p style={{ fontSize: '13px', color: '#64748b' }}>
            {data.length} actualité{data.length > 1 ? 's' : ''} enregistrée{data.length > 1 ? 's' : ''}
          </p>
        </div>
        <button 
          className="btn-lab btn-lab--primary" 
          onClick={() => { 
            setForm({ titre: '', categorie: 'Annonce', date_publication: '', resume: '', contenu: '', image_url: '', lien: '', auteur: '' }); 
            setModal({}); 
          }}
        >
          + Nouvelle actualité
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
          <div className="stat-card__label">Publiées</div>
        </div>
        <div className="stat-card stat-card--danger">
          <div className="stat-card__value">{data.filter(p => !p.publie).length}</div>
          <div className="stat-card__label">Masquées</div>
        </div>
        {categories.map(cat => {
          const count = data.filter(p => p.categorie === cat).length;
          if (count === 0) return null;
          return (
            <div key={cat} className="stat-card" style={{ borderLeftColor: categoryColors[cat] }}>
              <div className="stat-card__value" style={{ color: categoryColors[cat] }}>{count}</div>
              <div className="stat-card__label">{cat}</div>
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
              <th>Catégorie</th>
              <th style={{ textAlign: 'center' }}>Date</th>
              <th style={{ textAlign: 'center' }}>Auteur</th>
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
                    {item.resume && (
                      <div style={{ 
                        fontSize: '13px', 
                        color: 'var(--text-muted)',
                        maxWidth: '250px',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap'
                      }}>
                        {item.resume}
                      </div>
                    )}
                    {item.image_url && (
                      <img 
                        src={item.image_url} 
                        alt={item.titre} 
                        style={{ 
                          width: '40px', 
                          height: '40px', 
                          objectFit: 'cover',
                          borderRadius: '4px',
                          marginTop: '4px'
                        }} 
                      />
                    )}
                  </td>
                  <td>
                    <span className="badge-lab" style={{
                      background: categoryBg[item.categorie] || 'var(--bg-light)',
                      color: categoryColors[item.categorie] || 'var(--text-muted)'
                    }}>
                      {item.categorie}
                    </span>
                  </td>
                  <td style={{ textAlign: 'center', fontSize: '13px' }}>
                    {formatDate(item.date_publication)}
                  </td>
                  <td style={{ textAlign: 'center', fontSize: '13px' }}>
                    {item.auteur || 'ICERD'}
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
                      {item.publie ? '✅ Publiée' : '❌ Masquée'}
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
                  <div style={{ fontSize: '40px', marginBottom: '8px' }}>📰</div>
                  <p>Aucune actualité enregistrée</p>
                  <p style={{ fontSize: '13px' }}>
                    Cliquez sur "Nouvelle actualité" pour commencer
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
          title={modal.id ? 'Modifier l\'actualité' : 'Nouvelle actualité'} 
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
                placeholder="Ex: ICERD participe au Salon International..."
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              <div className="champ-lab">
                <label>Catégorie</label>
                <select 
                  value={form.categorie || 'Annonce'} 
                  onChange={e => setForm({ ...form, categorie: e.target.value })}
                >
                  {categories.map(c => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>
              <div className="champ-lab">
                <label>Date de publication</label>
                <input 
                  type="date" 
                  value={form.date_publication || ''} 
                  onChange={e => setForm({ ...form, date_publication: e.target.value })} 
                />
              </div>
            </div>

            <div className="champ-lab">
              <label>Résumé *</label>
              <textarea 
                value={form.resume || ''} 
                onChange={e => setForm({ ...form, resume: e.target.value })} 
                rows="3"
                required
                placeholder="Résumé court de l'actualité..."
              />
            </div>

            <div className="champ-lab">
              <label>Contenu complet</label>
              <textarea 
                value={form.contenu || ''} 
                onChange={e => setForm({ ...form, contenu: e.target.value })} 
                rows="5"
                placeholder="Contenu détaillé de l'actualité..."
              />
            </div>

            <div className="champ-lab">
              <label>Auteur</label>
              <input 
                value={form.auteur || ''} 
                onChange={e => setForm({ ...form, auteur: e.target.value })} 
                placeholder="Nom de l'auteur"
              />
            </div>

            <div className="champ-lab">
              <label>Lien externe (optionnel)</label>
              <input 
                value={form.lien || ''} 
                onChange={e => setForm({ ...form, lien: e.target.value })} 
                placeholder="https://..."
              />
            </div>

            <div className="champ-lab">
              <label>Image</label>
              <CloudinaryUpload 
                folder="icerd/actualites"
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