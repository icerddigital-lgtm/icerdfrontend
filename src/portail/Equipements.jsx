// frontend/src/portail/Equipements.jsx
import { useEffect, useState } from 'react';
import { api } from '../api.js';
import Modal from '../components/Modal.jsx';
import { 
  FaMicroscope, 
  FaPlus, 
  FaEdit, 
  FaTools, 
  FaSearch,
  FaCalendarAlt,
  FaCheckCircle,
  FaExclamationTriangle,
  FaClock,
  FaBarcode,
  FaFlask
} from 'react-icons/fa';

export default function Equipements({ showToast }) {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [form, setForm] = useState({
    code: '',
    designation: '',
    laboratoire_id: '',
    numero_serie: '',
    date_mise_service: '',
    frequence_etalonnage_mois: 12,
    prochain_etalonnage: ''
  });
  const [labos, setLabos] = useState([]);

  const charger = async () => {
    try {
      setLoading(true);
      const [equipements, laboratoires] = await Promise.all([
        api('/equipements'),
        api('/laboratoires').catch(() => [])
      ]);
      setData(equipements || []);
      setLabos(laboratoires || []);
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
        await api(`/equipements/${modal.id}`, { method: 'PATCH', body: JSON.stringify(form) });
        showToast('✅ Équipement modifié avec succès', 'success');
      } else {
        await api('/equipements', { method: 'POST', body: JSON.stringify(form) });
        showToast('✅ Équipement créé avec succès', 'success');
      }
      setModal(null);
      resetForm();
      charger();
    } catch (e) {
      showToast(e.message, 'error');
    }
  };

  const resetForm = () => {
    setForm({
      code: '',
      designation: '',
      laboratoire_id: labos[0]?.id || '',
      numero_serie: '',
      date_mise_service: '',
      frequence_etalonnage_mois: 12,
      prochain_etalonnage: ''
    });
  };

  const handleIntervention = async (id, type) => {
    try {
      await api(`/equipements/${id}/interventions`, {
        method: 'POST',
        body: JSON.stringify({
          type: type,
          date_intervention: new Date().toISOString().split('T')[0],
          resultat: 'OK',
          prochaine_echeance: new Date(Date.now() + 12 * 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
        })
      });
      showToast('✅ Intervention enregistrée', 'success');
      charger();
    } catch (e) {
      showToast(e.message, 'error');
    }
  };

  const filteredData = data.filter(e =>
    e.code?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    e.designation?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const today = new Date();

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
        <p style={{ color: '#64748b' }}>Chargement des équipements...</p>
      </div>
    );
  }

  const totalEquipements = data.length;
  const aEtalonner = data.filter(e => {
    const date = new Date(e.prochain_etalonnage);
    return date <= new Date(today.getTime() + 30 * 24 * 60 * 60 * 1000);
  }).length;
  const depasse = data.filter(e => new Date(e.prochain_etalonnage) < today).length;

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
              <FaMicroscope style={{ color: '#1d4ed8' }} />
              Équipements
            </h2>
            <p style={{ color: '#64748b', fontSize: '14px', marginTop: '2px' }}>
              {totalEquipements} équipement{totalEquipements > 1 ? 's' : ''} enregistré{totalEquipements > 1 ? 's' : ''}
            </p>
          </div>
          <button
            className="btn-lab btn-lab--primary"
            onClick={() => { resetForm(); setModal({}); }}
            style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
          >
            <FaPlus /> Nouvel équipement
          </button>
        </div>

        {/* Barre de recherche */}
        <div style={{
          marginTop: '16px',
          display: 'flex',
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
            placeholder="Rechercher un équipement par code ou désignation..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            style={{
              border: 'none',
              outline: 'none',
              flex: 1,
              padding: '8px 0',
              fontSize: '14px',
              fontFamily: 'var(--texte)'
            }}
          />
          {searchTerm && (
            <button
              onClick={() => setSearchTerm('')}
              style={{
                background: 'none',
                border: 'none',
                color: '#94a3b8',
                cursor: 'pointer',
                fontSize: '14px'
              }}
            >
              ✕
            </button>
          )}
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
          <div className="stat-card__value">{totalEquipements}</div>
          <div className="stat-card__label">Total équipements</div>
        </div>
        <div className="stat-card stat-card--warning">
          <div className="stat-card__value">{aEtalonner}</div>
          <div className="stat-card__label">À étalonner (30j)</div>
        </div>
        <div className="stat-card stat-card--danger">
          <div className="stat-card__value">{depasse}</div>
          <div className="stat-card__label">Étalonnage dépassé</div>
        </div>
      </div>

      {/* TABLEAU */}
      <div className="tableau-lab">
        <table>
          <thead>
            <tr>
              <th>Code</th>
              <th>Désignation</th>
              <th>Laboratoire</th>
              <th>N° Série</th>
              <th>Prochain étalonnage</th>
              <th style={{ textAlign: 'center' }}>Statut</th>
              <th style={{ textAlign: 'center' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredData.length > 0 ? (
              filteredData.map(e => {
                const etalonnageDate = new Date(e.prochain_etalonnage);
                const diffDays = Math.ceil((etalonnageDate - today) / (1000 * 60 * 60 * 24));
                let statut, statutColor, statutIcon;
                if (diffDays < 0) {
                  statut = 'Dépassé';
                  statutColor = '#dc2626';
                  statutIcon = <FaExclamationTriangle size={14} />;
                } else if (diffDays < 30) {
                  statut = `${diffDays} j`;
                  statutColor = '#f59e0b';
                  statutIcon = <FaClock size={14} />;
                } else {
                  statut = 'OK';
                  statutColor = '#16a34a';
                  statutIcon = <FaCheckCircle size={14} />;
                }

                return (
                  <tr key={e.id}>
                    <td style={{ 
                      fontFamily: 'var(--mono)', 
                      fontSize: '12px', 
                      color: '#64748b',
                      fontWeight: 600
                    }}>
                      <FaBarcode style={{ display: 'inline', marginRight: '4px', fontSize: '11px' }} />
                      {e.code}
                    </td>
                    <td>
                      <strong style={{ color: '#0f2d80' }}>{e.designation}</strong>
                    </td>
                    <td>
                      <span className="badge-lab badge-lab--primary" style={{ fontSize: '11px' }}>
                        <FaFlask size={10} style={{ display: 'inline', marginRight: '4px' }} />
                        {e.laboratoire || '—'}
                      </span>
                    </td>
                    <td style={{ fontFamily: 'var(--mono)', fontSize: '12px', color: '#64748b' }}>
                      {e.numero_serie || '—'}
                    </td>
                    <td style={{ fontFamily: 'var(--mono)', fontSize: '13px', color: '#475569' }}>
                      <FaCalendarAlt size={11} style={{ display: 'inline', marginRight: '4px', color: '#94a3b8' }} />
                      {new Date(e.prochain_etalonnage).toLocaleDateString('fr-FR')}
                    </td>
                    <td style={{ textAlign: 'center' }}>
                      <span className="badge-lab" style={{
                        background: `${statutColor}20`,
                        color: statutColor,
                        fontWeight: 600,
                        fontSize: '11px',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '4px'
                      }}>
                        {statutIcon} {statut}
                      </span>
                    </td>
                    <td style={{ textAlign: 'center' }}>
                      <div style={{ display: 'flex', gap: '6px', justifyContent: 'center' }}>
                        <button
                          className="btn-lab btn-lab--ghost btn-lab--sm"
                          onClick={() => { setForm(e); setModal({ id: e.id }); }}
                          title="Modifier"
                        >
                          <FaEdit />
                        </button>
                        <button
                          className="btn-lab btn-lab--primary btn-lab--sm"
                          onClick={() => handleIntervention(e.id, 'ETALONNAGE')}
                          title="Enregistrer un étalonnage"
                        >
                          <FaTools />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan="7" style={{ 
                  textAlign: 'center', 
                  padding: '60px 20px', 
                  color: '#94a3b8' 
                }}>
                  <div style={{ fontSize: '48px', marginBottom: '12px' }}>🔬</div>
                  <p style={{ fontSize: '16px', fontWeight: 500 }}>
                    {searchTerm ? 'Aucun équipement ne correspond à votre recherche' : 'Aucun équipement enregistré'}
                  </p>
                  <p style={{ fontSize: '13px', marginTop: '4px' }}>
                    {searchTerm ? 'Essayez d\'autres termes' : 'Cliquez sur "Nouvel équipement" pour commencer'}
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
          title={modal.id ? '✏️ Modifier l\'équipement' : '🔬 Nouvel équipement'}
          onClose={() => setModal(null)}
          maxWidth="650px"
        >
          <form onSubmit={handleSubmit}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              <div className="champ-lab">
                <label>Code *</label>
                <input
                  value={form.code || ''}
                  onChange={e => setForm({ ...form, code: e.target.value.toUpperCase() })}
                  required
                  placeholder="EQ-001"
                />
              </div>
              <div className="champ-lab">
                <label>Désignation *</label>
                <input
                  value={form.designation || ''}
                  onChange={e => setForm({ ...form, designation: e.target.value })}
                  required
                  placeholder="Nom de l'équipement"
                />
              </div>
            </div>

            <div className="champ-lab">
              <label>Laboratoire</label>
              <select
                value={form.laboratoire_id || ''}
                onChange={e => setForm({ ...form, laboratoire_id: e.target.value })}
              >
                <option value="">Sélectionner un laboratoire</option>
                {labos.map(l => (
                  <option key={l.id} value={l.id}>{l.code} - {l.nom}</option>
                ))}
              </select>
            </div>

            <div className="champ-lab">
              <label>Numéro de série</label>
              <input
                value={form.numero_serie || ''}
                onChange={e => setForm({ ...form, numero_serie: e.target.value })}
                placeholder="SN-123456"
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              <div className="champ-lab">
                <label>Date de mise en service</label>
                <input
                  type="date"
                  value={form.date_mise_service || ''}
                  onChange={e => setForm({ ...form, date_mise_service: e.target.value })}
                />
              </div>
              <div className="champ-lab">
                <label>Fréquence étalonnage (mois)</label>
                <input
                  type="number"
                  min="1"
                  value={form.frequence_etalonnage_mois || 12}
                  onChange={e => setForm({ ...form, frequence_etalonnage_mois: parseInt(e.target.value) || 12 })}
                />
              </div>
            </div>

            <div className="champ-lab">
              <label>Prochain étalonnage *</label>
              <input
                type="date"
                value={form.prochain_etalonnage || ''}
                onChange={e => setForm({ ...form, prochain_etalonnage: e.target.value })}
                required
              />
              <div style={{ fontSize: '12px', color: '#64748b', marginTop: '4px' }}>
                💡 Date à laquelle l'équipement doit être étalonné
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
    </>
  );
}