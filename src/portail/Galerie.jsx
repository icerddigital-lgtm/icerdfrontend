// frontend/src/portail/Galerie.jsx
import { useState, useEffect } from 'react';
import { api } from '../api.js';
import Modal from '../components/Modal.jsx';
import CloudinaryUpload from '../components/CloudinaryUpload.jsx';

export default function GestionGalerie({ showToast }) {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState(null);
  const [viewMode, setViewMode] = useState('grid');
  const [filtreCategorie, setFiltreCategorie] = useState('TOUTES');
  const [form, setForm] = useState({
    titre: '',
    description: '',
    categorie: 'Laboratoire',
    image_url: ''
  });

  const charger = async () => {
    try {
      setLoading(true);
      const result = await api('/galerie');
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
      if (!form.image_url) {
        showToast('Veuillez télécharger une image', 'error');
        return;
      }
      if (modal?.id) {
        await api(`/galerie/${modal.id}`, {
          method: 'PATCH',
          body: JSON.stringify(form)
        });
        showToast('✅ Photo modifiée avec succès', 'success');
      } else {
        await api('/galerie', {
          method: 'POST',
          body: JSON.stringify(form)
        });
        showToast('✅ Photo ajoutée avec succès', 'success');
      }
      setModal(null);
      setForm({ titre: '', description: '', categorie: 'Laboratoire', image_url: '' });
      charger();
    } catch (e) {
      showToast(e.message, 'error');
    }
  };

  const handleDelete = async (id, titre) => {
    if (!confirm(`Supprimer la photo "${titre}" ?`)) return;
    try {
      await api(`/galerie/${id}`, { method: 'DELETE' });
      showToast('✅ Photo supprimée', 'success');
      charger();
    } catch (e) {
      showToast(e.message, 'error');
    }
  };

  const handleTogglePublie = async (id, publie) => {
    try {
      await api(`/galerie/${id}`, {
        method: 'PATCH',
        body: JSON.stringify({ publie: !publie })
      });
      showToast(`✅ Photo ${publie ? 'masquée' : 'publiée'}`, 'success');
      charger();
    } catch (e) {
      showToast(e.message, 'error');
    }
  };

  const categories = ['Laboratoire', 'Équipe', 'Terrain', 'Événement', 'Formation', 'Conférence', 'Visite'];

  const categoryColors = {
    'Laboratoire': '#1d4ed8',
    'Équipe': '#16a34a',
    'Terrain': '#d97706',
    'Événement': '#db2777',
    'Formation': '#2563eb',
    'Conférence': '#7c3aed',
    'Visite': '#0891b2'
  };

  const categoryBg = {
    'Laboratoire': '#e8edfd',
    'Équipe': '#dcfce7',
    'Terrain': '#fef3c7',
    'Événement': '#fce7f3',
    'Formation': '#dbeafe',
    'Conférence': '#ede9fe',
    'Visite': '#cffafe'
  };

  const dataFiltree = filtreCategorie === 'TOUTES'
    ? data
    : data.filter(item => item.categorie === filtreCategorie);

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
          margin: '0 auto 12px'
        }}></div>
        <p style={{ color: '#64748b' }}>Chargement de la galerie...</p>
      </div>
    );
  }

  return (
    <div>
      {/* ===== HEADER ===== */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '24px',
        flexWrap: 'wrap',
        gap: '16px'
      }}>
        <div>
          <h2 style={{ fontSize: '24px', fontWeight: 700, color: '#0f2d80' }}>🖼️ Galerie</h2>
          <p style={{ fontSize: '14px', color: '#64748b' }}>
            {data.length} photo{data.length > 1 ? 's' : ''} ·
            {data.filter(p => p.publie).length} publiée{data.filter(p => p.publie).length > 1 ? 's' : ''}
          </p>
        </div>
        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
          <button
            className="btn-lab btn-lab--primary"
            onClick={() => setModal({})}
            style={{ padding: '10px 24px' }}
          >
            📤 Ajouter une photo
          </button>
          <select
            value={filtreCategorie}
            onChange={e => setFiltreCategorie(e.target.value)}
            style={{
              padding: '8px 16px',
              borderRadius: '8px',
              border: '1.5px solid var(--border-color)',
              fontSize: '13px',
              background: 'white',
              cursor: 'pointer'
            }}
          >
            <option value="TOUTES">Toutes les catégories</option>
            {categories.map(c => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
          <button
            onClick={() => setViewMode(viewMode === 'grid' ? 'list' : 'grid')}
            className="btn-lab btn-lab--ghost"
            style={{ padding: '8px 16px' }}
          >
            {viewMode === 'grid' ? '📋 Liste' : '📊 Grille'}
          </button>
        </div>
      </div>

      {/* ===== STATISTIQUES ===== */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(120px, 1fr))',
        gap: '12px',
        marginBottom: '24px'
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
      </div>

      {/* ===== GRILLE PHOTOS ===== */}
      <div style={{
        display: viewMode === 'grid' ? 'grid' : 'flex',
        flexDirection: viewMode === 'list' ? 'column' : 'unset',
        gridTemplateColumns: viewMode === 'grid' ? 'repeat(auto-fill, minmax(240px, 1fr))' : 'unset',
        gap: '16px'
      }}>
        {dataFiltree.length > 0 ? (
          dataFiltree.map((item) => (
            <div
              key={item.id}
              style={{
                background: 'white',
                borderRadius: '12px',
                border: '1px solid var(--border-color)',
                overflow: 'hidden',
                transition: 'all 0.3s ease',
                position: 'relative',
                display: viewMode === 'list' ? 'flex' : 'block',
                gap: viewMode === 'list' ? '16px' : '0',
                alignItems: viewMode === 'list' ? 'center' : 'unset'
              }}
              onMouseEnter={e => {
                e.currentTarget.style.transform = 'translateY(-4px)';
                e.currentTarget.style.boxShadow = '0 8px 24px rgba(0,0,0,0.08)';
              }}
              onMouseLeave={e => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = 'none';
              }}
            >
              {/* Image */}
              <div style={{
                height: viewMode === 'list' ? '120px' : '200px',
                minWidth: viewMode === 'list' ? '160px' : 'auto',
                background: 'var(--bg-light)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                overflow: 'hidden',
                flexShrink: 0,
                position: 'relative'
              }}
              onClick={() => {
                setForm(item);
                setModal({ id: item.id });
              }}
              >
                {item.image_url ? (
                  <img
                    src={item.image_url}
                    alt={item.titre}
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover',
                      transition: 'transform 0.5s ease'
                    }}
                    onMouseEnter={(e) => e.target.style.transform = 'scale(1.05)'}
                    onMouseLeave={(e) => e.target.style.transform = 'scale(1)'}
                  />
                ) : (
                  <span style={{ fontSize: '40px', color: '#94a3b8' }}>📷</span>
                )}
                {/* Badge catégorie en overlay */}
                <span style={{
                  position: 'absolute',
                  top: '8px',
                  right: '8px',
                  padding: '2px 10px',
                  borderRadius: '999px',
                  fontSize: '9px',
                  fontWeight: 600,
                  background: 'rgba(0,0,0,0.6)',
                  color: 'white',
                  backdropFilter: 'blur(4px)'
                }}>
                  {item.categorie}
                </span>
              </div>

              {/* Infos */}
              <div style={{
                padding: viewMode === 'list' ? '12px 16px 12px 0' : '12px 14px',
                flex: 1,
                display: 'flex',
                flexDirection: 'column',
                gap: viewMode === 'list' ? '4px' : '6px'
              }}>
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'flex-start',
                  gap: '8px'
                }}>
                  <div style={{ flex: 1 }}>
                    <strong style={{ fontSize: '14px', color: '#0f2d80' }}>{item.titre}</strong>
                    {item.description && (
                      <p style={{
                        fontSize: '12px',
                        color: 'var(--text-muted)',
                        marginTop: '2px',
                        display: '-webkit-box',
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: 'vertical',
                        overflow: 'hidden'
                      }}>
                        {item.description}
                      </p>
                    )}
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleTogglePublie(item.id, item.publie);
                    }}
                    className={`badge-lab ${item.publie ? 'badge-lab--success' : 'badge-lab--danger'}`}
                    style={{
                      cursor: 'pointer',
                      border: 'none',
                      fontFamily: 'var(--texte)',
                      fontSize: '9px',
                      padding: '2px 8px',
                      whiteSpace: 'nowrap',
                      flexShrink: 0
                    }}
                    title={item.publie ? 'Publiée' : 'Masquée'}
                  >
                    {item.publie ? '✅' : '❌'}
                  </button>
                </div>

                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  flexWrap: 'wrap',
                  gap: '6px'
                }}>
                  <span className="badge-lab" style={{
                    background: categoryBg[item.categorie] || 'var(--bg-light)',
                    color: categoryColors[item.categorie] || 'var(--text-muted)',
                    fontSize: '10px',
                    padding: '2px 10px'
                  }}>
                    {item.categorie}
                  </span>
                  <div style={{ display: 'flex', gap: '4px' }}>
                    <button
                      className="btn-lab btn-lab--ghost btn-lab--xs"
                      onClick={(e) => {
                        e.stopPropagation();
                        setForm(item);
                        setModal({ id: item.id });
                      }}
                      title="Modifier"
                    >
                      ✏️
                    </button>
                    <button
                      className="btn-lab btn-lab--danger btn-lab--xs"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDelete(item.id, item.titre);
                      }}
                      title="Supprimer"
                    >
                      🗑️
                    </button>
                  </div>
                </div>

                {viewMode === 'list' && (
                  <div style={{ fontSize: '11px', color: '#94a3b8' }}>
                    📅 {item.date_upload ? new Date(item.date_upload).toLocaleDateString('fr-FR') : '—'}
                  </div>
                )}
              </div>
            </div>
          ))
        ) : (
          <div style={{
            gridColumn: '1 / -1',
            textAlign: 'center',
            padding: '80px 20px',
            color: '#94a3b8'
          }}>
            <div style={{ fontSize: '64px', marginBottom: '16px' }}>🖼️</div>
            <p style={{ fontSize: '18px', fontWeight: 500 }}>Aucune photo dans cette catégorie</p>
            <p style={{ fontSize: '14px' }}>Cliquez sur "Ajouter une photo" pour commencer</p>
          </div>
        )}
      </div>

      {/* ===== MODAL AJOUT/MODIFICATION ===== */}
      {modal && (
        <Modal
          title={modal.id ? 'Modifier la photo' : 'Ajouter une photo'}
          onClose={() => setModal(null)}
          maxWidth="550px"
        >
          <form onSubmit={handleSubmit}>
            <div className="champ-lab">
              <label>Titre *</label>
              <input
                value={form.titre || ''}
                onChange={e => setForm({ ...form, titre: e.target.value })}
                required
                placeholder="Ex: Laboratoire ICEPC-LAB"
              />
            </div>

            <div className="champ-lab">
              <label>Description</label>
              <textarea
                value={form.description || ''}
                onChange={e => setForm({ ...form, description: e.target.value })}
                rows="2"
                placeholder="Description de la photo..."
              />
            </div>

            <div className="champ-lab">
              <label>Catégorie</label>
              <select
                value={form.categorie || 'Laboratoire'}
                onChange={e => setForm({ ...form, categorie: e.target.value })}
              >
                {categories.map(c => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>

            <div className="champ-lab">
              <label>Image {!modal.id && '*'}</label>
              <CloudinaryUpload
                folder="icerd/galerie"
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
                {modal.id ? '💾 Modifier' : '💾 Ajouter'}
              </button>
              <button type="button" className="btn-lab btn-lab--ghost" onClick={() => setModal(null)}>
                Annuler
              </button>
            </div>
          </form>
        </Modal>
      )}

      <style>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}