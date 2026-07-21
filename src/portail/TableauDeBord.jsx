// frontend/src/portail/TableauDeBord.jsx
import { useEffect, useState } from 'react';
import { api, fcfa } from '../api.js';
import { 
  FaUsers, 
  FaClipboardList, 
  FaFlask, 
  FaBox, 
  FaCreditCard, 
  FaExclamationTriangle,
  FaCheckCircle,
  FaClock,
  FaFileAlt,
  FaChartLine,  // ✅ Remplacé FaTrendUp par FaChartLine
  FaChartPie,
  FaCalendarAlt,
  FaMicroscope,
  FaChartBar
} from 'react-icons/fa';

export default function TableauDeBord({ utilisateur }) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [erreur, setErreur] = useState('');

  useEffect(() => {
    api('/dashboard')
      .then(setData)
      .catch(e => setErreur(e.message))
      .finally(() => setLoading(false));
  }, []);

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
        <p style={{ color: '#64748b' }}>Chargement du tableau de bord...</p>
      </div>
    );
  }

  if (erreur) {
    return (
      <div style={{ background: '#fee2e2', color: '#dc2626', padding: '16px 20px', borderRadius: '12px' }}>
        ❌ {erreur}
      </div>
    );
  }

  const today = new Date();
  const options = { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' };

  // Statistiques calculées
  const stats = {
    totalClients: data?.total_clients || 0,
    demandesEnCours: data?.demandes_par_statut?.find(d => d.statut === 'EN_COURS')?.n || 0,
    demandesTotal: data?.total_demandes || 0,
    echantillonsActifs: data?.echantillons_actifs || 0,
    analysesEnAttente: data?.analyses_en_attente || 0,
    alertesStock: data?.alertes_stock || 0,
    etalonnages: data?.etalonnages_a_prevoir || 0,
    creances: data?.montant_impaye_fcfa || 0,
    totalFactures: data?.total_factures || 0,
    demandesValidees: data?.demandes_par_statut?.find(d => d.statut === 'VALIDEE')?.n || 0,
    rapportsEmis: data?.demandes_par_statut?.find(d => d.statut === 'RAPPORT_EMIS')?.n || 0,
    demandesEnregistrees: data?.demandes_par_statut?.find(d => d.statut === 'ENREGISTREE')?.n || 0,
  };

  // Cartes de statistiques principales
  const cartesPrincipales = [
    { 
      label: 'Clients', 
      value: stats.totalClients, 
      icon: FaUsers, 
      color: '#1d4ed8', 
      bg: '#e8edfd' 
    },
    { 
      label: 'Demandes en cours', 
      value: stats.demandesEnCours, 
      icon: FaClipboardList, 
      color: '#f59e0b', 
      bg: '#fef3c7' 
    },
    { 
      label: 'Demandes totales', 
      value: stats.demandesTotal, 
      icon: FaFileAlt, 
      color: '#7c3aed', 
      bg: '#ede9fe' 
    },
    { 
      label: 'Échantillons actifs', 
      value: stats.echantillonsActifs, 
      icon: FaFlask, 
      color: '#16a34a', 
      bg: '#dcfce7' 
    },
    { 
      label: 'Analyses en attente', 
      value: stats.analysesEnAttente, 
      icon: FaClock, 
      color: '#b4552d', 
      bg: '#fdf0ea' 
    },
    { 
      label: 'Alertes stock', 
      value: stats.alertesStock, 
      icon: FaBox, 
      color: '#dc2626', 
      bg: '#fee2e2' 
    },
    { 
      label: 'Factures totales', 
      value: stats.totalFactures, 
      icon: FaCreditCard, 
      color: '#0891b2', 
      bg: '#cffafe' 
    },
    { 
      label: 'Créances clients', 
      value: fcfa(stats.creances), 
      icon: FaChartLine,  // ✅ Remplacé FaTrendUp par FaChartLine
      color: '#dc2626', 
      bg: '#fee2e2' 
    },
  ];

  // Couleurs pour les statuts
  const couleursStatuts = {
    BROUILLON: '#94a3b8',
    ENREGISTREE: '#3b82f6',
    EN_COURS: '#f59e0b',
    VALIDEE: '#16a34a',
    RAPPORT_EMIS: '#8b5cf6',
    FACTUREE: '#06b6d4',
    CLOTUREE: '#64748b',
    ANNULEE: '#dc2626'
  };

  const labelsStatuts = {
    BROUILLON: '📝 Brouillon',
    ENREGISTREE: '📥 Enregistrée',
    EN_COURS: '🔄 En cours',
    VALIDEE: '✅ Validée',
    RAPPORT_EMIS: '📄 Rapport émis',
    FACTUREE: '💰 Facturée',
    CLOTUREE: '🔒 Clôturée',
    ANNULEE: '❌ Annulée'
  };

  return (
    <div>
      {/* EN-TÊTE */}
      <div style={{ marginBottom: '28px' }}>
        <h2 style={{ fontSize: '22px', fontWeight: 800, color: '#0f2d80', marginBottom: '2px' }}>
          👋 Bonjour, {utilisateur.prenom || 'Admin'} {utilisateur.nom}
        </h2>
        <p style={{ color: '#64748b', fontSize: '14px' }}>
          <FaCalendarAlt style={{ display: 'inline', marginRight: '6px' }} />
          {today.toLocaleDateString('fr-FR', options)}
        </p>
      </div>

      {/* STATISTIQUES PRINCIPALES */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
        gap: '16px',
        marginBottom: '24px'
      }}>
        {cartesPrincipales.map((carte, i) => {
          const Icon = carte.icon;
          return (
            <div
              key={i}
              style={{
                background: 'white',
                borderRadius: '12px',
                padding: '18px 20px',
                border: '1px solid #e2e8f0',
                boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
                transition: 'all 0.2s ease',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = carte.color;
                e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.08)';
                e.currentTarget.style.transform = 'translateY(-2px)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = '#e2e8f0';
                e.currentTarget.style.boxShadow = '0 1px 3px rgba(0,0,0,0.04)';
                e.currentTarget.style.transform = 'translateY(0)';
              }}
            >
              <div>
                <div style={{
                  fontSize: '24px',
                  fontWeight: 800,
                  color: carte.color
                }}>
                  {carte.value}
                </div>
                <div style={{
                  fontSize: '12px',
                  color: '#64748b',
                  fontWeight: 500
                }}>
                  {carte.label}
                </div>
              </div>
              <div style={{
                width: '44px',
                height: '44px',
                borderRadius: '10px',
                background: carte.bg,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: carte.color,
                fontSize: '20px'
              }}>
                <Icon size={20} />
              </div>
            </div>
          );
        })}
      </div>

      {/* DEUXIÈME LIGNE : GRAPHIQUES ET STATUTS */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: '2fr 1fr',
        gap: '20px',
        marginBottom: '24px'
      }}>
        {/* Répartition des statuts */}
        <div style={{
          background: 'white',
          border: '1px solid #e2e8f0',
          borderRadius: '12px',
          padding: '20px 24px',
          boxShadow: '0 1px 3px rgba(0,0,0,0.04)'
        }}>
          <h3 style={{
            fontSize: '15px',
            fontWeight: 700,
            color: '#0f2d80',
            marginBottom: '16px',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}>
            <FaChartPie size={18} />
            Répartition des demandes
            <span style={{
              fontSize: '12px',
              fontWeight: 400,
              color: '#94a3b8',
              marginLeft: 'auto'
            }}>
              Total: {stats.demandesTotal}
            </span>
          </h3>
          <div style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '8px'
          }}>
            {data?.demandes_par_statut?.length > 0 ? (
              data.demandes_par_statut.map((d, i) => {
                const total = stats.demandesTotal || 1;
                const pourcentage = Math.round((d.n / total) * 100);
                
                return (
                  <div key={d.statut} style={{
                    padding: '8px 12px',
                    background: '#f8fafc',
                    borderRadius: '8px',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    borderLeft: `3px solid ${couleursStatuts[d.statut] || '#94a3b8'}`
                  }}>
                    <span style={{ fontSize: '12px', color: '#334155' }}>
                      {labelsStatuts[d.statut] || d.statut}
                    </span>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <div style={{
                        width: '50px',
                        height: '6px',
                        background: '#e2e8f0',
                        borderRadius: '3px',
                        overflow: 'hidden'
                      }}>
                        <div style={{
                          width: `${pourcentage}%`,
                          height: '100%',
                          background: couleursStatuts[d.statut] || '#94a3b8',
                          borderRadius: '3px',
                          transition: 'width 0.5s ease'
                        }} />
                      </div>
                      <span style={{
                        fontSize: '13px',
                        fontWeight: 600,
                        color: couleursStatuts[d.statut] || '#334155',
                        minWidth: '24px',
                        textAlign: 'right'
                      }}>
                        {d.n}
                      </span>
                    </div>
                  </div>
                );
              })
            ) : (
              <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '20px', color: '#94a3b8' }}>
                Aucune demande enregistrée
              </div>
            )}
          </div>
        </div>

        {/* Activité récente */}
        <div style={{
          background: 'white',
          border: '1px solid #e2e8f0',
          borderRadius: '12px',
          padding: '20px 24px',
          boxShadow: '0 1px 3px rgba(0,0,0,0.04)'
        }}>
          <h3 style={{
            fontSize: '15px',
            fontWeight: 700,
            color: '#0f2d80',
            marginBottom: '16px',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}>
            <FaChartBar size={18} />
            Activité récente
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              padding: '10px 12px',
              background: '#f8fafc',
              borderRadius: '8px',
              borderLeft: '3px solid #16a34a'
            }}>
              <FaCheckCircle style={{ color: '#16a34a', fontSize: '16px' }} />
              <div>
                <div style={{ fontSize: '14px', fontWeight: 600, color: '#0f2d80' }}>
                  {stats.demandesValidees} demandes validées
                </div>
                <div style={{ fontSize: '11px', color: '#64748b' }}>
                  Résultats validés par le laboratoire
                </div>
              </div>
            </div>

            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              padding: '10px 12px',
              background: '#f8fafc',
              borderRadius: '8px',
              borderLeft: '3px solid #8b5cf6'
            }}>
              <FaFileAlt style={{ color: '#8b5cf6', fontSize: '16px' }} />
              <div>
                <div style={{ fontSize: '14px', fontWeight: 600, color: '#0f2d80' }}>
                  {stats.rapportsEmis} rapports émis
                </div>
                <div style={{ fontSize: '11px', color: '#64748b' }}>
                  Rapports d'essai disponibles
                </div>
              </div>
            </div>

            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              padding: '10px 12px',
              background: '#f8fafc',
              borderRadius: '8px',
              borderLeft: '3px solid #3b82f6'
            }}>
              <FaClock style={{ color: '#3b82f6', fontSize: '16px' }} />
              <div>
                <div style={{ fontSize: '14px', fontWeight: 600, color: '#0f2d80' }}>
                  {stats.demandesEnregistrees} demandes enregistrées
                </div>
                <div style={{ fontSize: '11px', color: '#64748b' }}>
                  En attente de traitement
                </div>
              </div>
            </div>

            {stats.alertesStock > 0 && (
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                padding: '10px 12px',
                background: '#fee2e2',
                borderRadius: '8px',
                border: '1px solid #fecaca'
              }}>
                <FaExclamationTriangle style={{ color: '#dc2626' }} />
                <div>
                  <div style={{ fontSize: '14px', fontWeight: 600, color: '#dc2626' }}>
                    {stats.alertesStock} alertes de stock
                  </div>
                  <div style={{ fontSize: '11px', color: '#64748b' }}>
                    Articles en stock bas
                  </div>
                </div>
              </div>
            )}

            {stats.etalonnages > 0 && (
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                padding: '10px 12px',
                background: '#fef3c7',
                borderRadius: '8px',
                border: '1px solid #fde68a'
              }}>
                <FaMicroscope style={{ color: '#f59e0b' }} />
                <div>
                  <div style={{ fontSize: '14px', fontWeight: 600, color: '#f59e0b' }}>
                    {stats.etalonnages} étalonnages à prévoir
                  </div>
                  <div style={{ fontSize: '11px', color: '#64748b' }}>
                    Équipements à étalonner
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* VUE D'ENSEMBLE */}
      <div style={{
        background: 'white',
        border: '1px solid #e2e8f0',
        borderRadius: '12px',
        padding: '20px 24px',
        boxShadow: '0 1px 3px rgba(0,0,0,0.04)'
      }}>
        <h3 style={{
          fontSize: '15px',
          fontWeight: 700,
          color: '#0f2d80',
          marginBottom: '16px',
          display: 'flex',
          alignItems: 'center',
          gap: '8px'
        }}>
          <FaChartBar size={18} />
          Vue d'ensemble du laboratoire
        </h3>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '16px'
        }}>
          <div style={{
            padding: '16px 20px',
            background: '#f8fafc',
            borderRadius: '10px',
            textAlign: 'center',
            border: '1px solid #e2e8f0'
          }}>
            <div style={{ fontSize: '28px', fontWeight: 800, color: '#1d4ed8' }}>
              {stats.totalClients}
            </div>
            <div style={{ fontSize: '13px', color: '#64748b', fontWeight: 500 }}>
              <FaUsers style={{ display: 'inline', marginRight: '6px' }} />
              Clients enregistrés
            </div>
          </div>
          <div style={{
            padding: '16px 20px',
            background: '#f8fafc',
            borderRadius: '10px',
            textAlign: 'center',
            border: '1px solid #e2e8f0'
          }}>
            <div style={{ fontSize: '28px', fontWeight: 800, color: '#7c3aed' }}>
              {stats.demandesTotal}
            </div>
            <div style={{ fontSize: '13px', color: '#64748b', fontWeight: 500 }}>
              <FaClipboardList style={{ display: 'inline', marginRight: '6px' }} />
              Demandes totales
            </div>
          </div>
          <div style={{
            padding: '16px 20px',
            background: '#f8fafc',
            borderRadius: '10px',
            textAlign: 'center',
            border: '1px solid #e2e8f0'
          }}>
            <div style={{ fontSize: '28px', fontWeight: 800, color: '#0891b2' }}>
              {stats.totalFactures}
            </div>
            <div style={{ fontSize: '13px', color: '#64748b', fontWeight: 500 }}>
              <FaCreditCard style={{ display: 'inline', marginRight: '6px' }} />
              Factures émises
            </div>
          </div>
          <div style={{
            padding: '16px 20px',
            background: '#f8fafc',
            borderRadius: '10px',
            textAlign: 'center',
            border: '1px solid #e2e8f0'
          }}>
            <div style={{ fontSize: '28px', fontWeight: 800, color: '#16a34a' }}>
              {stats.echantillonsActifs}
            </div>
            <div style={{ fontSize: '13px', color: '#64748b', fontWeight: 500 }}>
              <FaFlask style={{ display: 'inline', marginRight: '6px' }} />
              Échantillons en analyse
            </div>
          </div>
        </div>

        {/* Message d'information */}
        <div style={{
          marginTop: '16px',
          padding: '12px 16px',
          background: '#f1f5f9',
          borderRadius: '8px',
          fontSize: '13px',
          color: '#64748b',
          display: 'flex',
          alignItems: 'center',
          gap: '8px'
        }}>
          <span style={{ fontSize: '18px' }}>💡</span>
          Les données sont calculées en temps réel depuis la base PostgreSQL.
          Utilisez le menu de gauche pour gérer toutes les fonctionnalités du LIMS.
        </div>
      </div>

      <style>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}