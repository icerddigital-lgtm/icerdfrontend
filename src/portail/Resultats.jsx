import { useEffect, useState } from 'react';
import { api } from '../api.js';
import Modal from '../components/Modal.jsx';

export default function Resultats({ showToast }) {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState(null);
  const [form, setForm] = useState({ 
    ech_analyse_id: '', 
    valeur_num: '', 
    unite: '', 
    conforme: true, 
    commentaire: '' 
  });
  const [analyses, setAnalyses] = useState([]);

  const charger = async () => {
    try {
      setLoading(true);
      const [resultats, analysesList] = await Promise.all([
        api('/resultats'),
        api('/analyses/file-travail')
      ]);
      setData(resultats || []);
      setAnalyses(analysesList || []);
    } catch (e) {
      console.error('Erreur chargement:', e);
      showToast(e.message || 'Erreur de chargement', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { charger(); }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api('/resultats', { 
        method: 'POST', 
        body: JSON.stringify({
          ech_analyse_id: form.ech_analyse_id,
          valeur_num: parseFloat(form.valeur_num) || 0,
          unite: form.unite,
          conforme: form.conforme,
          commentaire: form.commentaire
        }) 
      });
      showToast('Résultat enregistré avec succès', 'success');
      setModal(null);
      setForm({ ech_analyse_id: '', valeur_num: '', unite: '', conforme: true, commentaire: '' });
      charger();
    } catch (e) {
      showToast(e.message, 'error');
    }
  };

  const handleValidate = async (id) => {
    try {
      await api(`/resultats/${id}/valider`, { method: 'PATCH' });
      showToast('Résultat validé avec succès', 'success');
      charger();
    } catch (e) {
      showToast(e.message, 'error');
    }
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
        <p style={{ color: '#64748b' }}>Chargement des résultats...</p>
      </div>
    );
  }

  return (
    <>
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center', 
        marginBottom: '20px', 
        flexWrap: 'wrap', 
        gap: '12px' 
      }}>
        <div>
          <h2 style={{ fontSize: '20px', fontWeight: 700, color: '#0f2d80' }}>📈 Résultats d'analyses</h2>
          <p style={{ fontSize: '13px', color: '#64748b', marginTop: '2px' }}>
            {data.length} résultat{data.length > 1 ? 's' : ''} enregistré{data.length > 1 ? 's' : ''}
          </p>
        </div>
        <button 
          className="btn-lab btn-lab--primary" 
          onClick={() => { 
            setForm({ 
              ech_analyse_id: analyses[0]?.id || '', 
              valeur_num: '', 
              unite: '', 
              conforme: true, 
              commentaire: '' 
            }); 
            setModal({}); 
          }}
          disabled={analyses.length === 0}
        >
          + Saisir un résultat
        </button>
      </div>

      {analyses.length === 0 && (
        <div style={{
          background: '#fef3c7',
          border: '1px solid #f59e0b',
          borderRadius: '8px',
          padding: '12px 16px',
          marginBottom: '16px',
          color: '#92400e',
          fontSize: '14px'
        }}>
          ⚠️ Aucune analyse en attente de résultat. Créez d'abord une demande avec des analyses.
        </div>
      )}

      <div className="tableau-lab">
        <table>
          <thead>
            <tr>
              <th>Échantillon</th>
              <th>Analyse</th>
              <th>Valeur</th>
              <th>Unité</th>
              <th>Conforme</th>
              <th>Validé</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {data.length > 0 ? (
              data.map(r => (
                <tr key={r.id}>
                  <td style={{ fontFamily: 'var(--mono)', fontSize: '12px' }}>
                    {r.code_echantillon || '—'}
                  </td>
                  <td>{r.nom_analyse || '—'}</td>
                  <td style={{ fontWeight: 600 }}>
                    {r.valeur_num !== null && r.valeur_num !== undefined ? r.valeur_num : '—'}
                    {r.valeur_txt ? ` ${r.valeur_txt}` : ''}
                  </td>
                  <td>{r.unite || '—'}</td>
                  <td>
                    {r.conforme !== null && r.conforme !== undefined ? (
                      r.conforme ? (
                        <span className="badge-lab badge-lab--success">✅ Conforme</span>
                      ) : (
                        <span className="badge-lab badge-lab--danger">❌ Non conforme</span>
                      )
                    ) : (
                      <span className="badge-lab badge-lab--info">⏳ En attente</span>
                    )}
                  </td>
                  <td>
                    {r.valide_le ? (
                      <span className="badge-lab badge-lab--success">✅ Validé</span>
                    ) : (
                      <span className="badge-lab badge-lab--warning">⏳ En attente</span>
                    )}
                  </td>
                  <td>
                    {!r.valide_le && r.conforme !== null && (
                      <button 
                        className="btn-lab btn-lab--success btn-lab--sm" 
                        onClick={() => handleValidate(r.id)}
                      >
                        ✅ Valider
                      </button>
                    )}
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
                  <div style={{ fontSize: '40px', marginBottom: '8px' }}>🔬</div>
                  <p>Aucun résultat enregistré</p>
                  <p style={{ fontSize: '13px' }}>
                    Commencez par créer une demande et saisir des résultats.
                  </p>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {modal && (
        <Modal title="Saisir un résultat" onClose={() => setModal(null)}>
          <form onSubmit={handleSubmit}>
            <div className="champ-lab">
              <label>Analyse *</label>
              <select 
                value={form.ech_analyse_id} 
                onChange={e => setForm({ ...form, ech_analyse_id: e.target.value })} 
                required
              >
                <option value="">Sélectionner une analyse</option>
                {analyses.map(a => (
                  <option key={a.id} value={a.id}>
                    {a.echantillon} - {a.analyse} ({a.demande})
                  </option>
                ))}
              </select>
              {analyses.length === 0 && (
                <p style={{ color: '#dc2626', fontSize: '13px', marginTop: '4px' }}>
                  ⚠️ Aucune analyse disponible. Créez d'abord une demande.
                </p>
              )}
            </div>
            
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              <div className="champ-lab">
                <label>Valeur numérique *</label>
                <input 
                  type="number" 
                  step="any" 
                  value={form.valeur_num || ''} 
                  onChange={e => setForm({ ...form, valeur_num: e.target.value })} 
                  required 
                  placeholder="ex: 7.5"
                />
              </div>
              <div className="champ-lab">
                <label>Unité</label>
                <input 
                  value={form.unite || ''} 
                  onChange={e => setForm({ ...form, unite: e.target.value })} 
                  placeholder="ex: mg/L, pH, %" 
                />
              </div>
            </div>
            
            <div className="champ-lab">
              <label style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <input 
                  type="checkbox" 
                  checked={form.conforme !== false} 
                  onChange={e => setForm({ ...form, conforme: e.target.checked })} 
                />
                Résultat conforme
              </label>
            </div>
            
            <div className="champ-lab">
              <label>Commentaire</label>
              <textarea 
                value={form.commentaire || ''} 
                onChange={e => setForm({ ...form, commentaire: e.target.value })} 
                rows="3"
                placeholder="Informations complémentaires sur le résultat..."
              />
            </div>
            
            <div style={{ display: 'flex', gap: '12px', marginTop: '20px' }}>
              <button type="submit" className="btn-lab btn-lab--primary">
                💾 Enregistrer
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