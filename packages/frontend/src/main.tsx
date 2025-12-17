import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';

import '@fontsource/nunito/200.css'; // Extra Light
import '@fontsource/nunito/300.css'; // Light
import '@fontsource/nunito/400.css'; // Regular
import '@fontsource/nunito/500.css'; // Medium
import '@fontsource/nunito/600.css'; // Semi-bold
import '@fontsource/nunito/700.css'; // Bold
import '@fontsource/nunito/800.css'; // Extra Bold
import '@fontsource/nunito/900.css'; // Black

import './main.css';
import App from './App';

const rootElement = document.getElementById('root');

if (!rootElement) {
  throw new Error('Elemento root não encontrado.');
}

createRoot(rootElement).render(
  <StrictMode>
    <App />
  </StrictMode>,
);