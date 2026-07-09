// frontend/src/api.js
// ============================================================================
// API CLIENT - Gestion des requêtes HTTP
// ============================================================================

import { langueCourante } from './i18n/index.jsx';

const BASE = import.meta.env.VITE_BACKEND_URL || '/api';

/**
 * Ajoute ?lang=fr|en au chemin, sauf s'il est déjà présent.
 * Le backend renvoie alors les contenus traduits (avec repli sur le français).
 * Uniquement pour les lectures : inutile d'alourdir POST/PUT/PATCH/DELETE.
 */
function avecLangue(chemin, methode = 'GET') {
  if ((methode || 'GET').toUpperCase() !== 'GET') return chemin;
  if (/[?&]lang=/.test(chemin)) return chemin;
  const separateur = chemin.includes('?') ? '&' : '?';
  return `${chemin}${separateur}lang=${langueCourante()}`;
}

// Configuration
const CONFIG = {
  timeout: 30000,
  retries: 3,
  retryDelay: 1000,
};

// ============================================================
// GESTION DU JETON JWT
// ============================================================
export const jeton = {
  lire: () => sessionStorage.getItem('icerd_token'),
  
  ecrire: (t) => {
    sessionStorage.setItem('icerd_token', t);
    try {
      document.cookie = `icerd_token=${t}; path=/; SameSite=Strict; max-age=28800`;
    } catch (e) {
      // Ignorer les erreurs de cookie en environnement non-sécurisé
    }
  },
  
  effacer: () => {
    sessionStorage.removeItem('icerd_token');
    sessionStorage.removeItem('icerd_user');
    try {
      document.cookie = 'icerd_token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
    } catch (e) {
      // Ignorer les erreurs de cookie
    }
  },
  
  estValide: () => {
    const token = jeton.lire();
    if (!token) return false;
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      return payload.exp * 1000 > Date.now();
    } catch {
      return false;
    }
  },
  
  getPayload: () => {
    const token = jeton.lire();
    if (!token) return null;
    try {
      return JSON.parse(atob(token.split('.')[1]));
    } catch {
      return null;
    }
  },
  
  getRole: () => {
    const payload = jeton.getPayload();
    return payload?.role || null;
  },
  
  getUserId: () => {
    const payload = jeton.getPayload();
    return payload?.id || null;
  },
  
  getUser: () => {
    const payload = jeton.getPayload();
    return payload || null;
  }
};

// ============================================================
// REQUÊTE API PRINCIPALE
// ============================================================
export async function api(chemin, options = {}) {
  const entetes = {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
    'X-Requested-With': 'XMLHttpRequest',
    ...(options.headers || {})
  };
  
  const t = jeton.lire();
  if (t) {
    entetes.Authorization = `Bearer ${t}`;
  }

  // Log de la requête en développement
  if (import.meta.env.DEV) {
    const bodyStr = options.body ? JSON.parse(options.body) : '';
    console.log(`🔵 API Request: ${options.method || 'GET'} ${chemin}`, 
      bodyStr,
      `[Auth: ${!!t}]`
    );
  }

  // Gestion des retries
  let lastError = null;
  for (let attempt = 1; attempt <= CONFIG.retries + 1; attempt++) {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), CONFIG.timeout);
      
      const rep = await fetch(`${BASE}${avecLangue(chemin, options.method)}`, {
        ...options,
        headers: entetes,
        signal: controller.signal
      });
      
      clearTimeout(timeoutId);
      
      // Gérer les réponses
      const contentType = rep.headers.get('content-type') || '';
      let corps;
      if (contentType.includes('application/json')) {
        corps = await rep.json().catch(() => ({}));
      } else {
        corps = await rep.text().catch(() => ({}));
      }
      
      if (!rep.ok) {
        console.error(`🔴 API Error ${rep.status}:`, corps);
        
        // Gestion spécifique des erreurs
        if (rep.status === 401) {
          jeton.effacer();
          if (!window.location.pathname.includes('/portail')) {
            window.location.href = '/portail';
          }
          throw new Error('Session expirée, veuillez vous reconnecter');
        }
        
        if (rep.status === 403) {
          throw new Error('Accès refusé. Vous n\'avez pas les droits nécessaires.');
        }
        
        if (rep.status === 429) {
          throw new Error('Trop de requêtes. Veuillez patienter.');
        }
        
        if (rep.status === 404) {
          throw new Error('Ressource non trouvée');
        }
        
        throw new Error(corps.erreur || corps.message || `Erreur ${rep.status}`);
      }
      
      if (import.meta.env.DEV) {
        console.log(`🟢 API Response ${rep.status}:`, corps);
      }
      
      return corps;
      
    } catch (error) {
      lastError = error;
      
      if (error.name === 'AbortError') {
        console.error('🔴 API Timeout:', chemin);
        throw new Error('La requête a pris trop de temps. Veuillez réessayer.');
      }
      
      // Réessayer pour les erreurs réseau
      if (attempt <= CONFIG.retries && 
          (error.message.includes('network') || 
           error.message.includes('Failed to fetch') ||
           error.message.includes('ECONNREFUSED'))) {
        console.warn(`🔄 Retry ${attempt}/${CONFIG.retries} for ${chemin}`);
        await new Promise(resolve => setTimeout(resolve, CONFIG.retryDelay * attempt));
        continue;
      }
      
      console.error('🔴 API Error:', error.message);
      throw error;
    }
  }
  
  throw lastError || new Error('Erreur inconnue');
}

