import { useEffect, useState } from 'react';
import { api } from '../api.js';
import Modal from '../components/Modal.jsx';

const ETIQ = {
  RECU: 'badge-lab badge-lab--info',
  EN_ANALYSE: 'badge-lab badge-lab--warning',
  ANALYSE_TERMINEE: 'badge-lab badge-lab--success',
  CONFORME: 'badge-lab badge-lab--success',
  NON_CONFORME: 'badge-lab badge-lab--danger',
  ARCHIVE: 'badge-lab badge-lab--primary',
  DETRUIT: 'badge-lab badge-lab--danger'
};

export default function Echantillons({ showToast }) {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [erreur, setErreur] = useState('');
  const [filtre, setFiltre] = useState('');
  const [modal, setModal] = useState(null);
  const [demandes, setDemandes] = useState([]);
  const [form, setForm] = useState({
    demande_id: '',
    matrice: 'SOL',
    designation: '',
    lieu_prelevement: '',
    coordonnees_gps: '',
    date_prelevement: '',
    preleve_par: '',
    quantite: 1,
    conditionnement: '',
    etat: 'RECU',
    emplacement_stockage: '',
    observations: ''
  });

  const charger = async () => {
    try {
      setLoading(true);
      const [echantillons, demandesList] = await Promise.all([
        api(`/echantillons${filtre ? `?etat=${filtre}` : ''}`),
        api('/demandes?statut=EN_COURS')
      ]);
      setData(echantillons || []);
      setDemandes(demandesList || []);
    } catch (e) {
      setErreur(e.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { charger(); }, [filtre]);

  const resetForm = () => {
    setForm({
      demande_id: demandes[0]?.id || '',
      matrice: 'SOL',
      designation: '',
      lieu_prelevement: '',
      coordonnees_gps: '',
      date_prelevement: '',
      preleve_par: '',
      quantite: 1,
      conditionnement: '',
      etat: 'RECU',
      emplacement_stockage: '',
      observations: ''
    });
  };

  // ✅ Fonction pour charger un échantillon spécifique et pré-remplir le formulaire
  const chargerEchantillon = async (id) => {
    try {
      const e = await api(`/echantillons/${id}`);
      console.log('📝 Échantillon chargé:', e);
      
      // ✅ Pré-remplir TOUS les champs avec les données de l'échantillon
      setForm({
        demande_id: e.demande_id || '',
        matrice: e.matrice || 'SOL',
        designation: e.designation || '',
        lieu_prelevement: e.lieu_prelevement || '',
        coordonnees_gps: e.coordonnees_gps || '',
        date_prelevement: e.date_prelevement ? e.date_prelevement.split('T')[0] : '',
        preleve_par: e.preleve_par || '',
        quantite: e.quantite || 1,
        conditionnement: e.conditionnement || '',
        etat: e.etat || 'RECU',
        emplacement_stockage: e.emplacement_stockage || '',
        observations: e.observations || ''
      });
      
      // ✅ Ouvrir le modal en mode modification
      setModal({ id: e.id });
    } catch (e) {
      showToast(e.message, 'error');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // ✅ Validation des champs requis
      if (!form.demande_id) {
        showToast('Veuillez sélectionner une demande', 'error');
        return;
      }
      if (!form.designation || form.designation.trim() === '') {
        showToast('La désignation est requise', 'error');
        return;
      }

      const payload = {
        demande_id: form.demande_id,
        matrice: form.matrice || 'SOL',
        designation: form.designation.trim(),
        lieu_prelevement: form.lieu_prelevement || null,
        coordonnees_gps: form.coordonnees_gps || null,
        date_prelevement: form.date_prelevement || null,
        preleve_par: form.preleve_par || null,
        quantite: parseInt(form.quantite) || 1,
        conditionnement: form.conditionnement || null,
        etat: form.etat || 'RECU',
        emplacement_stockage: form.emplacement_stockage || null,
        observations: form.observations || null
      };

      console.log('📝 Payload envoyé:', payload);

      if (modal?.id) {
        await api(`/echantillons/${modal.id}`, { 
          method: 'PATCH', 
          body: JSON.stringify(payload) 
        });
        showToast('✅ Échantillon modifié avec succès', 'success');
      } else {
        await api('/echantillons', { 
          method: 'POST', 
          body: JSON.stringify(payload) 
        });
        showToast('✅ Échantillon créé avec succès', 'success');
      }
      setModal(null);
      resetForm();
      charger();
    } catch (e) {
      console.error('❌ Erreur:', e);
      showToast(e.message, 'error');
    }
  };

  const handleModifier = (echantillon) => {
    chargerEchantillon(echantillon.id);
  };

  const handleNouveau = () => {
    resetForm();
    setModal({});
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
        <p style={{ color: '#64748b' }}>Chargement des échantillons...</p>
      </div>
    );
  }

  if (erreur) return <div style={{ color: '#dc2626' }}>❌ {erreur}</div>;

  return (
    <>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap', gap: '12px' }}>
        <h2 style={{ fontSize: '20px', fontWeight: 700, color: '#0f2d80' }}>🧪 Échantillons</h2>
        <div style={{ display: 'flex', gap: '10px', alignItems: 'center', flexWrap: 'wrap' }}>
          <select value={filtre} onChange={e => setFiltre(e.target.value)} className="champ-lab" style={{ marginBottom: 0, padding: '8px 14px' }}>
            <option value="">Tous</option>
            <option value="RECU">Reçu</option>
            <option value="EN_ANALYSE">En analyse</option>
            <option value="ANALYSE_TERMINEE">Terminé</option>
            <option value="CONFORME">Conforme</option>
            <option value="NON_CONFORME">Non conforme</option>
            <option value="ARCHIVE">Archivé</option>
            <option value="DETRUIT">Détruit</option>
          </select>
          <button className="btn-lab btn-lab--primary" onClick={handleNouveau}>
            + Nouvel échantillon
          </button>
        </div>
      </div>

      <div className="tableau-lab">
        <table>
          <thead>
            <tr>
              <th>Code</th>
              <th>Demande</th>
              <th>Client</th>
              <th>Matrice</th>
              <th>Désignation</th>
              <th>Lieu</th>
              <th>État</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {data.map(e => (
              <tr key={e.id}>
                <td style={{ fontFamily: 'var(--mono)', fontSize: '12px', color: 'var(--text-muted)' }}>{e.code}</td>
                <td style={{ fontFamily: 'var(--mono)', fontSize: '12px' }}>{e.numero_demande}</td>
                <td>{e.raison_sociale}</td>
                <td><span className="badge-lab badge-lab--primary">{e.matrice}</span></td>
                <td>{e.designation}</td>
                <td style={{ fontSize: '12px', maxWidth: '100px', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  {e.lieu_prelevement || '—'}
                </td>
                <td><span className={ETIQ[e.etat] || 'badge-lab'}>{e.etat}</span></td>
                <td>
                  <button 
                    className="btn-lab btn-lab--ghost btn-lab--sm" 
                    onClick={() => handleModifier(e)}
                    title="Modifier"
                  >
                    ✏️
                  </button>
                </td>
              </tr>
            ))}
            {data.length === 0 && (
              <tr><td colSpan="8" style={{ textAlign: 'center', padding: '30px', color: '#94a3b8' }}>Aucun échantillon</td></tr>
            )}
          </tbody>
        </table>
      </div>

      {modal && (
        <Modal 
          title={modal.id ? '✏️ Modifier l\'échantillon' : '🧪 Nouvel échantillon'} 
          onClose={() => setModal(null)}
          maxWidth="700px"
        >
          <form onSubmit={handleSubmit}>
            {/* ✅ Demande */}
            <div className="champ-lab">
              <label>Demande *</label>
              <select 
                value={form.demande_id || ''} 
                onChange={e => setForm({ ...form, demande_id: e.target.value })} 
                required
              >
                <option value="">Sélectionner une demande</option>
                {demandes.map(d => (
                  <option key={d.id} value={d.id}>{d.numero} - {d.objet}</option>
                ))}
              </select>
              {modal.id && (
                <div style={{ fontSize: '11px', color: '#64748b', marginTop: '4px' }}>
                  💡 La demande ne peut pas être modifiée après création
                </div>
              )}
            </div>

            <div className="champ-lab">
              <label>Désignation *</label>
              <input 
                value={form.designation || ''} 
                onChange={e => setForm({ ...form, designation: e.target.value })} 
                placeholder="Ex: Échantillon de terre n°1"
                required 
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              <div className="champ-lab">
                <label>Matrice</label>
                <select value={form.matrice || 'SOL'} onChange={e => setForm({ ...form, matrice: e.target.value })}>
                  {['SOL','EAU','PLANTE','ENGRAIS','MINERAI','HYDROCARBURE','AUTRE'].map(m => (
                    <option key={m}>{m}</option>
                  ))}
                </select>
              </div>
              <div className="champ-lab">
                <label>Quantité</label>
                <input 
                  type="number" 
                  min="1"
                  value={form.quantite || 1} 
                  onChange={e => setForm({ ...form, quantite: e.target.value })} 
                />
              </div>
            </div>

            <div className="champ-lab">
              <label>Lieu de prélèvement</label>
              <input 
                value={form.lieu_prelevement || ''} 
                onChange={e => setForm({ ...form, lieu_prelevement: e.target.value })} 
                placeholder="Ex: Zone agricole de Mbalmayo"
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              <div className="champ-lab">
                <label>Date de prélèvement</label>
                <input 
                  type="date" 
                  value={form.date_prelevement || ''} 
                  onChange={e => setForm({ ...form, date_prelevement: e.target.value })} 
                />
              </div>
              <div className="champ-lab">
                <label>Prélevé par</label>
                <input 
                  value={form.preleve_par || ''} 
                  onChange={e => setForm({ ...form, preleve_par: e.target.value })} 
                  placeholder="Nom du préleveur"
                />
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              <div className="champ-lab">
                <label>Coordonnées GPS</label>
                <input 
                  value={form.coordonnees_gps || ''} 
                  onChange={e => setForm({ ...form, coordonnees_gps: e.target.value })} 
                  placeholder="Ex: 3.8480°N, 11.5021°E"
                />
              </div>
              <div className="champ-lab">
                <label>Conditionnement</label>
                <input 
                  value={form.conditionnement || ''} 
                  onChange={e => setForm({ ...form, conditionnement: e.target.value })} 
                  placeholder="Ex: Sac plastique, Bocal verre"
                />
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              <div className="champ-lab">
                <label>État</label>
                <select value={form.etat || 'RECU'} onChange={e => setForm({ ...form, etat: e.target.value })}>
                  <option value="RECU">📦 Reçu</option>
                  <option value="EN_ANALYSE">🔬 En analyse</option>
                  <option value="ANALYSE_TERMINEE">✅ Analyse terminée</option>
                  <option value="CONFORME">✔️ Conforme</option>
                  <option value="NON_CONFORME">❌ Non conforme</option>
                  <option value="ARCHIVE">📁 Archivé</option>
                  <option value="DETRUIT">🗑️ Détruit</option>
                </select>
              </div>
              <div className="champ-lab">
                <label>Emplacement stockage</label>
                <input 
                  value={form.emplacement_stockage || ''} 
                  onChange={e => setForm({ ...form, emplacement_stockage: e.target.value })} 
                  placeholder="Ex: Étagère A2, Réfrigérateur 1"
                />
              </div>
            </div>

            <div className="champ-lab">
              <label>Observations</label>
              <textarea 
                value={form.observations || ''} 
                onChange={e => setForm({ ...form, observations: e.target.value })} 
                rows="2"
                placeholder="Notes supplémentaires..."
                style={{ width: '100%', padding: '8px 12px', borderRadius: '6px', border: '1px solid var(--border-color)' }}
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