import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App.jsx';
import { FournisseurI18n } from './i18n/index.jsx';
import './styles.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <FournisseurI18n>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </FournisseurI18n>
  </React.StrictMode>
);