// ============================================================
// MÉTHODES UTILITAIRES
// ============================================================
export const apiGet = (chemin, options = {}) => api(chemin, { ...options, method: 'GET' });
export const apiPost = (chemin, body, options = {}) => api(chemin, { ...options, method: 'POST', body: JSON.stringify(body) });
export const apiPut = (chemin, body, options = {}) => api(chemin, { ...options, method: 'PUT', body: JSON.stringify(body) });
export const apiPatch = (chemin, body, options = {}) => api(chemin, { ...options, method: 'PATCH', body: JSON.stringify(body) });
export const apiDelete = (chemin, options = {}) => api(chemin, { ...options, method: 'DELETE' });

// ============================================================
// TÉLÉCHARGEMENT DE FICHIERS
// ============================================================
export async function telechargerFichier(chemin, nomParDefaut = 'fichier') {
  const t = jeton.lire();
  const rep = await fetch(`${BASE}${chemin}`, {
    headers: t ? { Authorization: `Bearer ${t}` } : {},
    signal: AbortSignal.timeout(60000)
  });
  
  if (!rep.ok) {
    const corps = await rep.json().catch(() => ({}));
    throw new Error(corps.erreur || `Erreur ${rep.status}`);
  }
  
  const disposition = rep.headers.get('Content-Disposition') || '';
  let nom = (disposition.match(/filename="?([^";]+)"?/) || [])[1] || nomParDefaut;
  
  // Nettoyer le nom de fichier
  nom = nom.replace(/[^a-zA-Z0-9._-]/g, '_');
  
  const blob = await rep.blob();
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = nom;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
  
  return nom;
}

// ============================================================
// FORMATAGE
// ============================================================
export const fcfa = (n) => {
  const value = Number(n || 0);
  return new Intl.NumberFormat('fr-FR', { 
    style: 'currency', 
    currency: 'XAF',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(value);
};

export const formatDate = (date) => {
  if (!date) return '—';
  try {
    const d = new Date(date);
    if (isNaN(d.getTime())) return '—';
    return d.toLocaleDateString('fr-FR', { 
      day: '2-digit', 
      month: '2-digit', 
      year: 'numeric' 
    });
  } catch {
    return '—';
  }
};

export const formatDateTime = (date) => {
  if (!date) return '—';
  try {
    const d = new Date(date);
    if (isNaN(d.getTime())) return '—';
    return d.toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  } catch {
    return '—';
  }
};

export const formatTimeAgo = (date) => {
  if (!date) return '—';
  try {
    const d = new Date(date);
    if (isNaN(d.getTime())) return '—';
    const diff = Date.now() - d.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);
    
    if (minutes < 1) return 'À l\'instant';
    if (minutes < 60) return `Il y a ${minutes} min`;
    if (hours < 24) return `Il y a ${hours} h`;
    if (days < 7) return `Il y a ${days} j`;
    return formatDate(date);
  } catch {
    return '—';
  }
};

export const formatNumber = (n, decimals = 0) => {
  const value = Number(n || 0);
  return new Intl.NumberFormat('fr-FR', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals
  }).format(value);
};

