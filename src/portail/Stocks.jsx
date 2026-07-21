// frontend/src/portail/Stocks.jsx
import { useEffect, useState } from 'react';
import { api, fcfa } from '../api.js';
import Modal from '../components/Modal.jsx';
import { 
  FaBox, 
  FaPlus, 
  FaEdit, 
  FaTrash, 
  FaSearch,
  FaExclamationTriangle,
  FaCheckCircle,
  FaExchangeAlt,
  FaWarehouse,
  FaBarcode,
  FaTag,
  FaBoxes
} from 'react-icons/fa';

export default function Stocks({ showToast }) {
  const [data, setData] = useState([]);
  const [alertes, setAlertes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
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

  const categories = [
    { value: 'REACTIF', label: '🧪 Réactif' },
    { value: 'CONSOMMABLE', label: '📦 Consommable' },
    { value: 'EPI', label: '🛡️ EPI' },
    { value: 'VERRERIE', label: '🔬 Verrerie' },
    { value: 'ETALON_REFERENCE', label: '⚖️ Étalon/Référence' },
    { value: 'AUTRE', label: '📦 Autre' }
  ];

  const typesMouvement = [
    { value: 'ENTREE', label: '📥 Entrée', color: '#16a34a' },
    { value: 'SORTIE', label: '📤 Sortie', color: '#dc2626' },
    { value: 'PERTE', label: '⚠️ Perte', color: '#f59e0b' },
    { value: 'PEREMPTION', label: '⏰ Péremption', color: '#7c3aed' }
  ];

  const filteredData = data.filter(a => {
    if (filtreCategorie !== 'TOUTES' && a.categorie !== filtreCategorie) return false;
    if (filtreAlerte && Number(a.stock_actuel) > Number(a.stock_mini)) return false;
    if (searchTerm && !a.designation?.toLowerCase().includes(searchTerm.toLowerCase()) && 
        !a.code?.toLowerCase().includes(searchTerm.toLowerCase())) return false;
    return true;
  });

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
        <p style={{ color: '#64748b' }}>Chargement des stocks...</p>
      </div>
    );
  }

  const totalArticles = data.length;
  const articlesEnAlerte = data.filter(a => Number(a.stock_actuel) <= Number(a.stock_mini)).length;
  const stockTotal = data.reduce((sum, a) => sum + Number(a.stock_actuel || 0), 0);

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
              <FaBoxes style={{ color: '#1d4ed8' }} />
              Stocks & réactifs
            </h2>
            <p style={{ color: '#64748b', fontSize: '14px', marginTop: '2px' }}>
              {totalArticles} article{totalArticles > 1 ? 's' : ''} en stock
            </p>
          </div>
          <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
            <button
              className="btn-lab btn-lab--ghost"
              onClick={() => setShowMouvements(!showMouvements)}
              style={{ display: 'flex', alignItems: 'center', gap: '6px' }}
            >
              <FaExchangeAlt />
              {showMouvements ? 'Masquer historique' : 'Voir historique'}
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
              style={{ display: 'flex', alignItems: 'center', gap: '6px' }}
            >
              <FaExchangeAlt /> Mouvement
            </button>
            <button
              className="btn-lab btn-lab--primary"
              onClick={() => { resetForm(); setModal({ type: 'article' }); }}
              style={{ display: 'flex', alignItems: 'center', gap: '6px' }}
            >
              <FaPlus /> Nouvel article
            </button>
          </div>
        </div>

        {/* Filtres et recherche */}
        <div style={{
          marginTop: '16px',
          display: 'flex',
          flexWrap: 'wrap',
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
            placeholder="Rechercher un article..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            style={{
              border: 'none',
              outline: 'none',
              flex: 1,
              padding: '8px 0',
              fontSize: '14px',
              fontFamily: 'var(--texte)',
              minWidth: '150px'
            }}
          />
          <select
            value={filtreCategorie}
            onChange={e => setFiltreCategorie(e.target.value)}
            style={{
              padding: '6px 12px',
              borderRadius: '6px',
              border: '1px solid #e2e8f0',
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
            ⚠️ Alertes uniquement
          </label>
          <span style={{ fontSize: '12px', color: '#94a3b8', marginLeft: 'auto' }}>
            {filteredData.length} article{filteredData.length > 1 ? 's' : ''}
          </span>
        </div>
      </div>

      {/* STATISTIQUES */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))',
        gap: '12px',
        marginBottom: '20px'
      }}>
        <div className="stat-card">
          <div className="stat-card__value">{totalArticles}</div>
          <div className="stat-card__label"><FaBox style={{ display: 'inline', marginRight: '4px' }} /> Total articles</div>
        </div>
        <div className="stat-card stat-card--danger">
          <div className="stat-card__value">{articlesEnAlerte}</div>
          <div className="stat-card__label"><FaExclamationTriangle style={{ display: 'inline', marginRight: '4px' }} /> Alertes</div>
        </div>
        <div className="stat-card stat-card--primary">
          <div className="stat-card__value">{stockTotal}</div>
          <div className="stat-card__label"><FaWarehouse style={{ display: 'inline', marginRight: '4px' }} /> Stock total</div>
        </div>
      </div>

      {/* ALERTES */}
      {alertes.length > 0 && (
        <div style={{
          background: '#fef3c7',
          border: '1px solid #f59e0b',
          borderRadius: '8px',
          padding: '12px 16px',
          marginBottom: '16px',
          display: 'flex',
          alignItems: 'center',
          gap: '12px'
        }}>
          <FaExclamationTriangle style={{ color: '#f59e0b', fontSize: '20px' }} />
          <div>
            <strong style={{ color: '#92400e' }}>{alertes.length} alerte(s) :</strong>
            <span style={{ color: '#78350f', fontSize: '13px', marginLeft: '4px' }}>
              {alertes.slice(0, 5).map(a =>
                `${a.designation} (${a.type_alerte === 'STOCK_BAS' ? '📉 stock bas' : '⏰ péremption'})`
              ).join(' · ')}
              {alertes.length > 5 && ` … et ${alertes.length - 5} autre(s)`}
            </span>
          </div>
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
            {filteredData.length > 0 ? (
              filteredData.map(a => {
                const estEnAlerte = Number(a.stock_actuel) <= Number(a.stock_mini);
                return (
                  <tr key={a.id}>
                    <td style={{ fontFamily: 'var(--mono)', fontSize: '12px', color: '#64748b', fontWeight: 600 }}>
                      <FaBarcode size={11} style={{ display: 'inline', marginRight: '4px' }} />
                      {a.code}
                    </td>
                    <td>
                      <strong style={{ color: estEnAlerte ? '#dc2626' : '#0f2d80' }}>{a.designation}</strong>
                      {a.fournisseur && (
                        <div style={{ fontSize: '11px', color: '#94a3b8' }}>
                          Fournisseur: {a.fournisseur}
                        </div>
                      )}
                    </td>
                    <td>
                      <span className="badge-lab badge-lab--primary" style={{ fontSize: '11px' }}>
                        <FaTag size={10} style={{ display: 'inline', marginRight: '4px' }} />
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
                    <td style={{ textAlign: 'right', fontFamily: 'var(--mono)', color: '#94a3b8' }}>
                      {a.stock_mini} {a.unite}
                    </td>
                    <td style={{ fontFamily: 'var(--mono)', fontSize: '12px', color: '#64748b' }}>
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
                      <div style={{ display: 'flex', gap: '6px', justifyContent: 'center' }}>
                        <button
                          className="btn-lab btn-lab--ghost btn-lab--sm"
                          onClick={() => { setForm(a); setModal({ type: 'article', id: a.id }); }}
                          title="Modifier"
                        >
                          <FaEdit />
                        </button>
                        <button
                          className="btn-lab btn-lab--danger btn-lab--sm"
                          onClick={() => handleDelete(a.id, a.designation)}
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
                <td colSpan="8" style={{ textAlign: 'center', padding: '60px 20px', color: '#94a3b8' }}>
                  <div style={{ fontSize: '48px', marginBottom: '12px' }}>📦</div>
                  <p style={{ fontSize: '16px', fontWeight: 500 }}>
                    {searchTerm ? 'Aucun article ne correspond à votre recherche' : 'Aucun article en stock'}
                  </p>
                  <p style={{ fontSize: '13px', marginTop: '4px' }}>
                    {searchTerm ? 'Essayez d\'autres termes' : 'Ajoutez votre premier article en cliquant sur "Nouvel article"'}
                  </p>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* HISTORIQUE DES MOUVEMENTS */}
      {showMouvements && (
        <div style={{ marginTop: '24px' }}>
          <h3 style={{
            fontSize: '16px',
            fontWeight: 700,
            color: '#0f2d80',
            marginBottom: '12px',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}>
            <FaExchangeAlt />
            Historique des mouvements
            <span style={{
              fontSize: '12px',
              fontWeight: 400,
              color: '#94a3b8',
              background: '#f1f5f9',
              padding: '2px 10px',
              borderRadius: '999px'
            }}>
              {mouvements.length} mouvements
            </span>
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
                        <td style={{ fontSize: '13px', color: '#64748b' }}>
                          {new Date(m.date_mouvement).toLocaleDateString('fr-FR')}
                        </td>
                        <td>{m.designation}</td>
                        <td>
                          <span style={{ color: typeInfo?.color || '#94a3b8', fontWeight: 600 }}>
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
                        <td style={{ fontSize: '13px', color: '#64748b' }}>
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
                    <td colSpan="6" style={{ textAlign: 'center', padding: '20px', color: '#94a3b8' }}>
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
          title={modal.id ? '✏️ Modifier l\'article' : '📦 Nouvel article'}
          onClose={() => setModal(null)}
          maxWidth="600px"
        >
          <form onSubmit={handleSubmit}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              <div className="champ-lab">
                <label>Code *</label>
                <input
                  value={form.code || ''}
                  onChange={e => setForm({ ...form, code: e.target.value.toUpperCase() })}
                  required
                  placeholder="ART-001"
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
                  placeholder="Corrosif, inflammable..."
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
        <Modal title="🔄 Mouvement de stock" onClose={() => setModal(null)}>
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
              background: '#f1f5f9',
              padding: '12px 16px',
              borderRadius: '8px',
              marginBottom: '16px',
              fontSize: '13px',
              color: '#64748b'
            }}>
              💡 Les mouvements de type "Sortie", "Perte" et "Péremption" diminuent le stock.
              Les mouvements de type "Entrée" l'augmentent.
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