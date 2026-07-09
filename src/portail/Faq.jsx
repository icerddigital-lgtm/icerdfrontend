// frontend/src/portail/Faq.jsx
import { useState, useEffect } from 'react';
import { api } from '../api.js';
import Modal from '../components/Modal.jsx';
import ChampBilingue from '../components/ChampBilingue.jsx';

export default function GestionFaq({ showToast }) {
  const [data, setData] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState(null);
  const [form, setForm] = useState({
    question: '',
    question_en: '',
    reponse: '',
    reponse_en: '',
    categorie: 'Général',
    ordre_affichage: 0
  });

  const charger = async () => {
    try {
      setLoading(true);
      const [faqData, categoriesData] = await Promise.all([
        api('/faq'),
        api('/faq/categories')
      ]);
      setData(faqData || []);
      setCategories(categoriesData || []);
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
        await api(`/faq/${modal.id}`, { 
          method: 'PATCH', 
          body: JSON.stringify(form) 
        });
        showToast('✅ Question modifiée avec succès', 'success');
      } else {
        await api('/faq', { 
          method: 'POST', 
          body: JSON.stringify(form) 
        });
        showToast('✅ Question créée avec succès', 'success');
      }
      setModal(null);
      setForm({ question: '', question_en: '', reponse: '', reponse_en: '', categorie: 'Général', ordre_affichage: 0 });
      charger();
    } catch (e) {
      showToast(e.message, 'error');
    }
  };

  const handleDelete = async (id, question) => {
    if (!confirm(`Supprimer la question "${question}" ?`)) return;
    try {
      await api(`/faq/${id}`, { method: 'DELETE' });
      showToast('✅ Question supprimée', 'success');
      charger();
    } catch (e) {
      showToast(e.message, 'error');
    }
  };

  const handleTogglePublie = async (id, publie) => {
    try {
      await api(`/faq/${id}`, { 
        method: 'PATCH', 
        body: JSON.stringify({ publie: !publie }) 
      });
      showToast(`✅ Question ${publie ? 'masquée' : 'publiée'}`, 'success');
      charger();
    } catch (e) {
      showToast(e.message, 'error');
    }
  };

  const categoriesList = ['Général', 'Présentation', 'Services', 'Qualité', 'Formation', 'Partenariat', 'Carrières'];

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
        <p style={{ color: '#64748b' }}>Chargement des questions...</p>
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
          <h2 style={{ fontSize: '20px', fontWeight: 700, color: '#0f2d80' }}>❓ FAQ</h2>
          <p style={{ fontSize: '13px', color: '#64748b' }}>
            {data.length} question{data.length > 1 ? 's' : ''} · {categories.length} catégorie{categories.length > 1 ? 's' : ''}
          </p>
        </div>
        <button 
          className="btn-lab btn-lab--primary" 
          onClick={() => { 
            setForm({ question: '', question_en: '', reponse: '', reponse_en: '', categorie: 'Général', ordre_affichage: 0 }); 
            setModal({}); 
          }}
        >
          + Nouvelle question
        </button>
      </div>

      {/* STATISTIQUES */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))',
        gap: '12px',
        marginBottom: '20px'
      }}>
        <div className="stat-card">
          <div className="stat-card__value">{data.length}</div>
          <div className="stat-card__label">Total questions</div>
        </div>
        <div className="stat-card stat-card--success">
          <div className="stat-card__value">{data.filter(f => f.publie).length}</div>
          <div className="stat-card__label">Publiées</div>
        </div>
        <div className="stat-card stat-card--danger">
          <div className="stat-card__value">{data.filter(f => !f.publie).length}</div>
          <div className="stat-card__label">Masquées</div>
        </div>
        <div className="stat-card stat-card--primary">
          <div className="stat-card__value">{categories.length}</div>
          <div className="stat-card__label">Catégories</div>
        </div>
      </div>

      {/* TABLEAU */}
      <div className="tableau-lab">
        <table>
          <thead>
            <tr>
              <th style={{ width: '30px' }}>#</th>
              <th>Question</th>
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
                  <td>
                    <strong>{item.question}</strong>
                    <div style={{ 
                      fontSize: '13px', 
                      color: 'var(--text-muted)',
                      maxWidth: '300px',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap'
                    }}>
                      {item.reponse}
                    </div>
                  </td>
                  <td>
                    <span className="badge-lab badge-lab--primary">
                      {item.categorie || 'Général'}
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
                        onClick={() => handleDelete(item.id, item.question)}
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
                <td colSpan="5" style={{ 
                  textAlign: 'center', 
                  padding: '40px 20px', 
                  color: '#94a3b8' 
                }}>
                  <div style={{ fontSize: '40px', marginBottom: '8px' }}>❓</div>
                  <p>Aucune question enregistrée</p>
                  <p style={{ fontSize: '13px' }}>
                    Cliquez sur "Nouvelle question" pour commencer
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
          title={modal.id ? 'Modifier la question' : 'Nouvelle question FAQ'} 
          onClose={() => setModal(null)}
          maxWidth="600px"
        >
          <form onSubmit={handleSubmit}>
            <ChampBilingue
              label="Question"
              nom="question"
              valeurs={form}
              onChange={setForm}
              obligatoire
              placeholder="Ex : Quels types d'analyses proposez-vous ?"
              placeholderEn="e.g. What types of analysis do you offer?"
            />

            <ChampBilingue
              label="Réponse"
              nom="reponse"
              valeurs={form}
              onChange={setForm}
              multiligne
              lignes={4}
              obligatoire
              placeholder="Rédigez la réponse à la question…"
              placeholderEn="Write the English answer (optional)"
            />

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              <div className="champ-lab">
                <label>Catégorie</label>
                <select 
                  value={form.categorie || 'Général'} 
                  onChange={e => setForm({ ...form, categorie: e.target.value })}
                >
                  {categoriesList.map(c => (
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

            <div style={{ 
              background: 'var(--bg-light)', 
              padding: '12px 16px', 
              borderRadius: '8px',
              marginBottom: '16px',
              fontSize: '13px',
              color: '#64748b'
            }}>
              💡 Les questions sont affichées par ordre croissant (0 = premier).
              Utilisez cette option pour organiser votre FAQ.
            </div>

            <div style={{ display: 'flex', gap: '12px', marginTop: '4px' }}>
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