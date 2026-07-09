import { useEffect, useState } from 'react';
import { api, fcfa } from '../api.js';
import Modal from '../components/Modal.jsx';

export default function Stocks({ showToast }) {
  const [data, setData] = useState([]);
  const [alertes, setAlertes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState(null);
  const [form, setForm] = useState({
    code: '',
    designation: '',
    categorie: 'REACTIF',
    unite: 'L',
    stock_mini: 5,
    emplacement: '',
    danger: '',
    fournisseur: ''
  });
  const [mouvement, setMouvement] = useState({
    article_id: '',
    type: 'ENTREE',
    quantite: 1,
    motif: ''
  });
  const [mouvements, setMouvements] = useState([]);
  const [showMouvements, setShowMouvements] = useState(false);
  const [filtreCategorie, setFiltreCategorie] = useState('TOUTES');
  const [filtreAlerte, setFiltreAlerte] = useState(false);

  const charger = async () => {
    try {
      setLoading(true);
      const [articles, alertesList, mouvementsList] = await Promise.all([
        api('/stocks/articles'),
        api('/stocks/alertes'),
        api('/stocks/mouvements').catch(() => [])
      ]);
      setData(articles || []);
      setAlertes(alertesList || []);
      setMouvements(mouvementsList || []);
    } catch (e) {
      showToast(e.message, 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { charger(); }, []);

  // Ajouter/Modifier un article
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (modal?.id) {
        await api(`/stocks/articles/${modal.id}`, {
          method: 'PATCH',
          body: JSON.stringify(form)
        });
        showToast('✅ Article modifié avec succès', 'success');
      } else {
        await api('/stocks/articles', {
          method: 'POST',
          body: JSON.stringify(form)
        });
        showToast('✅ Article créé avec succès', 'success');
      }
      setModal(null);
      resetForm();
      charger();
    } catch (e) {
      showToast(e.message, 'error');
    }
  };

  // Enregistrer un mouvement
  const handleMouvement = async (e) => {
    e.preventDefault();
    try {
      if (!mouvement.article_id) {
        showToast('Veuillez sélectionner un article', 'error');
        return;
      }
      if (!mouvement.quantite || mouvement.quantite <= 0) {
        showToast('Veuillez saisir une quantité valide', 'error');
        return;
      }
      await api('/stocks/mouvements', {
        method: 'POST',
        body: JSON.stringify({
          article_id: mouvement.article_id,
          type: mouvement.type,
          quantite: parseFloat(mouvement.quantite),
          motif: mouvement.motif || null
        })
      });
      showToast('✅ Mouvement enregistré avec succès', 'success');
      setMouvement({ article_id: data[0]?.id || '', type: 'ENTREE', quantite: 1, motif: '' });
      setModal(null);
      charger();
    } catch (e) {
      showToast(e.message, 'error');
    }
  };

  // Supprimer un article
  const handleDelete = async (id, designation) => {
    if (!confirm(`Supprimer l'article "${designation}" ?`)) return;
    try {
      await api(`/stocks/articles/${id}`, { method: 'DELETE' });
      showToast('✅ Article supprimé', 'success');
      charger();
    } catch (e) {
      showToast(e.message, 'error');
    }
  };

  const resetForm = () => {
    setForm({
      code: '',
      designation: '',
      categorie: 'REACTIF',
      unite: 'L',
      stock_mini: 5,
      emplacement: '',
      danger: '',
      fournisseur: ''
    });
  };

  // Catégories disponibles
  const categories = [
    { value: 'REACTIF', label: '🧪 Réactif' },
    { value: 'CONSOMMABLE', label: '📦 Consommable' },
    { value: 'EPI', label: '🛡️ EPI' },
    { value: 'VERRERIE', label: '🔬 Verrerie' },
    { value: 'ETALON_REFERENCE', label: '⚖️ Étalon/Référence' },
    { value: 'AUTRE', label: '📦 Autre' }
  ];

  // Types de mouvement
  const typesMouvement = [
    { value: 'ENTREE', label: '📥 Entrée', color: '#16a34a' },
    { value: 'SORTIE', label: '📤 Sortie', color: '#dc2626' },
    { value: 'PERTE', label: '⚠️ Perte', color: '#f59e0b' },
    { value: 'PEREMPTION', label: '⏰ Péremption', color: '#7c3aed' }
  ];

  // Filtrer les données
  const dataFiltrees = data.filter(a => {
    if (filtreCategorie !== 'TOUTES' && a.categorie !== filtreCategorie) return false;
    if (filtreAlerte && Number(a.stock_actuel) > Number(a.stock_mini)) return false;
    return true;
  });

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
        <p style={{ color: '#64748b' }}>Chargement des stocks...</p>
      </div>
    );
  }

  // Statistiques
  const totalArticles = data.length;
  const articlesEnAlerte = data.filter(a => Number(a.stock_actuel) <= Number(a.stock_mini)).length;
  const stockTotal = data.reduce((sum, a) => sum + Number(a.stock_actuel || 0), 0);

  // Couleur de danger
  const getDangerColor = (danger) => {
    if (!danger || danger === '—') return '#94a3b8';
    if (danger.includes('toxique') || danger.includes('cancérigène')) return '#dc2626';
    if (danger.includes('inflammable') || danger.includes('explosif')) return '#f59e0b';
    if (danger.includes('corrosif')) return '#7c3aed';
    return '#f59e0b';
  };

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
          <h2 style={{ fontSize: '20px', fontWeight: 700, color: '#0f2d80' }}>📦 Stocks & réactifs</h2>
          <div style={{
            display: 'flex',
            gap: '16px',
            marginTop: '4px',
            fontSize: '13px',
            color: '#64748b',
            flexWrap: 'wrap'
          }}>
            <span>📊 Total: <strong>{totalArticles}</strong></span>
            <span>⚠️ Alertes: <strong style={{ color: '#dc2626' }}>{articlesEnAlerte}</strong></span>
            <span>📦 Stock total: <strong>{stockTotal}</strong></span>
          </div>
        </div>
        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
          <button
            className="btn-lab btn-lab--ghost"
            onClick={() => setShowMouvements(!showMouvements)}
          >
            {showMouvements ? '📋 Masquer historique' : '📋 Voir historique'}
          </button>
          <button
            className="btn-lab btn-lab--primary"
            onClick={() => {
              resetForm();
              setModal({ type: 'article' });
            }}
          >
            + Nouvel article
          </button>
          <button
            className="btn-lab btn-lab--accent"
            onClick={() => {
              setMouvement({
                article_id: data[0]?.id || '',
                type: 'ENTREE',
                quantite: 1,
                motif: ''
              });
              setModal({ type: 'mouvement' });
            }}
            disabled={data.length === 0}
          >
            🔄 Mouvement
          </button>
        </div>
      </div>

      {/* FILTRES */}
      <div style={{
        display: 'flex',
        flexWrap: 'wrap',
        gap: '12px',
        marginBottom: '16px',
        padding: '12px 16px',
        background: 'white',
        borderRadius: '8px',
        border: '1px solid var(--border-color)',
        alignItems: 'center'
      }}>
        <span style={{ fontSize: '13px', fontWeight: 600, color: '#64748b' }}>🔍 Filtrer :</span>
        <select
          value={filtreCategorie}
          onChange={e => setFiltreCategorie(e.target.value)}
          style={{
            padding: '6px 12px',
            borderRadius: '6px',
            border: '1px solid var(--border-color)',
            fontSize: '13px',
            background: 'white'
          }}
        >
          <option value="TOUTES">Toutes catégories</option>
          {categories.map(c => (
            <option key={c.value} value={c.value}>{c.label}</option>
          ))}
        </select>
        <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px', cursor: 'pointer' }}>
          <input
            type="checkbox"
            checked={filtreAlerte}
            onChange={e => setFiltreAlerte(e.target.checked)}
          />
          ⚠️ Uniquement les alertes
        </label>
        <span style={{ fontSize: '12px', color: '#94a3b8', marginLeft: 'auto' }}>
          {dataFiltrees.length} article{dataFiltrees.length > 1 ? 's' : ''}
        </span>
      </div>

      {/* ALERTES */}
      {alertes.length > 0 && (
        <div style={{
          background: '#fef3c7',
          border: '1px solid #f59e0b',
          borderRadius: '8px',
          padding: '12px 16px',
          marginBottom: '16px'
        }}>
          <strong>⚠️ {alertes.length} alerte(s) :</strong> {alertes.slice(0, 5).map(a =>
            `${a.designation} (${a.type_alerte === 'STOCK_BAS' ? '📉 stock bas' : '⏰ péremption'})`
          ).join(' · ')}
          {alertes.length > 5 && ` … et ${alertes.length - 5} autre(s)`}
        </div>
      )}

      {/* TABLEAU DES ARTICLES */}
      <div className="tableau-lab">
        <table>
          <thead>
            <tr>
              <th>Code</th>
              <th>Désignation</th>
              <th>Catégorie</th>
              <th style={{ textAlign: 'right' }}>Stock</th>
              <th style={{ textAlign: 'right' }}>Seuil</th>
              <th>Emplacement</th>
              <th>Danger</th>
              <th style={{ textAlign: 'center' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {dataFiltrees.length > 0 ? (
              dataFiltrees.map(a => {
                const estEnAlerte = Number(a.stock_actuel) <= Number(a.stock_mini);
                return (
                  <tr key={a.id}>
                    <td style={{
                      fontFamily: 'var(--mono)',
                      fontSize: '12px',
                      color: 'var(--text-muted)'
                    }}>
                      {a.code}
                    </td>
                    <td>
                      <strong>{a.designation}</strong>
                      {a.fournisseur && (
                        <span style={{
                          fontSize: '11px',
                          color: '#94a3b8',
                          display: 'block'
                        }}>
                          Fournisseur: {a.fournisseur}
                        </span>
                      )}
                    </td>
                    <td>
                      <span className="badge-lab badge-lab--primary">
                        {categories.find(c => c.value === a.categorie)?.label || a.categorie}
                      </span>
                    </td>
                    <td style={{
                      textAlign: 'right',
                      fontFamily: 'var(--mono)',
                      fontWeight: estEnAlerte ? 700 : 'normal',
                      color: estEnAlerte ? '#dc2626' : '#0f2d80'
                    }}>
                      {a.stock_actuel} {a.unite}
                      {estEnAlerte && ' ⚠️'}
                    </td>
                    <td style={{
                      textAlign: 'right',
                      fontFamily: 'var(--mono)',
                      color: '#94a3b8'
                    }}>
                      {a.stock_mini} {a.unite}
                    </td>
                    <td style={{
                      fontFamily: 'var(--mono)',
                      fontSize: '12px',
                      color: 'var(--text-muted)'
                    }}>
                      {a.emplacement || '—'}
                    </td>
                    <td>
                      {a.danger && a.danger !== '—' ? (
                        <span style={{
                          padding: '2px 10px',
                          borderRadius: '999px',
                          fontSize: '11px',
                          fontWeight: 600,
                          background: `${getDangerColor(a.danger)}20`,
                          color: getDangerColor(a.danger),
                          border: `1px solid ${getDangerColor(a.danger)}30`
                        }}>
                          {a.danger}
                        </span>
                      ) : (
                        <span style={{ color: '#94a3b8', fontSize: '12px' }}>—</span>
                      )}
                    </td>
                    <td style={{ textAlign: 'center' }}>
                      <div style={{ display: 'flex', gap: '4px', justifyContent: 'center', flexWrap: 'wrap' }}>
                        <button
                          className="btn-lab btn-lab--ghost btn-lab--xs"
                          onClick={() => {
                            setForm(a);
                            setModal({ type: 'article', id: a.id });
                          }}
                          title="Modifier"
                        >
                          ✏️
                        </button>
                        <button
                          className="btn-lab btn-lab--danger btn-lab--xs"
                          onClick={() => handleDelete(a.id, a.designation)}
                          title="Supprimer"
                        >
                          🗑️
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan="8" style={{
                  textAlign: 'center',
                  padding: '40px 20px',
                  color: '#94a3b8'
                }}>
                  <div style={{ fontSize: '40px', marginBottom: '8px' }}>📦</div>
                  <p>Aucun article en stock</p>
                  <p style={{ fontSize: '13px' }}>
                    Ajoutez votre premier article en cliquant sur "Nouvel article"
                  </p>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* HISTORIQUE DES MOUVEMENTS */}
      {showMouvements && (
        <div style={{ marginTop: '20px' }}>
          <h3 style={{
            fontSize: '16px',
            fontWeight: 700,
            color: '#0f2d80',
            marginBottom: '12px'
          }}>
            📋 Historique des mouvements
          </h3>
          <div className="tableau-lab">
            <table>
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Article</th>
                  <th>Type</th>
                  <th style={{ textAlign: 'right' }}>Quantité</th>
                  <th>Motif</th>
                  <th>Opérateur</th>
                </tr>
              </thead>
              <tbody>
                {mouvements.length > 0 ? (
                  mouvements.slice(0, 50).map(m => {
                    const typeInfo = typesMouvement.find(t => t.value === m.type);
                    return (
                      <tr key={m.id}>
                        <td style={{ fontSize: '13px' }}>
                          {new Date(m.date_mouvement).toLocaleDateString('fr-FR')}
                        </td>
                        <td>{m.designation}</td>
                        <td>
                          <span style={{
                            color: typeInfo?.color || '#94a3b8',
                            fontWeight: 600
                          }}>
                            {typeInfo?.label || m.type}
                          </span>
                        </td>
                        <td style={{
                          textAlign: 'right',
                          fontFamily: 'var(--mono)',
                          color: m.quantite > 0 ? '#16a34a' : '#dc2626',
                          fontWeight: 600
                        }}>
                          {m.quantite > 0 ? '+' : ''}{m.quantite} {m.unite}
                        </td>
                        <td style={{ fontSize: '13px', color: 'var(--text-muted)' }}>
                          {m.motif || '—'}
                        </td>
                        <td style={{ fontSize: '13px' }}>
                          {m.operateur || '—'}
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan="6" style={{
                      textAlign: 'center',
                      padding: '20px',
                      color: '#94a3b8'
                    }}>
                      Aucun mouvement enregistré
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* MODAL - Article */}
      {modal?.type === 'article' && (
        <Modal
          title={modal.id ? 'Modifier l\'article' : 'Nouvel article'}
          onClose={() => setModal(null)}
        >
          <form onSubmit={handleSubmit}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              <div className="champ-lab">
                <label>Code *</label>
                <input
                  value={form.code || ''}
                  onChange={e => setForm({ ...form, code: e.target.value.toUpperCase() })}
                  required
                  placeholder="Ex: ART-001"
                />
              </div>
              <div className="champ-lab">
                <label>Catégorie</label>
                <select
                  value={form.categorie || 'REACTIF'}
                  onChange={e => setForm({ ...form, categorie: e.target.value })}
                >
                  {categories.map(c => (
                    <option key={c.value} value={c.value}>{c.label}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="champ-lab">
              <label>Désignation *</label>
              <input
                value={form.designation || ''}
                onChange={e => setForm({ ...form, designation: e.target.value })}
                required
                placeholder="Nom de l'article"
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '12px' }}>
              <div className="champ-lab">
                <label>Unité</label>
                <input
                  value={form.unite || 'L'}
                  onChange={e => setForm({ ...form, unite: e.target.value })}
                  placeholder="L, kg, pièce..."
                />
              </div>
              <div className="champ-lab">
                <label>Stock minimum</label>
                <input
                  type="number"
                  min="0"
                  step="0.1"
                  value={form.stock_mini || 5}
                  onChange={e => setForm({ ...form, stock_mini: parseFloat(e.target.value) || 0 })}
                />
              </div>
              <div className="champ-lab">
                <label>Emplacement</label>
                <input
                  value={form.emplacement || ''}
                  onChange={e => setForm({ ...form, emplacement: e.target.value })}
                  placeholder="Armoire, étagère..."
                />
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              <div className="champ-lab">
                <label>Danger / pictogramme</label>
                <input
                  value={form.danger || ''}
                  onChange={e => setForm({ ...form, danger: e.target.value })}
                  placeholder="Corrosif, inflammable, toxique..."
                />
              </div>
              <div className="champ-lab">
                <label>Fournisseur</label>
                <input
                  value={form.fournisseur || ''}
                  onChange={e => setForm({ ...form, fournisseur: e.target.value })}
                  placeholder="Nom du fournisseur"
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

      {/* MODAL - Mouvement */}
      {modal?.type === 'mouvement' && (
        <Modal title="Mouvement de stock" onClose={() => setModal(null)}>
          <form onSubmit={handleMouvement}>
            <div className="champ-lab">
              <label>Article *</label>
              <select
                value={mouvement.article_id}
                onChange={e => setMouvement({ ...mouvement, article_id: e.target.value })}
                required
              >
                <option value="">Sélectionner un article</option>
                {data.map(a => (
                  <option key={a.id} value={a.id}>
                    {a.code} - {a.designation} ({a.stock_actuel} {a.unite})
                  </option>
                ))}
              </select>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              <div className="champ-lab">
                <label>Type de mouvement *</label>
                <select
                  value={mouvement.type}
                  onChange={e => setMouvement({ ...mouvement, type: e.target.value })}
                >
                  {typesMouvement.map(t => (
                    <option key={t.value} value={t.value}>{t.label}</option>
                  ))}
                </select>
              </div>
              <div className="champ-lab">
                <label>Quantité *</label>
                <input
                  type="number"
                  min="0.1"
                  step="0.1"
                  value={mouvement.quantite}
                  onChange={e => setMouvement({ ...mouvement, quantite: parseFloat(e.target.value) || 0 })}
                  required
                />
              </div>
            </div>

            <div className="champ-lab">
              <label>Motif</label>
              <input
                value={mouvement.motif || ''}
                onChange={e => setMouvement({ ...mouvement, motif: e.target.value })}
                placeholder="Ex: réapprovisionnement, utilisation en analyse..."
              />
            </div>

            <div style={{
              background: 'var(--bg-light)',
              padding: '12px 16px',
              borderRadius: '8px',
              marginBottom: '16px',
              fontSize: '13px',
              color: '#64748b'
            }}>
              💡 Les mouvements de type "Sortie", "Perte" et "Péremption" diminueront le stock.
              Les mouvements de type "Entrée" l'augmenteront.
            </div>

            <div style={{ display: 'flex', gap: '12px' }}>
              <button type="submit" className="btn-lab btn-lab--accent">
                💾 Enregistrer le mouvement
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