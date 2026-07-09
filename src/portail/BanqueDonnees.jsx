// frontend/src/portail/BanqueDonnees.jsx
import { useEffect, useMemo, useState } from 'react';
import { api, telechargerFichier, formatDate } from '../api.js';

const MATRICES = ['SOL', 'EAU', 'PLANTE', 'ENGRAIS', 'MINERAI'];

export default function BanqueDonnees({ showToast }) {
  const [onglet, setOnglet] = useState('recherche');

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
          <h2 style={{ fontSize: '20px', fontWeight: 700, color: '#0f2d80' }}>📊 Banque de données des analyses</h2>
          <p style={{ color: '#64748b', fontSize: '14px', marginTop: '4px' }}>
            Le patrimoine scientifique du Centre : toutes les analyses capitalisées, recherchables et exploitables.
          </p>
        </div>
        <button
          className="btn-lab btn-lab--success"
          onClick={async () => {
            try {
              await telechargerFichier('/exports/banque.xlsx');
              showToast?.('✅ Export Excel téléchargé', 'success');
            } catch (e) {
              showToast?.(e.message, 'error');
            }
          }}
        >
          ⬇️ Exporter tout (Excel)
        </button>
      </div>

      {/* TABS */}
      <div style={{
        display: 'flex',
        gap: '8px',
        marginBottom: '24px',
        padding: '6px',
        background: 'var(--bg-light)',
        borderRadius: '12px',
        border: '1px solid var(--border-color)'
      }}>
        {[
          ['recherche', '🔎 Rechercher'],
          ['saisie', '➕ Nouvelle fiche'],
          ['stats', '📊 Statistiques']
        ].map(([k, t]) => (
          <button
            key={k}
            onClick={() => setOnglet(k)}
            style={{
              padding: '8px 20px',
              borderRadius: '8px',
              border: 'none',
              background: onglet === k ? 'white' : 'transparent',
              color: onglet === k ? '#0f2d80' : '#64748b',
              fontWeight: onglet === k ? 600 : 500,
              fontSize: '14px',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
              boxShadow: onglet === k ? '0 2px 8px rgba(0,0,0,0.06)' : 'none',
              fontFamily: 'var(--texte)',
              flex: 1,
              textAlign: 'center'
            }}
          >
            {t}
          </button>
        ))}
      </div>

      {onglet === 'recherche' && <Recherche showToast={showToast} />}
      {onglet === 'saisie' && <Saisie showToast={showToast} onCree={() => setOnglet('recherche')} />}
      {onglet === 'stats' && <Stats showToast={showToast} />}
    </div>
  );
}

