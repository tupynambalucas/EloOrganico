import React from 'react';

const loaderContainerStyle: React.CSSProperties = {
  width: '100%',
  height: '100%',
  backgroundColor: '#ffffff', // Fundo Branco
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  borderRadius: '8px',
  // Garante que fique acima de outros elementos se necessário, 
  // mas dentro do fluxo da section
  zIndex: 10, 
};

const spinnerStyle: React.CSSProperties = {
  border: '4px solid rgba(76, 175, 80, 0.2)', // Verde claro transparente
  borderRadius: '50%',
  borderTop: '4px solid #4CAF50', // Verde Enterprise
  width: '50px',
  height: '50px',
  animation: 'spin 1s linear infinite',
};

const spinAnimation = `
  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
`;

const ContainerLoader = () => {
  return (
    <>
      <style>{spinAnimation}</style>
      <div style={loaderContainerStyle}>
        <div style={spinnerStyle}></div>
      </div>
    </>
  );
};

export default ContainerLoader;