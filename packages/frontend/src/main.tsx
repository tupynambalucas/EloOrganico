import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import './main.module.css'; // Importa o CSS global aqui

// Pega o elemento com id "root" do seu HTML
const rootElement = document.getElementById('root');

if (!rootElement) {
  throw new Error('Elemento root não encontrado. Verifique se o index.html possui <div id="root"></div>');
}

createRoot(rootElement).render(
  <StrictMode>
    <App />
  </StrictMode>,
);