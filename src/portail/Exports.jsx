// frontend/src/portail/Exports.jsx
// Page EXPORTS — téléchargement des données en CSV, Excel ou JSON
import { useState } from 'react';
import { telechargerFichier } from '../api.js';

const RESSOURCES = [
  { id: 'clients',      icone: '👥', titre: 'Clients',               desc: 'Répertoire complet des clients' },
  { id: 'demandes',     icone: '📋', titre: "Demandes d'analyses",  desc: 'Toutes les demandes avec statut et échéances' },
  { id: 'echantillons', icone: '🧪', titre: 'Échantillons',          desc: 'Registre des échantillons avec traçabilité' },
  { id: 'resultats',    icone: '📈', titre: 'Résultats',             desc: 'Résultats détaillés : valeurs, méthodes, validations' },
  { id: 'stocks',       icone: '📦', titre: 'Stocks & réactifs',     desc: 'État des stocks avec seuils et emplacements' },
  { id: 'mouvements',   icone: '🔄', titre: 'Mouvements de stock',   desc: 'Historique des entrées et sorties' },
  { id: 'factures',     icone: '💰', titre: 'Factures',              desc: 'Factures avec montants, TVA et paiements reçus' },
  { id: 'paiements',    icone: '🧾', titre: 'Paiements',             desc: 'Encaissements par mode et référence' },
  { id: 'catalogue',    icone: '🔬', titre: "Catalogue d'analyses", desc: 'Tarifaire officiel complet' },
  { id: 'equipements',  icone: '⚙️', titre: 'Équipements',           desc: "Parc d'équipements et étalonnages" },
];

const FORMATS = [
  { ext: 'xlsx', label: 'Excel', color: '#1d6f42', bg: '#e8f5ee', icon: '📊' },
  { ext: 'csv',  label: 'CSV',   color: '#b4552d', bg: '#fdf0ea', icon: '📄' },
  { ext: 'json', label: 'JSON',  color: '#1d4ed8', bg: '#e8edfd', icon: '📋' },
];

