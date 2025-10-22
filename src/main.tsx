import React from 'react';
import ReactDOM from 'react-dom/client';
import App from '../App';
import './index.css'; // Assumindo que você tem um arquivo CSS global

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);

