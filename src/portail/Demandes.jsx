// frontend/src/portail/Demandes.jsx
import { useEffect, useState, useMemo } from 'react';
import { api, fcfa, formatDate, telechargerFichier } from '../api.js';
import Modal from '../components/Modal.jsx';
import { 
  FaClipboardList, 
  FaPlus, 
  FaSearch, 
  FaEye, 
  FaFilePdf, 
  FaFileWord,
  FaSort,
  FaSortUp,
  FaSortDown,
  FaTimes,
  FaChartBar,
  FaUsers,
  FaFlask,
  FaClock,
  FaCheckCircle,
  FaExclamationTriangle,
  FaFileAlt,
  FaCreditCard,
  FaLock,
  FaBan,
  FaEdit,
  FaTrash,
  FaPrint,
  FaDownload,
  FaFileInvoice,
  FaCalendarAlt,
  FaUserTie,
  FaBoxes,
  FaMicroscope,
  FaArrowRight,
  FaList,
  FaThLarge,
  FaFilter,
  FaUndo,
  FaRedo,
  FaSave,
  FaTimesCircle,
  FaCheck,
  FaSpinner
} from 'react-icons/fa';

export default function Demandes({ showToast }) {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState(null);
  const [detailModal, setDetailModal] = useState(null);
  const [clients, setClients] = useState([]);
  const [typesAnalyse, setTypesAnalyse] = useState([]);
  
  // États pour recherche, filtres et tri
  const [searchTerm, setSearchTerm] = useState('');
  const [filtreStatut, setFiltreStatut] = useState('TOUS');
  const [sortField, setSortField] = useState('date_reception');
  const [sortDirection, setSortDirection] = useState('desc');
  const [showStats, setShowStats] = useState(true);
  const [viewMode, setViewMode] = useState('table'); // 'table' | 'cards'
  const [selectedIds, setSelectedIds] = useState([]);
  
  const [form, setForm] = useState({
    client_id: '',
    objet: '',
    urgence: false,
    date_echeance: '',
    echantillons: [{ matrice: 'SOL', designation: '', analyses: [] }]
  });

  const charger = async () => {
    try {
      setLoading(true);
      const [demandes, clientsList, analysesList] = await Promise.all([
        api('/demandes'),
        api('/clients'),
        api('/analyses/catalogue')
      ]);
      setData(demandes || []);
      setClients(clientsList || []);
      setTypesAnalyse(analysesList || []);
    } catch (e) {
      showToast(e.message, 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { charger(); }, []);

  // Statistiques avec useMemo
  const stats = useMemo(() => ({
    total: data.length,
    brouillon: data.filter(d => d.statut === 'BROUILLON').length,
    enregistree: data.filter(d => d.statut === 'ENREGISTREE').length,
    enCours: data.filter(d => d.statut === 'EN_COURS').length,
    validee: data.filter(d => d.statut === 'VALIDEE').length,
    rapportEmis: data.filter(d => d.statut === 'RAPPORT_EMIS').length,
    facturee: data.filter(d => d.statut === 'FACTUREE').length,
    cloturee: data.filter(d => d.statut === 'CLOTUREE').length,
    annulee: data.filter(d => d.statut === 'ANNULEE').length,
    urgence: data.filter(d => d.urgence).length,
  }), [data]);

  // Filtrer et trier les données
  const filteredData = useMemo(() => {
    let result = [...data];
    
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      result = result.filter(d =>
        d.numero?.toLowerCase().includes(term) ||
        d.raison_sociale?.toLowerCase().includes(term) ||
        d.objet?.toLowerCase().includes(term)
      );
    }
    
    if (filtreStatut !== 'TOUS') {
      result = result.filter(d => d.statut === filtreStatut);
    }
    
    result.sort((a, b) => {
      let valA = a[sortField];
      let valB = b[sortField];
      
      if (sortField === 'date_reception') {
        valA = new Date(valA);
        valB = new Date(valB);
      }
      
      if (sortField === 'nb_echantillons') {
        valA = Number(valA) || 0;
        valB = Number(valB) || 0;
      }
      
      if (typeof valA === 'string') {
        valA = valA?.toLowerCase() || '';
        valB = valB?.toLowerCase() || '';
      }
      
      if (valA < valB) return sortDirection === 'asc' ? -1 : 1;
      if (valA > valB) return sortDirection === 'asc' ? 1 : -1;
      return 0;
    });
    
    return result;
  }, [data, searchTerm, filtreStatut, sortField, sortDirection]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const echantillonsValides = form.echantillons.filter(ech =>
        ech.designation.trim() !== '' && ech.analyses.length > 0
      );

      if (echantillonsValides.length === 0) {
        showToast('Ajoutez au moins un échantillon avec une analyse', 'error');
        return;
      }

      if (!form.client_id) {
        showToast('Veuillez sélectionner un client', 'error');
        return;
      }

      if (!form.objet.trim()) {
        showToast('Veuillez saisir un objet pour la demande', 'error');
        return;
      }

      const payload = {
        client_id: form.client_id,
        objet: form.objet.trim(),
        urgence: form.urgence,
        date_echeance: form.date_echeance || null,
        echantillons: echantillonsValides.map(ech => ({
          matrice: ech.matrice,
          designation: ech.designation.trim(),
          lieu_prelevement: ech.lieu_prelevement || '',
          quantite: parseInt(ech.quantite) || 1,
          analyses: ech.analyses.map(a => parseInt(a))
        }))
      };

      await api('/demandes', {
        method: 'POST',
        body: JSON.stringify(payload)
      });

      showToast('✅ Demande créée avec succès', 'success');
      setModal(null);
      resetForm();
      charger();
    } catch (e) {
      showToast(e.message, 'error');
    }
  };

  const resetForm = () => {
    setForm({
      client_id: clients[0]?.id || '',
      objet: '',
      urgence: false,
      date_echeance: '',
      echantillons: [{ matrice: 'SOL', designation: '', analyses: [] }]
    });
  };

  const handleChangerStatut = async (id, statut) => {
    try {
      await api(`/demandes/${id}/statut`, {
        method: 'PATCH',
        body: JSON.stringify({ statut })
      });
      showToast(`✅ Statut mis à jour: ${statut}`, 'success');
      charger();
    } catch (e) {
      showToast(e.message, 'error');
    }
  };

  const handleVoirDetail = async (id) => {
    try {
      const detail = await api(`/demandes/${id}`);
      setDetailModal(detail);
    } catch (e) {
      showToast(e.message, 'error');
    }
  };

  const ajouterEchantillon = () => {
    setForm({
      ...form,
      echantillons: [...form.echantillons, { matrice: 'SOL', designation: '', analyses: [] }]
    });
  };

  const supprimerEchantillon = (index) => {
    if (form.echantillons.length <= 1) return;
    const newEchantillons = form.echantillons.filter((_, i) => i !== index);
    setForm({ ...form, echantillons: newEchantillons });
  };

  const updateEchantillon = (index, field, value) => {
    const newEchantillons = [...form.echantillons];
    newEchantillons[index][field] = value;
    setForm({ ...form, echantillons: newEchantillons });
  };

  const toggleAnalyse = (echIndex, analyseId) => {
    const newEchantillons = [...form.echantillons];
    const analyses = newEchantillons[echIndex].analyses || [];
    const idx = analyses.indexOf(analyseId);
    if (idx > -1) {
      analyses.splice(idx, 1);
    } else {
      analyses.push(analyseId);
    }
    newEchantillons[echIndex].analyses = analyses;
    setForm({ ...form, echantillons: newEchantillons });
  };

  const toggleSelection = (id) => {
    setSelectedIds(prev =>
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  const toggleAllSelection = () => {
    if (selectedIds.length === filteredData.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(filteredData.map(d => d.id));
    }
  };

  // Fonction de tri
  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  // Icône de tri
  const SortIcon = ({ field }) => {
    if (sortField !== field) return <FaSort size={12} style={{ opacity: 0.3 }} />;
    return sortDirection === 'asc' ? <FaSortUp size={12} /> : <FaSortDown size={12} />;
  };

  // Couleurs des statuts
  const statutColors = {
    BROUILLON: { bg: '#e2e8f0', color: '#475569', icon: FaEdit, label: 'Brouillon' },
    ENREGISTREE: { bg: '#dbeafe', color: '#1e40af', icon: FaSave, label: 'Enregistrée' },
    EN_COURS: { bg: '#fef3c7', color: '#92400e', icon: FaSpinner, label: 'En cours' },
    VALIDEE: { bg: '#dcebdd', color: '#1d5c2e', icon: FaCheckCircle, label: 'Validée' },
    RAPPORT_EMIS: { bg: '#ede9fe', color: '#5b21b6', icon: FaFileAlt, label: 'Rapport émis' },
    FACTUREE: { bg: '#cffafe', color: '#0891b2', icon: FaFileInvoice, label: 'Facturée' },
    CLOTUREE: { bg: '#e2e8f0', color: '#475569', icon: FaLock, label: 'Clôturée' },
    ANNULEE: { bg: '#fee2e2', color: '#dc2626', icon: FaBan, label: 'Annulée' }
  };

  const statutLabels = {
    BROUILLON: '📝 Brouillon',
    ENREGISTREE: '📥 Enregistrée',
    EN_COURS: '🔄 En cours',
    VALIDEE: '✅ Validée',
    RAPPORT_EMIS: '📄 Rapport émis',
    FACTUREE: '💰 Facturée',
    CLOTUREE: '🔒 Clôturée',
    ANNULEE: '❌ Annulée'
  };

  // Statistiques legacy
  const statsLegacy = {
    total: data.length,
    brouillon: data.filter(d => d.statut === 'BROUILLON').length,
    enregistree: data.filter(d => d.statut === 'ENREGISTREE').length,
    enCours: data.filter(d => d.statut === 'EN_COURS').length,
    validee: data.filter(d => d.statut === 'VALIDEE').length,
    rapportEmis: data.filter(d => d.statut === 'RAPPORT_EMIS').length,
    facturee: data.filter(d => d.statut === 'FACTUREE').length,
    cloturee: data.filter(d => d.statut === 'CLOTUREE').length,
    annulee: data.filter(d => d.statut === 'ANNULEE').length,
  };

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
        <p style={{ color: '#64748b' }}>
          <FaSpinner style={{ display: 'inline', marginRight: '8px', animation: 'spin 1s linear infinite' }} />
          Chargement des demandes...
        </p>
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
          <h2 style={{ fontSize: '22px', fontWeight: 800, color: '#0f2d80', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <FaClipboardList style={{ color: '#1d4ed8' }} />
            Demandes d'analyses
            <span style={{
              fontSize: '14px',
              fontWeight: 400,
              color: '#94a3b8',
              background: '#f1f5f9',
              padding: '2px 12px',
              borderRadius: '20px'
            }}>
              {data.length}
            </span>
          </h2>
          <div style={{ 
            display: 'flex', 
            gap: '16px', 
            marginTop: '4px', 
            fontSize: '13px', 
            color: '#64748b', 
            flexWrap: 'wrap' 
          }}>
            <span><FaClipboardList style={{ display: 'inline', marginRight: '4px' }} /> Total: <strong>{statsLegacy.total}</strong></span>
            <span><FaEdit style={{ display: 'inline', marginRight: '4px', color: '#94a3b8' }} /> Brouillons: <strong>{statsLegacy.brouillon}</strong></span>
            <span><FaSave style={{ display: 'inline', marginRight: '4px', color: '#1e40af' }} /> Enregistrées: <strong>{statsLegacy.enregistree}</strong></span>
            <span><FaSpinner style={{ display: 'inline', marginRight: '4px', color: '#f59e0b' }} /> En cours: <strong>{statsLegacy.enCours}</strong></span>
            <span><FaCheckCircle style={{ display: 'inline', marginRight: '4px', color: '#16a34a' }} /> Validées: <strong>{statsLegacy.validee}</strong></span>
            <span><FaFileAlt style={{ display: 'inline', marginRight: '4px', color: '#8b5cf6' }} /> Rapports: <strong>{statsLegacy.rapportEmis}</strong></span>
            <span><FaFileInvoice style={{ display: 'inline', marginRight: '4px', color: '#0891b2' }} /> Facturées: <strong>{statsLegacy.facturee}</strong></span>
            <span><FaLock style={{ display: 'inline', marginRight: '4px', color: '#475569' }} /> Clôturées: <strong>{statsLegacy.cloturee}</strong></span>
            {statsLegacy.annulee > 0 && (
              <span><FaBan style={{ display: 'inline', marginRight: '4px', color: '#dc2626' }} /> Annulées: <strong>{statsLegacy.annulee}</strong></span>
            )}
            <span style={{ color: '#dc2626' }}>
              <FaExclamationTriangle style={{ display: 'inline', marginRight: '4px' }} />
              Urgences: <strong>{stats.urgence}</strong>
            </span>
          </div>
        </div>
        <button
          className="btn-lab btn-lab--primary"
          onClick={() => {
            resetForm();
            setModal({ type: 'create' });
          }}
          style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 20px' }}
        >
          <FaPlus /> Nouvelle demande
        </button>
      </div>

      {/* BARRE DE RECHERCHE ET FILTRES */}
      <div style={{
        display: 'flex',
        flexWrap: 'wrap',
        gap: '12px',
        marginBottom: '16px',
        alignItems: 'center',
        background: 'white',
        padding: '12px 16px',
        borderRadius: '12px',
        border: '1px solid #e2e8f0',
        boxShadow: '0 1px 3px rgba(0,0,0,0.04)'
      }}>
        <div style={{
          flex: 1,
          minWidth: '200px',
          display: 'flex',
          gap: '12px',
          alignItems: 'center'
        }}>
          <FaSearch style={{ color: '#94a3b8' }} />
          <input
            type="text"
            placeholder="Rechercher par n°, client ou objet..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            style={{
              border: 'none',
              outline: 'none',
              flex: 1,
              padding: '8px 0',
              fontSize: '14px',
              fontFamily: 'var(--texte)',
              background: 'transparent'
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
                fontSize: '14px',
                padding: '4px'
              }}
            >
              <FaTimes />
            </button>
          )}
        </div>

        <div style={{ display: 'flex', gap: '8px', alignItems: 'center', flexWrap: 'wrap' }}>
          <FaFilter style={{ color: '#94a3b8' }} />
          <select
            value={filtreStatut}
            onChange={e => setFiltreStatut(e.target.value)}
            style={{
              padding: '6px 12px',
              borderRadius: '6px',
              border: '1px solid #e2e8f0',
              fontSize: '13px',
              background: 'white',
              cursor: 'pointer'
            }}
          >
            <option value="TOUS">📋 Tous</option>
            <option value="BROUILLON">📝 Brouillon</option>
            <option value="ENREGISTREE">📥 Enregistrée</option>
            <option value="EN_COURS">🔄 En cours</option>
            <option value="VALIDEE">✅ Validée</option>
            <option value="RAPPORT_EMIS">📄 Rapport émis</option>
            <option value="FACTUREE">💰 Facturée</option>
            <option value="CLOTUREE">🔒 Clôturée</option>
            <option value="ANNULEE">❌ Annulée</option>
          </select>
        </div>

        <div style={{ display: 'flex', gap: '4px' }}>
          <button
            className={`btn-lab ${viewMode === 'table' ? 'btn-lab--primary' : 'btn-lab--ghost'}`}
            onClick={() => setViewMode('table')}
            style={{ padding: '6px 10px' }}
            title="Vue tableau"
          >
            <FaList />
          </button>
          <button
            className={`btn-lab ${viewMode === 'cards' ? 'btn-lab--primary' : 'btn-lab--ghost'}`}
            onClick={() => setViewMode('cards')}
            style={{ padding: '6px 10px' }}
            title="Vue cartes"
          >
            <FaThLarge />
          </button>
        </div>

        <button
          className="btn-lab btn-lab--ghost"
          onClick={() => setShowStats(!showStats)}
          style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '6px 12px' }}
        >
          <FaChartBar />
          {showStats ? 'Masquer stats' : 'Afficher stats'}
        </button>

        {selectedIds.length > 0 && (
          <span style={{ fontSize: '12px', color: '#1d4ed8', fontWeight: 600 }}>
            {selectedIds.length} sélectionné{selectedIds.length > 1 ? 's' : ''}
          </span>
        )}

        <span style={{ fontSize: '12px', color: '#94a3b8', marginLeft: 'auto' }}>
          {filteredData.length} résultat{filteredData.length > 1 ? 's' : ''}
        </span>
      </div>

      {/* STATISTIQUES VISUELLES */}
      {showStats && (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(120px, 1fr))',
          gap: '10px',
          marginBottom: '16px'
        }}>
          <div className="stat-card" style={{ borderLeftColor: '#1d4ed8' }}>
            <div className="stat-card__value">{stats.total}</div>
            <div className="stat-card__label"><FaClipboardList style={{ display: 'inline', marginRight: '4px' }} /> Total</div>
          </div>
          <div className="stat-card" style={{ borderLeftColor: '#f59e0b' }}>
            <div className="stat-card__value">{stats.enCours}</div>
            <div className="stat-card__label"><FaSpinner style={{ display: 'inline', marginRight: '4px' }} /> En cours</div>
          </div>
          <div className="stat-card" style={{ borderLeftColor: '#16a34a' }}>
            <div className="stat-card__value">{stats.validee}</div>
            <div className="stat-card__label"><FaCheckCircle style={{ display: 'inline', marginRight: '4px' }} /> Validées</div>
          </div>
          <div className="stat-card" style={{ borderLeftColor: '#8b5cf6' }}>
            <div className="stat-card__value">{stats.rapportEmis}</div>
            <div className="stat-card__label"><FaFileAlt style={{ display: 'inline', marginRight: '4px' }} /> Rapports</div>
          </div>
          <div className="stat-card" style={{ borderLeftColor: '#dc2626' }}>
            <div className="stat-card__value">{stats.urgence}</div>
            <div className="stat-card__label"><FaExclamationTriangle style={{ display: 'inline', marginRight: '4px' }} /> Urgences</div>
          </div>
        </div>
      )}

      {/* TABLEAU */}
      <div className="tableau-lab">
        <table>
          <thead>
            <tr>
              <th style={{ width: '30px' }}>
                <input
                  type="checkbox"
                  checked={selectedIds.length === filteredData.length && filteredData.length > 0}
                  onChange={toggleAllSelection}
                  style={{ cursor: 'pointer' }}
                />
              </th>
              <th onClick={() => handleSort('numero')} style={{ cursor: 'pointer' }}>
                N° <SortIcon field="numero" />
              </th>
              <th onClick={() => handleSort('raison_sociale')} style={{ cursor: 'pointer' }}>
                Client <SortIcon field="raison_sociale" />
              </th>
              <th onClick={() => handleSort('objet')} style={{ cursor: 'pointer' }}>
                Objet <SortIcon field="objet" />
              </th>
              <th style={{ textAlign: 'center', cursor: 'pointer' }} onClick={() => handleSort('nb_echantillons')}>
                <FaFlask /> <SortIcon field="nb_echantillons" />
              </th>
              <th style={{ textAlign: 'center' }}>Statut</th>
              <th style={{ textAlign: 'center', cursor: 'pointer' }} onClick={() => handleSort('date_reception')}>
                <FaCalendarAlt /> <SortIcon field="date_reception" />
              </th>
              <th style={{ textAlign: 'center' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredData.length > 0 ? (
              filteredData.map(d => {
                const statutInfo = statutColors[d.statut] || { bg: '#e2e8f0', color: '#475569', icon: FaClipboardList };
                const StatusIcon = statutInfo.icon;
                const isUrgent = d.urgence;
                const isSelected = selectedIds.includes(d.id);
                
                return (
                  <tr key={d.id} style={{
                    borderLeft: isUrgent ? '3px solid #dc2626' : 'none',
                    background: isSelected ? '#e8edfd' : 'transparent'
                  }}>
                    <td>
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => toggleSelection(d.id)}
                        style={{ cursor: 'pointer' }}
                      />
                    </td>
                    <td style={{
                      fontFamily: 'var(--mono)',
                      fontSize: '12px',
                      color: '#64748b',
                      fontWeight: 600
                    }}>
                      {d.numero}
                      {isUrgent && <FaExclamationTriangle style={{ marginLeft: '4px', color: '#dc2626' }} size={12} />}
                    </td>
                    <td>
                      <strong style={{ color: '#0f2d80' }}>
                        <FaUserTie style={{ display: 'inline', marginRight: '4px', color: '#94a3b8' }} />
                        {d.raison_sociale}
                      </strong>
                    </td>
                    <td style={{ maxWidth: '180px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {d.objet}
                    </td>
                    <td style={{ textAlign: 'center' }}>
                      <span className="badge-lab badge-lab--primary" style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                        <FaFlask size={10} />
                        {d.nb_echantillons || 0}
                      </span>
                    </td>
                    <td style={{ textAlign: 'center' }}>
                      <span className="badge-lab" style={{
                        background: statutInfo.bg,
                        color: statutInfo.color,
                        fontWeight: 600,
                        fontSize: '11px',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '4px'
                      }}>
                        <StatusIcon size={12} />
                        {statutLabels[d.statut] || d.statut}
                      </span>
                    </td>
                    <td style={{ textAlign: 'center', fontSize: '13px', color: '#64748b' }}>
                      {formatDate(d.date_reception)}
                    </td>
                    <td style={{ textAlign: 'center' }}>
                      <div style={{ display: 'flex', gap: '4px', justifyContent: 'center', flexWrap: 'wrap' }}>
                        <button
                          className="btn-lab btn-lab--ghost btn-lab--sm"
                          onClick={() => handleVoirDetail(d.id)}
                          title="Voir détails"
                        >
                          <FaEye />
                        </button>
                        <button
                          className="btn-lab btn-lab--ghost btn-lab--sm"
                          title="Rapport PDF"
                          onClick={async () => {
                            try {
                              await telechargerFichier(`/rapports/demande/${d.id}/pdf`, `Rapport_${d.numero}.pdf`);
                              showToast?.('📄 Rapport PDF téléchargé', 'success');
                            } catch (e) {
                              if (e.message.includes('non validé')) {
                                if (confirm(e.message + '\n\nTélécharger un PDF PROVISOIRE filigrané ?')) {
                                  try {
                                    await telechargerFichier(`/rapports/demande/${d.id}/pdf?brouillon=1`, `Rapport_PROVISOIRE_${d.numero}.pdf`);
                                    showToast?.('PDF provisoire téléchargé', 'success');
                                  } catch (e2) { showToast?.(e2.message, 'error'); }
                                }
                              } else showToast?.(e.message, 'error');
                            }
                          }}
                        >
                          <FaFilePdf style={{ color: '#dc2626' }} />
                        </button>
                        <button
                          className="btn-lab btn-lab--ghost btn-lab--sm"
                          title="Rapport Word"
                          onClick={async () => {
                            try {
                              await telechargerFichier(`/rapports/demande/${d.id}/docx`, `Rapport_${d.numero}.docx`);
                              showToast?.('Rapport Word téléchargé', 'success');
                            } catch (e) { showToast?.(e.message, 'error'); }
                          }}
                        >
                          <FaFileWord style={{ color: '#1d4ed8' }} />
                        </button>
                        <select
                          value={d.statut}
                          onChange={e => handleChangerStatut(d.id, e.target.value)}
                          style={{
                            padding: '2px 6px',
                            borderRadius: '4px',
                            border: '1px solid #e2e8f0',
                            fontSize: '11px',
                            background: 'white',
                            cursor: 'pointer',
                            fontFamily: 'var(--texte)',
                            maxWidth: '100px'
                          }}
                        >
                          <option value="BROUILLON">📝 Brouillon</option>
                          <option value="ENREGISTREE">📥 Enregistrée</option>
                          <option value="EN_COURS">🔄 En cours</option>
                          <option value="VALIDEE">✅ Validée</option>
                          <option value="RAPPORT_EMIS">📄 Rapport émis</option>
                          <option value="FACTUREE">💰 Facturée</option>
                          <option value="CLOTUREE">🔒 Clôturée</option>
                          <option value="ANNULEE">❌ Annulée</option>
                        </select>
                      </div>
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan="8" style={{ textAlign: 'center', padding: '60px 20px', color: '#94a3b8' }}>
                  <div style={{ fontSize: '48px', marginBottom: '12px' }}>
                    {searchTerm || filtreStatut !== 'TOUS' ? '🔍' : '📋'}
                  </div>
                  <p style={{ fontSize: '16px', fontWeight: 500 }}>
                    {searchTerm || filtreStatut !== 'TOUS' 
                      ? 'Aucune demande ne correspond à vos critères' 
                      : 'Aucune demande enregistrée'}
                  </p>
                  <p style={{ fontSize: '13px', marginTop: '4px' }}>
                    {searchTerm || filtreStatut !== 'TOUS' 
                      ? 'Essayez d\'autres filtres' 
                      : 'Cliquez sur "Nouvelle demande" pour commencer'}
                  </p>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* MODAL - Création */}
      {modal?.type === 'create' && (
        <Modal title="Nouvelle demande d'analyse" onClose={() => setModal(null)} maxWidth="700px">
          <form onSubmit={handleSubmit}>
            {/* Informations générales */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              <div className="champ-lab">
                <label><FaUserTie style={{ marginRight: '4px' }} /> Client *</label>
                <select
                  value={form.client_id}
                  onChange={e => setForm({ ...form, client_id: e.target.value })}
                  required
                >
                  <option value="">Sélectionner un client</option>
                  {clients.map(c => (
                    <option key={c.id} value={c.id}>{c.raison_sociale}</option>
                  ))}
                </select>
                {clients.length === 0 && (
                  <p style={{ color: '#dc2626', fontSize: '12px', marginTop: '4px' }}>
                    <FaExclamationTriangle style={{ marginRight: '4px' }} />
                    Aucun client disponible. Créez d'abord un client.
                  </p>
                )}
              </div>
              <div className="champ-lab">
                <label><FaClipboardList style={{ marginRight: '4px' }} /> Objet *</label>
                <input
                  value={form.objet}
                  onChange={e => setForm({ ...form, objet: e.target.value })}
                  placeholder="Ex: Analyse de sols agricoles"
                  required
                />
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              <div className="champ-lab">
                <label><FaCalendarAlt style={{ marginRight: '4px' }} /> Date d'échéance</label>
                <input
                  type="date"
                  value={form.date_echeance || ''}
                  onChange={e => setForm({ ...form, date_echeance: e.target.value })}
                />
              </div>
              <div className="champ-lab" style={{ flexDirection: 'row', alignItems: 'center', gap: '10px', marginTop: '8px' }}>
                <label style={{ marginBottom: 0, display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <FaExclamationTriangle style={{ color: '#dc2626' }} /> Urgence
                </label>
                <input
                  type="checkbox"
                  checked={form.urgence}
                  onChange={e => setForm({ ...form, urgence: e.target.checked })}
                  style={{ width: '18px', height: '18px' }}
                />
              </div>
            </div>

            {/* Échantillons */}
            <div style={{ marginTop: '16px', borderTop: '2px solid #e2e8f0', paddingTop: '16px' }}>
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '12px'
              }}>
                <h3 style={{ fontSize: '16px', fontWeight: 700, color: '#0f2d80', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <FaFlask style={{ color: '#1d4ed8' }} />
                  Échantillons
                </h3>
                <button
                  type="button"
                  className="btn-lab btn-lab--primary btn-lab--sm"
                  onClick={ajouterEchantillon}
                  style={{ display: 'flex', alignItems: 'center', gap: '4px' }}
                >
                  <FaPlus size={12} /> Ajouter
                </button>
              </div>

              {form.echantillons.map((ech, idx) => (
                <div
                  key={idx}
                  style={{
                    background: '#f8fafc',
                    borderRadius: '8px',
                    padding: '16px',
                    marginBottom: '12px',
                    border: '1px solid #e2e8f0'
                  }}
                >
                  <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginBottom: '8px'
                  }}>
                    <span style={{ fontWeight: 600, fontSize: '14px', color: '#0f2d80', display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <FaFlask /> Échantillon #{idx + 1}
                    </span>
                    <button
                      type="button"
                      className="btn-lab btn-lab--danger btn-lab--xs"
                      onClick={() => supprimerEchantillon(idx)}
                      disabled={form.echantillons.length <= 1}
                    >
                      <FaTimes />
                    </button>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                    <div className="champ-lab" style={{ marginBottom: 0 }}>
                      <label>Matrice</label>
                      <select
                        value={ech.matrice}
                        onChange={e => updateEchantillon(idx, 'matrice', e.target.value)}
                      >
                        {['SOL', 'EAU', 'PLANTE', 'ENGRAIS', 'MINERAI', 'HYDROCARBURE', 'AUTRE'].map(m => (
                          <option key={m}>{m}</option>
                        ))}
                      </select>
                    </div>
                    <div className="champ-lab" style={{ marginBottom: 0 }}>
                      <label>Désignation *</label>
                      <input
                        value={ech.designation}
                        onChange={e => updateEchantillon(idx, 'designation', e.target.value)}
                        placeholder="Ex: Échantillon de terre"
                        required
                      />
                    </div>
                  </div>

                  {/* Analyses pour cet échantillon */}
                  <div style={{ marginTop: '10px' }}>
                    <div style={{ 
                      fontSize: '12px', 
                      fontWeight: 600, 
                      color: '#64748b', 
                      marginBottom: '6px',
                      display: 'flex',
                      justifyContent: 'space-between'
                    }}>
                      <span><FaMicroscope style={{ marginRight: '4px' }} /> Analyses sélectionnées ({ech.analyses?.length || 0})</span>
                      {ech.analyses?.length > 0 && (
                        <span style={{ color: '#1d4ed8', fontWeight: 500 }}>
                          <FaCreditCard style={{ marginRight: '4px' }} />
                          {fcfa(ech.analyses.reduce((sum, id) => {
                            const a = typesAnalyse.find(t => (t.id || t.code) === id);
                            return sum + (a?.prix_fcfa || 0);
                          }, 0))}
                        </span>
                      )}
                    </div>
                    <div style={{
                      display: 'flex',
                      gap: '6px',
                      flexWrap: 'wrap',
                      maxHeight: '100px',
                      overflowY: 'auto',
                      padding: '4px 0'
                    }}>
                      {typesAnalyse.map(a => {
                        const id = a.id || a.code;
                        const isSelected = (ech.analyses || []).includes(id);
                        return (
                          <button
                            key={id}
                            type="button"
                            onClick={() => toggleAnalyse(idx, id)}
                            style={{
                              padding: '4px 12px',
                              borderRadius: '20px',
                              border: isSelected
                                ? '2px solid #1d4ed8'
                                : '1px solid #e2e8f0',
                              background: isSelected
                                ? '#e8edfd'
                                : 'transparent',
                              color: isSelected
                                ? '#1d4ed8'
                                : '#64748b',
                              fontSize: '11px',
                              cursor: 'pointer',
                              transition: 'all 0.2s ease',
                              fontFamily: 'var(--texte)',
                              whiteSpace: 'nowrap',
                              display: 'flex',
                              alignItems: 'center',
                              gap: '4px'
                            }}
                          >
                            {isSelected ? <FaCheck size={10} /> : null}
                            {a.code} - {a.nom}
                          </button>
                        );
                      })}
                      {typesAnalyse.length === 0 && (
                        <p style={{ color: '#94a3b8', fontSize: '12px' }}>
                          <FaExclamationTriangle style={{ marginRight: '4px' }} />
                          Aucune analyse disponible dans le catalogue
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div style={{ display: 'flex', gap: '12px', marginTop: '20px' }}>
              <button type="submit" className="btn-lab btn-lab--primary" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <FaSave /> Créer la demande
              </button>
              <button type="button" className="btn-lab btn-lab--ghost" onClick={() => setModal(null)} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <FaTimesCircle /> Annuler
              </button>
            </div>
          </form>
        </Modal>
      )}

      {/* MODAL - Détail */}
      {detailModal && (
        <Modal title={`Détail - ${detailModal.numero}`} onClose={() => setDetailModal(null)} maxWidth="800px">
          <div style={{ marginBottom: '16px' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              <div>
                <div style={{ fontSize: '12px', color: '#94a3b8' }}><FaUserTie style={{ marginRight: '4px' }} /> Client</div>
                <div style={{ fontWeight: 600 }}>{detailModal.raison_sociale}</div>
              </div>
              <div>
                <div style={{ fontSize: '12px', color: '#94a3b8' }}><FaClipboardList style={{ marginRight: '4px' }} /> Objet</div>
                <div style={{ fontWeight: 600 }}>{detailModal.objet}</div>
              </div>
              <div>
                <div style={{ fontSize: '12px', color: '#94a3b8' }}><FaClipboardList style={{ marginRight: '4px' }} /> Statut</div>
                <div>
                  <span className={`badge-lab ${statutColors[detailModal.statut]?.bg ? '' : 'badge-lab--info'}`} style={{
                    background: statutColors[detailModal.statut]?.bg || '#e2e8f0',
                    color: statutColors[detailModal.statut]?.color || '#475569',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '4px'
                  }}>
                    {statutColors[detailModal.statut]?.icon && <span>{statutColors[detailModal.statut].icon({ size: 12 })}</span>}
                    {statutLabels[detailModal.statut] || detailModal.statut}
                  </span>
                </div>
              </div>
              <div>
                <div style={{ fontSize: '12px', color: '#94a3b8' }}><FaCalendarAlt style={{ marginRight: '4px' }} /> Date de réception</div>
                <div>{formatDate(detailModal.date_reception)}</div>
              </div>
              {detailModal.urgence && (
                <div style={{ gridColumn: 'span 2' }}>
                  <span style={{ color: '#dc2626', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <FaExclamationTriangle /> Demande urgente
                  </span>
                </div>
              )}
            </div>
          </div>

          <h4 style={{ marginBottom: '12px', color: '#0f2d80', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <FaFlask style={{ color: '#1d4ed8' }} />
            Échantillons
          </h4>
          <div className="tableau-lab">
            <table>
              <thead>
                <tr>
                  <th><FaBoxes style={{ marginRight: '4px' }} /> Code</th>
                  <th><FaFlask style={{ marginRight: '4px' }} /> Matrice</th>
                  <th>Désignation</th>
                  <th><FaMicroscope style={{ marginRight: '4px' }} /> Analyses</th>
                </tr>
              </thead>
              <tbody>
                {detailModal.echantillons?.map(e => (
                  <tr key={e.id}>
                    <td style={{ fontFamily: 'var(--mono)', fontSize: '12px', color: '#64748b' }}>
                      {e.code}
                    </td>
                    <td><span className="badge-lab badge-lab--primary">{e.matrice}</span></td>
                    <td>{e.designation}</td>
                    <td>
                      {e.analyses?.filter(a => a).map((a, i) => (
                        <span key={i} className="badge-lab badge-lab--info" style={{ margin: '2px' }}>
                          {a.analyse}
                        </span>
                      ))}
                    </td>
                  </tr>
                ))}
                {(!detailModal.echantillons || detailModal.echantillons.length === 0) && (
                  <tr>
                    <td colSpan="4" style={{ textAlign: 'center', padding: '20px', color: '#94a3b8' }}>
                      <FaFlask style={{ marginRight: '4px' }} />
                      Aucun échantillon
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          <div style={{ marginTop: '16px', display: 'flex', gap: '12px' }}>
            <button className="btn-lab btn-lab--primary" onClick={() => setDetailModal(null)} style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <FaTimesCircle /> Fermer
            </button>
            <button 
              className="btn-lab btn-lab--ghost" 
              onClick={async () => {
                try {
                  await telechargerFichier(`/rapports/demande/${detailModal.id}/pdf`, `Rapport_${detailModal.numero}.pdf`);
                  showToast?.('📄 Rapport PDF téléchargé', 'success');
                } catch (e) {
                  if (e.message.includes('non validé')) {
                    if (confirm(e.message + '\n\nTélécharger un PDF PROVISOIRE ?')) {
                      try {
                        await telechargerFichier(`/rapports/demande/${detailModal.id}/pdf?brouillon=1`, `Rapport_PROVISOIRE_${detailModal.numero}.pdf`);
                        showToast?.('PDF provisoire téléchargé', 'success');
                      } catch (e2) { showToast?.(e2.message, 'error'); }
                    }
                  } else showToast?.(e.message, 'error');
                }
              }}
              style={{ display: 'flex', alignItems: 'center', gap: '6px' }}
            >
              <FaFilePdf /> PDF
            </button>
          </div>
        </Modal>
      )}

      {/* Style pour les animations */}
      <style>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </>
  );
}