export default function Exports({ showToast }) {
  const [enCours, setEnCours] = useState('');
  const [exportLog, setExportLog] = useState([]);

  const exporter = async (id, ext) => {
    const cle = `${id}.${ext}`;
    setEnCours(cle);
    try {
      // Utiliser la fonction telechargerFichier de api.js
      const nomFichier = await telechargerFichier(`/exports/${cle}`, `${cle}`);
      
      // Ajouter au log
      setExportLog(prev => [{
        id: id,
        format: ext,
        date: new Date().toISOString(),
        status: 'success',
        nom: nomFichier
      }, ...prev].slice(0, 10));
      
      showToast?.(`✅ Fichier ${nomFichier} téléchargé avec succès`, 'success');
    } catch (e) {
      showToast?.(`❌ Erreur: ${e.message}`, 'error');
    } finally { 
      setEnCours(''); 
    }
  };

  const totalExports = exportLog.length;

  return (
    <div>
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
          <h2 style={{ fontSize: '20px', fontWeight: 700, color: '#0f2d80' }}>📊 Exports de données</h2>
          <p style={{ color: '#64748b', fontSize: '14px', marginTop: '4px' }}>
            {totalExports > 0 ? `${totalExports} export${totalExports > 1 ? 's' : ''} effectué${totalExports > 1 ? 's' : ''}` : 'Aucun export effectué'}
          </p>
        </div>
      </div>

      {/* DESCRIPTION */}
      <div style={{
        background: 'var(--bg-light)',
        borderRadius: '12px',
        padding: '16px 20px',
        marginBottom: '24px',
        border: '1px solid var(--border-color)'
      }}>
        <p style={{ color: '#64748b', fontSize: '14px', margin: 0, lineHeight: 1.6 }}>
          💡 Téléchargez vos données en <strong style={{ color: '#1d6f42' }}>Excel</strong> (mise en forme, filtres), 
          <strong style={{ color: '#b4552d' }}> CSV</strong> (compatible tout tableur) ou 
          <strong style={{ color: '#1d4ed8' }}> JSON</strong> (intégrations et sauvegardes). 
          Chaque export est journalisé dans le registre d'audit.
        </p>
      </div>

      {/* GRILLE DES RESSOURCES */}
      <div style={{
        display: 'grid',
        gap: '16px',
        gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))'
      }}>
        {RESSOURCES.map(r => (
          <div key={r.id} style={{
            background: 'white',
            borderRadius: '12px',
            padding: '20px',
            border: '1px solid var(--border-color)',
            boxShadow: 'var(--shadow-sm)',
            transition: 'all 0.2s ease'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.borderColor = '#1d4ed8';
            e.currentTarget.style.boxShadow = '0 4px 16px rgba(29, 78, 216, 0.08)';
            e.currentTarget.style.transform = 'translateY(-2px)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.borderColor = 'var(--border-color)';
            e.currentTarget.style.boxShadow = 'var(--shadow-sm)';
            e.currentTarget.style.transform = 'translateY(0)';
          }}
          >
            <div style={{ display: 'flex', gap: '12px', alignItems: 'center', marginBottom: '6px' }}>
              <span style={{ fontSize: '24px' }}>{r.icone}</span>
              <strong style={{ fontSize: '15px', color: '#0f2d80' }}>{r.titre}</strong>
            </div>
            <p style={{ fontSize: '13px', color: '#64748b', margin: '0 0 14px', lineHeight: 1.5 }}>
              {r.desc}
            </p>
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
              {FORMATS.map(f => {
                const isActive = enCours === `${r.id}.${f.ext}`;
                return (
                  <button
                    key={f.ext}
                    onClick={() => exporter(r.id, f.ext)}
                    disabled={!!isActive}
                    style={{
                      background: f.bg,
                      color: f.color,
                      border: `1.5px solid ${f.color}30`,
                      borderRadius: '8px',
                      padding: '6px 16px',
                      fontSize: '12.5px',
                      fontWeight: 600,
                      cursor: isActive ? 'wait' : 'pointer',
                      opacity: isActive ? 0.6 : 1,
                      transition: 'all 0.2s ease',
                      fontFamily: 'var(--texte)',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '6px'
                    }}
                    onMouseEnter={(e) => {
                      if (!isActive) {
                        e.currentTarget.style.transform = 'translateY(-1px)';
                        e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.1)';
                      }
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = 'translateY(0)';
                      e.currentTarget.style.boxShadow = 'none';
                    }}
                  >
                    {isActive ? (
                      <>
                        <span style={{
                          display: 'inline-block',
                          width: '12px',
                          height: '12px',
                          border: `2px solid ${f.color}`,
                          borderTopColor: 'transparent',
                          borderRadius: '50%',
                          animation: 'spin 0.8s linear infinite'
                        }}></span>
                        Chargement...
                      </>
                    ) : (
                      <>
                        {f.icon}
                        {f.label}
                      </>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {/* HISTORIQUE DES EXPORTS */}
      {exportLog.length > 0 && (
        <div style={{ marginTop: '32px' }}>
          <h3 style={{
            fontSize: '16px',
            fontWeight: 700,
            color: '#0f2d80',
            marginBottom: '12px',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}>
            📋 Historique des exports
            <span style={{
              fontSize: '12px',
              fontWeight: 400,
              color: '#94a3b8',
              background: 'var(--bg-light)',
              padding: '2px 10px',
              borderRadius: '999px'
            }}>
              {exportLog.length} export{exportLog.length > 1 ? 's' : ''}
            </span>
          </h3>
          <div className="tableau-lab">
            <table>
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Ressource</th>
                  <th>Format</th>
                  <th>Fichier</th>
                  <th>Statut</th>
                </tr>
              </thead>
              <tbody>
                {exportLog.map((item, index) => (
                  <tr key={index}>
                    <td style={{ fontSize: '13px', fontFamily: 'var(--mono)', color: 'var(--text-muted)' }}>
                      {new Date(item.date).toLocaleString('fr-FR')}
                    </td>
                    <td>
                      {RESSOURCES.find(r => r.id === item.id)?.titre || item.id}
                    </td>
                    <td>
                      <span className="badge-lab" style={{
                        background: FORMATS.find(f => f.ext === item.format)?.bg || 'var(--bg-light)',
                        color: FORMATS.find(f => f.ext === item.format)?.color || 'var(--text-muted)'
                      }}>
                        {item.format.toUpperCase()}
                      </span>
                    </td>
                    <td style={{ fontSize: '12px', fontFamily: 'var(--mono)', color: 'var(--text-muted)' }}>
                      {item.nom || `${item.id}.${item.format}`}
                    </td>
                    <td>
                      <span className="badge-lab badge-lab--success">✅ Téléchargé</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* STYLE POUR L'ANIMATION DE CHARGEMENT */}
      <style>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}