/* ------------------------------- RECHERCHE ------------------------------- */
function Recherche({ showToast }) {
  const [filtres, setFiltres] = useState({
    matrice: '',
    recherche: '',
    region: '',
    projet: '',
    parametre: '',
    val_min: '',
    val_max: ''
  });
  const [parametres, setParametres] = useState([]);
  const [fiches, setFiches] = useState([]);
  const [loading, setLoading] = useState(false);
  const [detail, setDetail] = useState(null);

  useEffect(() => {
    api('/banque/parametres')
      .then(setParametres)
      .catch(() => {});
  }, []);

  const chercher = async () => {
    setLoading(true);
    const qs = Object.entries(filtres)
      .filter(([, v]) => v !== '')
      .map(([k, v]) => `${k}=${encodeURIComponent(v)}`)
      .join('&');
    try {
      const data = await api(`/banque/fiches${qs ? '?' + qs : ''}`);
      setFiches(data || []);
      setDetail(null);
    } catch (e) {
      showToast?.(e.message, 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { chercher(); }, []);

  const maj = (k) => (e) => setFiltres({ ...filtres, [k]: e.target.value });
  const paramsMatrice = parametres.filter(p => !filtres.matrice || p.matrice === filtres.matrice);

  return (
    <div>
      {/* FILTRES */}
      <div style={{
        background: 'white',
        borderRadius: '12px',
        padding: '20px',
        border: '1px solid var(--border-color)',
        marginBottom: '20px',
        boxShadow: 'var(--shadow-sm)'
      }}>
        <div style={{
          display: 'grid',
          gap: '12px',
          gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))'
        }}>
          <div className="champ-lab" style={{ marginBottom: 0 }}>
            <label>Matrice</label>
            <select style={{ width: '100%' }} value={filtres.matrice} onChange={maj('matrice')}>
              <option value="">Toutes</option>
              {MATRICES.map(m => <option key={m}>{m}</option>)}
            </select>
          </div>
          <div className="champ-lab" style={{ marginBottom: 0 }}>
            <label>Texte libre</label>
            <input placeholder="code, lieu, désignation…" value={filtres.recherche} onChange={maj('recherche')} />
          </div>
          <div className="champ-lab" style={{ marginBottom: 0 }}>
            <label>Région</label>
            <input placeholder="Centre, Sud…" value={filtres.region} onChange={maj('region')} />
          </div>
          <div className="champ-lab" style={{ marginBottom: 0 }}>
            <label>Projet</label>
            <input placeholder="MINADER…" value={filtres.projet} onChange={maj('projet')} />
          </div>
          <div className="champ-lab" style={{ marginBottom: 0 }}>
            <label>Paramètre</label>
            <select style={{ width: '100%' }} value={filtres.parametre} onChange={maj('parametre')}>
              <option value="">—</option>
              {paramsMatrice.map(p => (
                <option key={p.code} value={p.code}>{p.libelle} ({p.matrice})</option>
              ))}
            </select>
          </div>
          <div className="champ-lab" style={{ marginBottom: 0 }}>
            <label>Valeur min</label>
            <input type="number" step="any" value={filtres.val_min} onChange={maj('val_min')} />
          </div>
          <div className="champ-lab" style={{ marginBottom: 0 }}>
            <label>Valeur max</label>
            <input type="number" step="any" value={filtres.val_max} onChange={maj('val_max')} />
          </div>
        </div>
        <div style={{ display: 'flex', gap: '12px', alignItems: 'center', marginTop: '16px' }}>
          <button className="btn-lab btn-lab--primary" onClick={chercher} disabled={loading}>
            {loading ? 'Recherche...' : '🔍 Rechercher'}
          </button>
          <span style={{ fontSize: '13px', color: '#64748b' }}>
            💡 Exemple : SOL + pH eau ≤ 5 → sols acides
          </span>
        </div>
      </div>

      {/* RÉSULTATS */}
      <div style={{
        background: 'white',
        borderRadius: '12px',
        padding: '20px',
        border: '1px solid var(--border-color)',
        boxShadow: 'var(--shadow-sm)'
      }}>
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '12px',
          flexWrap: 'wrap',
          gap: '8px'
        }}>
          <span style={{ fontSize: '14px', color: '#64748b' }}>
            {loading ? 'Chargement...' : `${fiches.length} fiche${fiches.length > 1 ? 's' : ''} trouvée${fiches.length > 1 ? 's' : ''}`}
          </span>
        </div>

        <div className="tableau-lab">
          <table>
            <thead>
              <tr>
                <th>Code</th>
                <th>Matrice</th>
                <th>Désignation</th>
                <th>Localisation</th>
                <th>Région</th>
                <th>Projet</th>
                <th style={{ textAlign: 'center' }}>Valeurs</th>
                <th style={{ textAlign: 'center' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {fiches.length > 0 ? (
                fiches.map(f => (
                  <tr key={f.id}>
                    <td style={{ fontFamily: 'var(--mono)', fontSize: '12px', color: 'var(--text-muted)' }}>
                      {f.code}
                    </td>
                    <td><span className="badge-lab badge-lab--primary">{f.matrice}</span></td>
                    <td>{f.designation || '—'}</td>
                    <td>{f.localisation || '—'}</td>
                    <td>{f.region || '—'}</td>
                    <td>{f.projet || '—'}</td>
                    <td style={{ textAlign: 'center' }}>
                      <span className="badge-lab badge-lab--info">{f.nb_valeurs || 0}</span>
                    </td>
                    <td style={{ textAlign: 'center' }}>
                      <button
                        className="btn-lab btn-lab--ghost btn-lab--sm"
                        onClick={async () => {
                          try {
                            setDetail(await api(`/banque/fiches/${f.id}`));
                          } catch (e) {
                            showToast?.(e.message, 'error');
                          }
                        }}
                      >
                        👁️
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="8" style={{ textAlign: 'center', padding: '40px', color: '#94a3b8' }}>
                    <div style={{ fontSize: '40px', marginBottom: '8px' }}>🔬</div>
                    <p>Aucune fiche trouvée</p>
                    <p style={{ fontSize: '13px' }}>Ajustez vos critères de recherche</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* DETAIL */}
      {detail && (
        <div style={{
          marginTop: '20px',
          background: 'white',
          borderRadius: '12px',
          padding: '24px',
          border: '1px solid var(--border-color)',
          boxShadow: 'var(--shadow-sm)',
          borderLeft: `4px solid var(--orange-brand)`
        }}>
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-start',
            flexWrap: 'wrap',
            gap: '12px',
            marginBottom: '12px'
          }}>
            <div>
              <h3 style={{ color: '#0f2d80', margin: 0 }}>
                {detail.code} — {detail.designation || detail.matrice}
              </h3>
              <p style={{ fontSize: '13px', color: '#64748b', marginTop: '4px' }}>
                {detail.localisation || ''}
                {detail.region && ` · ${detail.region}`}
                {detail.profondeur && ` · ${detail.profondeur}`}
                {detail.projet && ` · ${detail.projet}`}
                {detail.source && ` · source ${detail.source}`}
              </p>
            </div>
            <button className="btn-lab btn-lab--ghost" onClick={() => setDetail(null)}>
              ✕ Fermer
            </button>
          </div>

          {Object.entries(
            (detail.valeurs || []).reduce((g, v) => {
              const group = v.groupe || 'Autres';
              g[group] = g[group] || [];
              g[group].push(v);
              return g;
            }, {})
          ).map(([groupe, vals]) => (
            <div key={groupe} style={{ marginBottom: '12px' }}>
              <div style={{
                fontSize: '12px',
                fontWeight: 600,
                color: 'var(--orange-brand)',
                textTransform: 'uppercase',
                letterSpacing: '0.5px',
                marginBottom: '6px'
              }}>
                {groupe}
              </div>
              <div style={{
                display: 'grid',
                gap: '6px',
                gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))'
              }}>
                {vals.map(v => (
                  <div key={v.code} style={{
                    background: 'var(--bg-light)',
                    padding: '6px 12px',
                    borderRadius: '6px',
                    fontSize: '13px'
                  }}>
                    <span style={{ color: '#64748b' }}>{v.libelle} : </span>
                    <strong>{v.valeur_num ?? v.valeur_txt}</strong>
                    {v.unite && v.unite !== '—' && <span style={{ color: '#94a3b8' }}> {v.unite}</span>}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

/* -------------------------------- SAISIE --------------------------------- */
function Saisie({ showToast, onCree }) {
  const [matrice, setMatrice] = useState('SOL');
  const [parametres, setParametres] = useState([]);
  const [loading, setLoading] = useState(false);
  const [meta, setMeta] = useState({
    designation: '',
    localisation: '',
    region: '',
    departement: '',
    coordonnees_gps: '',
    profondeur: '',
    date_prelevement: '',
    date_analyse: '',
    projet: '',
    campagne: '',
    observations: ''
  });
  const [valeurs, setValeurs] = useState({});
  const [envoi, setEnvoi] = useState(false);

  useEffect(() => {
    setLoading(true);
    api(`/banque/parametres?matrice=${matrice}`)
      .then(p => {
        setParametres(p || []);
        setValeurs({});
        setLoading(false);
      })
      .catch(e => {
        showToast?.(e.message, 'error');
        setLoading(false);
      });
  }, [matrice]);

  const groupes = useMemo(() =>
    parametres.reduce((g, p) => {
      const group = p.groupe || 'Autres';
      g[group] = g[group] || [];
      g[group].push(p);
      return g;
    }, {}), [parametres]
  );

  const majMeta = (k) => (e) => setMeta({ ...meta, [k]: e.target.value });

  const enregistrer = async () => {
    if (!meta.designation && !meta.localisation) {
      return showToast?.('Indiquez au moins une désignation ou une localisation', 'error');
    }
    const liste = Object.entries(valeurs)
      .filter(([, v]) => v !== '' && v !== null && v !== undefined)
      .map(([pid, v]) => {
        const n = Number(String(v).replace(',', '.'));
        return {
          parametre_id: Number(pid),
          valeur_num: isNaN(n) ? null : n,
          valeur_txt: isNaN(n) ? String(v) : null
        };
      });
    if (liste.length === 0) {
      return showToast?.('Saisissez au moins une valeur', 'error');
    }
    setEnvoi(true);
    try {
      const f = await api('/banque/fiches', {
        method: 'POST',
        body: JSON.stringify({
          matrice,
          ...meta,
          date_prelevement: meta.date_prelevement || null,
          date_analyse: meta.date_analyse || null,
          valeurs: liste
        })
      });
      (f.alertes || []).forEach(a => showToast?.(a, 'warning'));
      showToast?.(`✅ Fiche ${f.code} enregistrée (${liste.length} valeurs)`, 'success');
      onCree?.();
    } catch (e) {
      showToast?.(e.message, 'error');
    } finally {
      setEnvoi(false);
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
        <p style={{ color: '#64748b' }}>Chargement des paramètres...</p>
      </div>
    );
  }

  return (
    <div style={{ display: 'grid', gap: '20px' }}>
      {/* SELECTEUR MATRICE */}
      <div style={{
        background: 'white',
        borderRadius: '12px',
        padding: '20px',
        border: '1px solid var(--border-color)',
        boxShadow: 'var(--shadow-sm)'
      }}>
        <label className="champ-lab" style={{ marginBottom: '8px' }}>
          Type d'analyse (matrice) — le formulaire s'adapte automatiquement
        </label>
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
          {MATRICES.map(m => (
            <button
              key={m}
              onClick={() => setMatrice(m)}
              className={`btn-lab ${matrice === m ? 'btn-lab--primary' : 'btn-lab--ghost'}`}
              style={{ fontSize: '13px', padding: '6px 16px' }}
            >
              {m} {m === 'SOL' && '(+ géotech)'}
            </button>
          ))}
        </div>
      </div>

      {/* MÉTADONNÉES */}
      <div style={{
        background: 'white',
        borderRadius: '12px',
        padding: '20px',
        border: '1px solid var(--border-color)',
        boxShadow: 'var(--shadow-sm)'
      }}>
        <h3 style={{ color: '#0f2d80', fontSize: '16px', marginTop: 0, marginBottom: '12px' }}>
          🏷️ Identification de l'échantillon
        </h3>
        <div style={{
          display: 'grid',
          gap: '12px',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))'
        }}>
          {[
            ['designation', 'Désignation', 'Sol parcelle A, 0-20 cm'],
            ['localisation', 'Localisation', 'Bafia, bloc Nord'],
            ['region', 'Région', 'Centre'],
            ['departement', 'Département', 'Mbam-et-Inoubou'],
            ['coordonnees_gps', 'GPS', '4.7500N, 11.2333E'],
            ['profondeur', 'Profondeur', '0-20 cm'],
            ['projet', 'Projet / étude', 'MINADER 2026'],
            ['campagne', 'Campagne', '2026-A']
          ].map(([k, label, placeholder]) => (
            <div key={k} className="champ-lab" style={{ marginBottom: 0 }}>
              <label>{label}</label>
              <input
                placeholder={placeholder}
                value={meta[k] || ''}
                onChange={majMeta(k)}
              />
            </div>
          ))}
          <div className="champ-lab" style={{ marginBottom: 0 }}>
            <label>Date de prélèvement</label>
            <input type="date" value={meta.date_prelevement} onChange={majMeta('date_prelevement')} />
          </div>
          <div className="champ-lab" style={{ marginBottom: 0 }}>
            <label>Date d'analyse</label>
            <input type="date" value={meta.date_analyse} onChange={majMeta('date_analyse')} />
          </div>
        </div>
        <div className="champ-lab" style={{ marginTop: '12px' }}>
          <label>Observations</label>
          <textarea
            rows="2"
            value={meta.observations || ''}
            onChange={majMeta('observations')}
            placeholder="Informations complémentaires..."
          />
        </div>
      </div>

      {/* PARAMÈTRES */}
      {Object.entries(groupes).map(([groupe, params]) => (
        <div key={groupe} style={{
          background: 'white',
          borderRadius: '12px',
          padding: '20px',
          border: '1px solid var(--border-color)',
          boxShadow: 'var(--shadow-sm)'
        }}>
          <h3 style={{
            color: 'var(--orange-brand)',
            fontSize: '15px',
            marginTop: 0,
            marginBottom: '12px'
          }}>
            {groupe}
            <span style={{ fontSize: '12px', color: '#94a3b8', fontWeight: 400, marginLeft: '8px' }}>
              ({params.length} paramètre{params.length > 1 ? 's' : ''})
            </span>
          </h3>
          <div style={{
            display: 'grid',
            gap: '12px',
            gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))'
          }}>
            {params.map(p => (
              <div key={p.id} className="champ-lab" style={{ marginBottom: 0 }}>
                <label title={p.methode || ''}>
                  {p.libelle}
                  {p.unite && p.unite !== '—' && <span style={{ fontWeight: 400, color: '#94a3b8' }}> ({p.unite})</span>}
                </label>
                <input
                  type="text"
                  inputMode="decimal"
                  placeholder={p.seuil_norme || p.methode || ''}
                  value={valeurs[p.id] ?? ''}
                  onChange={e => setValeurs({ ...valeurs, [p.id]: e.target.value })}
                />
              </div>
            ))}
          </div>
        </div>
      ))}

      {/* BOUTON ENREGISTRER */}
      <div style={{
        display: 'flex',
        gap: '12px',
        alignItems: 'center',
        flexWrap: 'wrap'
      }}>
        <button
          className="btn-lab btn-lab--primary"
          disabled={envoi}
          onClick={enregistrer}
          style={{ padding: '12px 32px', fontSize: '16px' }}
        >
          {envoi ? '⏳ Enregistrement...' : '💾 Enregistrer la fiche'}
        </button>
        <span style={{ fontSize: '13px', color: '#64748b' }}>
          Seuls les champs remplis sont enregistrés. Textes acceptés (« &lt; LQ », « traces »).
        </span>
      </div>
    </div>
  );
}

/* -------------------------------- STATS ---------------------------------- */
function Stats({ showToast }) {
  const [parametres, setParametres] = useState([]);
  const [choix, setChoix] = useState({ parametre: 'SOL_PH_EAU', region: '', projet: '' });
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    api('/banque/parametres')
      .then(setParametres)
      .catch(() => {});
  }, []);

  const calculer = async () => {
    setLoading(true);
    const qs = Object.entries(choix)
      .filter(([, v]) => v)
      .map(([k, v]) => `${k}=${encodeURIComponent(v)}`)
      .join('&');
    try {
      const data = await api(`/banque/stats?${qs}`);
      setStats(data || null);
    } catch (e) {
      showToast?.(e.message, 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      background: 'white',
      borderRadius: '12px',
      padding: '24px',
      border: '1px solid var(--border-color)',
      boxShadow: 'var(--shadow-sm)'
    }}>
      <div style={{
        display: 'grid',
        gap: '12px',
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        marginBottom: '16px'
      }}>
        <div className="champ-lab" style={{ marginBottom: 0 }}>
          <label>Paramètre *</label>
          <select
            value={choix.parametre}
            onChange={e => setChoix({ ...choix, parametre: e.target.value })}
          >
            {parametres.map(p => (
              <option key={p.code} value={p.code}>
                {p.libelle} ({p.matrice})
              </option>
            ))}
          </select>
        </div>
        <div className="champ-lab" style={{ marginBottom: 0 }}>
          <label>Région (optionnel)</label>
          <input value={choix.region} onChange={e => setChoix({ ...choix, region: e.target.value })} />
        </div>
        <div className="champ-lab" style={{ marginBottom: 0 }}>
          <label>Projet (optionnel)</label>
          <input value={choix.projet} onChange={e => setChoix({ ...choix, projet: e.target.value })} />
        </div>
      </div>

      <button className="btn-lab btn-lab--primary" onClick={calculer} disabled={loading}>
        {loading ? 'Calcul...' : '📊 Calculer les statistiques'}
      </button>

      {stats && stats.n > 0 && (
        <div style={{
          display: 'grid',
          gap: '16px',
          gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
          marginTop: '20px',
          paddingTop: '20px',
          borderTop: '1px solid var(--border-color)'
        }}>
          {[
            ['n', 'Nombre de mesures'],
            ['moyenne', 'Moyenne'],
            ['mediane', 'Médiane'],
            ['minimum', 'Minimum'],
            ['maximum', 'Maximum'],
            ['ecart_type', 'Écart-type']
          ].map(([k, label]) => (
            <div key={k} style={{
              background: 'var(--bg-light)',
              borderRadius: '10px',
              padding: '14px 16px',
              borderTop: `3px solid var(--blue-brand)`
            }}>
              <div style={{
                fontSize: '22px',
                fontWeight: 800,
                color: '#0f2d80'
              }}>
                {stats[k] !== null && stats[k] !== undefined ? stats[k] : '—'}
                {k !== 'n' && stats.unite && stats.unite !== '—' && (
                  <span style={{ fontSize: '12px', color: '#94a3b8', fontWeight: 400 }}>
                    {' '}{stats.unite}
                  </span>
                )}
              </div>
              <div style={{
                fontSize: '11px',
                color: '#64748b',
                fontWeight: 600,
                textTransform: 'uppercase',
                letterSpacing: '0.5px'
              }}>
                {label}
              </div>
            </div>
          ))}
          <div style={{ gridColumn: '1 / -1', fontSize: '14px', color: '#64748b', marginTop: '4px' }}>
            📌 {stats.libelle || stats.code} — Utile pour situer un nouveau résultat par rapport à l'historique du Centre
          </div>
        </div>
      )}

      {stats && stats.n === 0 && (
        <div style={{
          marginTop: '16px',
          padding: '16px',
          background: '#fef3c7',
          borderRadius: '8px',
          color: '#92400e',
          fontSize: '14px'
        }}>
          ⚠️ Aucune donnée pour ce paramètre avec ces filtres
        </div>
      )}
    </div>
  );
}