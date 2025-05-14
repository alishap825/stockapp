import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';

const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
  // <React.StrictMode>
    <App />
  // </React.StrictMode>
);

reportWebVitals();

// Catch ResizeObserver loop limit exceeded error
window.addEventListener('error', (e) => {
  if (e.message === 'ResizeObserver loop limit exceeded') {
    const overlay = document.getElementById('webpack-dev-server-client-overlay-div');
    if (overlay) {
      overlay.style.display = 'none';
    }
    e.stopImmediatePropagation();
    e.preventDefault();
  }
});
