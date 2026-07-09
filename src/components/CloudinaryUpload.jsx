// frontend/src/components/CloudinaryUpload.jsx
import { useState } from 'react';
import { api } from '../api.js';

export default function CloudinaryUpload({ onUpload, onError, folder = 'icerd', label = 'Télécharger une image' }) {
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);

  const handleUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Vérifier le type de fichier
    if (!file.type.startsWith('image/')) {
      onError?.('Veuillez sélectionner une image');
      return;
    }

    // Vérifier la taille (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      onError?.('L\'image ne doit pas dépasser 5MB');
      return;
    }

    setUploading(true);
    setProgress(0);

    try {
      const formData = new FormData();
      formData.append('image', file);
      formData.append('folder', folder);

      const response = await fetch('/api/upload', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${sessionStorage.getItem('icerd_token')}`
        },
        body: formData
      });

      // Simuler la progression
      const interval = setInterval(() => {
        setProgress(prev => {
          if (prev >= 90) {
            clearInterval(interval);
            return 90;
          }
          return prev + 10;
        });
      }, 200);

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.erreur || 'Erreur lors de l\'upload');
      }

      const data = await response.json();
      clearInterval(interval);
      setProgress(100);

      setTimeout(() => {
        onUpload?.(data.url);
        setUploading(false);
        setProgress(0);
      }, 500);

    } catch (error) {
      setUploading(false);
      setProgress(0);
      onError?.(error.message);
    }
  };

  return (
    <div style={{ width: '100%' }}>
      <label
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '20px',
          border: `2px dashed ${uploading ? 'var(--blue-brand)' : 'var(--border-color)'}`,
          borderRadius: '8px',
          cursor: uploading ? 'wait' : 'pointer',
          background: uploading ? 'var(--blue-brand-light)' : 'transparent',
          transition: 'all 0.3s ease',
          minHeight: '120px'
        }}
      >
        <input
          type="file"
          accept="image/*"
          onChange={handleUpload}
          disabled={uploading}
          style={{ display: 'none' }}
        />
        {uploading ? (
          <div style={{ textAlign: 'center', width: '100%' }}>
            <div style={{
              width: '40px',
              height: '40px',
              border: '3px solid #1d4ed8',
              borderTopColor: 'transparent',
              borderRadius: '50%',
              animation: 'spin 0.8s linear infinite',
              margin: '0 auto 8px'
            }}></div>
            <p style={{ fontSize: '13px', color: 'var(--text-muted)' }}>
              Upload en cours... {progress}%
            </p>
            <div style={{
              width: '100%',
              height: '4px',
              background: 'var(--border-color)',
              borderRadius: '2px',
              overflow: 'hidden',
              marginTop: '8px'
            }}>
              <div style={{
                width: `${progress}%`,
                height: '100%',
                background: 'var(--blue-brand)',
                transition: 'width 0.3s ease'
              }}></div>
            </div>
          </div>
        ) : (
          <div style={{ textAlign: 'center' }}>
            <span style={{ fontSize: '32px', display: 'block' }}>📸</span>
            <span style={{ fontSize: '14px', color: 'var(--text-muted)' }}>{label}</span>
            <span style={{ fontSize: '12px', color: 'var(--text-light)', display: 'block', marginTop: '4px' }}>
              PNG, JPG, WEBP · Max 5MB
            </span>
          </div>
        )}
      </label>
      <style>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}