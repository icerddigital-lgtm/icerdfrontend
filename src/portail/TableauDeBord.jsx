import { useEffect, useState } from 'react';
import { api, fcfa } from '../api.js';

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

  const stats = [
    { label: 'Demandes en cours', value: data?.demandes_par_statut?.find(d => d.statut === 'EN_COURS')?.n || 0, type: 'primary' },
    { label: 'Échantillons actifs', value: data?.echantillons_actifs || 0, type: 'success' },
    { label: 'Analyses en attente', value: data?.analyses_en_attente || 0, type: 'accent' },
    { label: 'Alertes de stock', value: data?.alertes_stock || 0, type: 'danger' },
    { label: 'Étalonnages à prévoir', value: data?.etalonnages_a_prevoir || 0, type: 'danger' },
    { label: 'Créances clients', value: fcfa(data?.montant_impaye_fcfa || 0), type: 'accent' },
  ];

  const today = new Date();
  const options = { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' };

  return (
    <>
      <div style={{ marginBottom: '28px' }}>
        <h2 style={{ fontSize: '22px', fontWeight: 800, color: '#0f2d80', marginBottom: '2px' }}>
          👋 Bonjour, {utilisateur.prenom} {utilisateur.nom}
        </h2>
        <p style={{ color: '#64748b' }}>{today.toLocaleDateString('fr-FR', options)}</p>
      </div>

      <div className="stats-grid">
        {stats.map((stat, i) => (
          <div key={i} className={`stat-card ${stat.type === 'accent' ? 'stat-card--accent' : ''} ${stat.type === 'danger' ? 'stat-card--danger' : ''} ${stat.type === 'success' ? 'stat-card--success' : ''}`}>
            <div className="stat-card__value">{stat.value}</div>
            <div className="stat-card__label">{stat.label}</div>
          </div>
        ))}
      </div>

      <div style={{
        background: 'white',
        border: '1px solid var(--border-color)',
        borderRadius: '12px',
        padding: '24px',
        boxShadow: 'var(--shadow-sm)'
      }}>
        <h3 style={{ marginBottom: '12px', fontSize: '16px', fontWeight: 700, color: '#0f2d80' }}>
          📊 Activité en temps réel
        </h3>
        <p style={{ color: '#64748b', fontSize: '14px' }}>
          Les données sont calculées en temps réel depuis la base PostgreSQL.
          Utilisez le menu de gauche pour gérer toutes les fonctionnalités du LIMS.
        </p>
        <div style={{
          marginTop: '16px',
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))',
          gap: '12px'
        }}>
          {[
            { label: 'Clients', value: data?.total_clients || '—' },
            { label: 'Demandes totales', value: data?.total_demandes || '—' },
            { label: 'Factures émises', value: data?.total_factures || '—' },
          ].map((item, i) => (
            <div key={i} style={{
              background: 'var(--bg-light)',
              borderRadius: '8px',
              padding: '12px 16px',
              textAlign: 'center'
            }}>
              <div style={{ fontSize: '20px', fontWeight: 700, color: '#0f2d80' }}>{item.value}</div>
              <div style={{ fontSize: '12px', color: '#64748b' }}>{item.label}</div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}