export const formatPercentage = (n) => {
  const value = Number(n || 0) / 100;
  return new Intl.NumberFormat('fr-FR', {
    style: 'percent',
    minimumFractionDigits: 1,
    maximumFractionDigits: 1
  }).format(value);
};

// ============================================================
// UTILITAIRES DE STATUT
// ============================================================
export const getStatusColor = (status, type = 'bg') => {
  const colors = {
    bg: {
      'RECU': 'bg-blue-100 text-blue-800',
      'EN_COURS': 'bg-yellow-100 text-yellow-800',
      'TERMINEE': 'bg-green-100 text-green-800',
      'VALIDEE': 'bg-green-100 text-green-800',
      'FACTUREE': 'bg-purple-100 text-purple-800',
      'ANNULEE': 'bg-red-100 text-red-800',
      'PAYEE': 'bg-green-100 text-green-800',
      'IMPAYEE': 'bg-red-100 text-red-800',
      'EMISE': 'bg-yellow-100 text-yellow-800',
      'PARTIELLEMENT_PAYEE': 'bg-orange-100 text-orange-800',
      'CONFORME': 'bg-green-100 text-green-800',
      'NON_CONFORME': 'bg-red-100 text-red-800',
      'A_FAIRE': 'bg-gray-100 text-gray-800',
      'EN_ANALYSE': 'bg-yellow-100 text-yellow-800',
      'ANALYSE_TERMINEE': 'bg-blue-100 text-blue-800',
      'BROUILLON': 'bg-gray-100 text-gray-800',
      'ENREGISTREE': 'bg-blue-100 text-blue-800',
      'RAPPORT_EMIS': 'bg-purple-100 text-purple-800',
      'CLOTUREE': 'bg-green-100 text-green-800',
    },
    badge: {
      'RECU': 'badge-lab--info',
      'EN_COURS': 'badge-lab--warning',
      'TERMINEE': 'badge-lab--success',
      'VALIDEE': 'badge-lab--success',
      'FACTUREE': 'badge-lab--primary',
      'ANNULEE': 'badge-lab--danger',
      'PAYEE': 'badge-lab--success',
      'IMPAYEE': 'badge-lab--danger',
      'EMISE': 'badge-lab--warning',
      'PARTIELLEMENT_PAYEE': 'badge-lab--warning',
      'CONFORME': 'badge-lab--success',
      'NON_CONFORME': 'badge-lab--danger',
      'A_FAIRE': 'badge-lab--info',
      'EN_ANALYSE': 'badge-lab--warning',
      'ANALYSE_TERMINEE': 'badge-lab--primary',
      'BROUILLON': 'badge-lab--secondary',
      'ENREGISTREE': 'badge-lab--info',
      'RAPPORT_EMIS': 'badge-lab--primary',
      'CLOTUREE': 'badge-lab--success',
    }
  };
  return colors[type]?.[status] || (type === 'bg' ? 'bg-gray-100 text-gray-800' : 'badge-lab--info');
};

export const getStatusLabel = (status) => {
  const labels = {
    'RECU': '📥 Reçu',
    'EN_COURS': '🔄 En cours',
    'TERMINEE': '✅ Terminée',
    'VALIDEE': '✅ Validée',
    'FACTUREE': '💰 Facturée',
    'ANNULEE': '❌ Annulée',
    'PAYEE': '💳 Payée',
    'IMPAYEE': '⚠️ Impayée',
    'EMISE': '📄 Émise',
    'PARTIELLEMENT_PAYEE': '💰 Partiellement payée',
    'CONFORME': '✅ Conforme',
    'NON_CONFORME': '❌ Non conforme',
    'A_FAIRE': '⏳ À faire',
    'EN_ANALYSE': '🔬 En analyse',
    'ANALYSE_TERMINEE': '📊 Analyse terminée',
    'BROUILLON': '📝 Brouillon',
    'ENREGISTREE': '📥 Enregistrée',
    'RAPPORT_EMIS': '📄 Rapport émis',
    'CLOTUREE': '🔒 Clôturée',
  };
  return labels[status] || status;
};

// ============================================================
// EXPORT PAR DÉFAUT
// ============================================================
export default {
  api,
  apiGet,
  apiPost,
  apiPut,
  apiPatch,
  apiDelete,
  jeton,
  telechargerFichier,
  fcfa,
  formatDate,
  formatDateTime,
  formatTimeAgo,
  formatNumber,
  formatPercentage,
  getStatusColor,
  getStatusLabel,
};