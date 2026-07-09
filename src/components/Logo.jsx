// frontend/src/components/Logo.jsx
import React from 'react';

export const LogoICERD = ({ 
  size = 48, 
  variant = 'full', 
  className = '',
  style = {}
}) => {
  // Si variant === 'icon', on affiche seulement l'icône
  if (variant === 'icon') {
    return (
      <img
        src="/logo/logo-icerd-icon.png"
        alt="ICERD"
        width={size}
        height={size}
        className={className}
        style={{
          objectFit: 'contain',
          ...style
        }}
      />
    );
  }

  // Version complète avec le texte
  return (
    <div 
      className={className} 
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '12px',
        ...style
      }}
    >
      <img
        src="/logo/logo-icerd.png"
        alt="ICERD"
        width={size}
        height={size}
        style={{
          objectFit: 'contain',
          flexShrink: 0
        }}
      />
      {variant === 'full' && (
        <div>
          <div style={{
            fontWeight: 800,
            fontSize: size * 0.38,
            color: '#0f2d80',
            lineHeight: 1,
            letterSpacing: '-0.5px'
          }}>
            ICERD
          </div>
          <div style={{
            fontSize: size * 0.14,
            color: '#64748b',
            fontWeight: 500,
            letterSpacing: '0.3px',
            textTransform: 'uppercase'
          }}>
            International Centre of Environmental Studies and Research for Development
          </div>
        </div>
      )}
    </div>
  );
};

// Version simplifiée qui prend une image directement
export const LogoImage = ({ size = 48, className = '', style = {} }) => {
  return (
    <img
      src="/logo/logo-icerd.png"
      alt="ICERD - Centre International d'Études et de Recherche en Environnement pour le Développement"
      width={size}
      height={size}
      className={className}
      style={{
        objectFit: 'contain',
        ...style
      }}
    />
  );
};

export default LogoICERD;