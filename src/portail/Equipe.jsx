// frontend/src/portail/Equipe.jsx
import { useState, useEffect } from 'react';
import { api } from '../api.js';
import Modal from '../components/Modal.jsx';
import CloudinaryUpload from '../components/CloudinaryUpload.jsx';

export default function GestionEquipe({ showToast }) {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState(null);
  const [form, setForm] = useState({
    nom: '',
    prenom: '',
    poste: '',
    domaine: '',
    email: '',
    telephone: '',
    bio: '',
    photo_url: '',
    categorie: 'Chercheurs',
    ordre_affichage: 0
  });

  const charger = async () => {
    try {
      setLoading(true);
      const result = await api('/equipe');
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
        await api(`/equipe/${modal.id}`, { 
          method: 'PATCH', 
          body: JSON.stringify(form) 
        });
        showToast('✅ Membre modifié avec succès', 'success');
      } else {
        await api('/equipe', { 
          method: 'POST', 
          body: JSON.stringify(form) 
        });
        showToast('✅ Membre ajouté avec succès', 'success');
      }
      setModal(null);
      setForm({ nom: '', prenom: '', poste: '', domaine: '', email: '', telephone: '', bio: '', photo_url: '', categorie: 'Chercheurs', ordre_affichage: 0 });
      charger();
    } catch (e) {
      showToast(e.message, 'error');
    }
  };

  const handleDelete = async (id, nom, prenom) => {
    if (!confirm(`Supprimer ${prenom} ${nom} ?`)) return;
    try {
      await api(`/equipe/${id}`, { method: 'DELETE' });
      showToast('✅ Membre supprimé', 'success');
      charger();
    } catch (e) {
      showToast(e.message, 'error');
    }
  };

  const handleTogglePublie = async (id, publie) => {
    try {
      await api(`/equipe/${id}`, { 
        method: 'PATCH', 
        body: JSON.stringify({ publie: !publie }) 
      });
      showToast(`✅ Membre ${publie ? 'masqué' : 'publié'}`, 'success');
      charger();
    } catch (e) {
      showToast(e.message, 'error');
    }
  };

  const categories = ['Chercheurs', 'Direction', 'Techniciens', 'Administratif', 'Stagiaires'];

  const categoryColors = {
    'Chercheurs': '#1d4ed8',
    'Direction': '#7c3aed',
    'Techniciens': '#16a34a',
    'Administratif': '#d97706',
    'Stagiaires': '#0891b2'
  };

  const categoryBg = {
    'Chercheurs': '#e8edfd',
    'Direction': '#ede9fe',
    'Techniciens': '#dcfce7',
    'Administratif': '#fef3c7',
    'Stagiaires': '#cffafe'
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
        <p style={{ color: '#64748b' }}>Chargement de l'équipe...</p>
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
          <h2 style={{ fontSize: '20px', fontWeight: 700, color: '#0f2d80' }}>👥 Équipe ICERD</h2>
          <p style={{ fontSize: '13px', color: '#64748b' }}>
            {data.length} membre{data.length > 1 ? 's' : ''} enregistré{data.length > 1 ? 's' : ''}
          </p>
        </div>
        <button 
          className="btn-lab btn-lab--primary" 
          onClick={() => { 
            setForm({ nom: '', prenom: '', poste: '', domaine: '', email: '', telephone: '', bio: '', photo_url: '', categorie: 'Chercheurs', ordre_affichage: 0 }); 
            setModal({}); 
          }}
        >
          + Ajouter un membre
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
              <th>Nom</th>
              <th>Prénom</th>
              <th>Poste</th>
              <th>Catégorie</th>
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
                  <td><strong>{item.nom}</strong></td>
                  <td>{item.prenom}</td>
                  <td>
                    {item.poste}
                    {item.domaine && (
                      <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                        {item.domaine}
                      </div>
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
                      {item.photo_url && (
                        <img 
                          src={item.photo_url} 
                          alt={item.nom} 
                          style={{ 
                            width: '30px', 
                            height: '30px', 
                            objectFit: 'cover', 
                            borderRadius: '50%',
                            border: '1px solid var(--border-color)'
                          }} 
                        />
                      )}
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
                        onClick={() => handleDelete(item.id, item.nom, item.prenom)}
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
                  <div style={{ fontSize: '40px', marginBottom: '8px' }}>👥</div>
                  <p>Aucun membre enregistré</p>
                  <p style={{ fontSize: '13px' }}>
                    Cliquez sur "Ajouter un membre" pour commencer
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
          title={modal.id ? 'Modifier le membre' : 'Ajouter un membre'} 
          onClose={() => setModal(null)}
          maxWidth="650px"
        >
          <form onSubmit={handleSubmit}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              <div className="champ-lab">
                <label>Nom *</label>
                <input 
                  value={form.nom || ''} 
                  onChange={e => setForm({ ...form, nom: e.target.value })} 
                  required 
                  placeholder="Ex: MVONDO ZE"
                />
              </div>
              <div className="champ-lab">
                <label>Prénom *</label>
                <input 
                  value={form.prenom || ''} 
                  onChange={e => setForm({ ...form, prenom: e.target.value })} 
                  required 
                  placeholder="Ex: Antoine"
                />
              </div>
            </div>

            <div className="champ-lab">
              <label>Poste *</label>
              <input 
                value={form.poste || ''} 
                onChange={e => setForm({ ...form, poste: e.target.value })} 
                required 
                placeholder="Ex: Directeur Général"
              />
            </div>

            <div className="champ-lab">
              <label>Domaine</label>
              <input 
                value={form.domaine || ''} 
                onChange={e => setForm({ ...form, domaine: e.target.value })} 
                placeholder="Ex: Pédologie - Sciences du sol"
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              <div className="champ-lab">
                <label>Email</label>
                <input 
                  type="email"
                  value={form.email || ''} 
                  onChange={e => setForm({ ...form, email: e.target.value })} 
                  placeholder="exemple@icerd.cm"
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

            <div className="champ-lab">
              <label>Biographie</label>
              <textarea 
                value={form.bio || ''} 
                onChange={e => setForm({ ...form, bio: e.target.value })} 
                rows="4"
                placeholder="Biographie du membre..."
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              <div className="champ-lab">
                <label>Catégorie</label>
                <select 
                  value={form.categorie || 'Chercheurs'} 
                  onChange={e => setForm({ ...form, categorie: e.target.value })}
                >
                  {categories.map(c => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>
              <div className="champ-lab">
                <label>Ordre d'affichage</label>
                <input 
                  type="number"
                  min="0"
                  value={form.ordre_affichage || 0} 
                  onChange={e => setForm({ ...form, ordre_affichage: parseInt(e.target.value) || 0 })} 
                  placeholder="0"
                />
              </div>
            </div>

            <div className="champ-lab">
              <label>Photo</label>
              <CloudinaryUpload 
                folder="icerd/equipe"
                onUpload={(url) => setForm({ ...form, photo_url: url })}
                onError={(msg) => showToast(msg, 'error')}
              />
              {form.photo_url && (
                <div style={{ marginTop: '8px', display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <img 
                    src={form.photo_url} 
                    alt="Aperçu" 
                    style={{ 
                      width: '60px', 
                      height: '60px', 
                      objectFit: 'cover', 
                      borderRadius: '50%',
                      border: '1px solid var(--border-color)'
                    }} 
                  />
                  <button 
                    type="button"
                    className="btn-lab btn-lab--danger btn-lab--sm"
                    onClick={() => setForm({ ...form, photo_url: '' })}
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
    </>
  );
}