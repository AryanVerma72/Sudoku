import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import './index.css';

// Register Service Worker for PWA compliance and offline support (only on http/https)
if (typeof window !== 'undefined' && 'serviceWorker' in navigator && window.location.protocol.startsWith('http')) {
  window.addEventListener('load', () => {
    navigator.serviceWorker
      .register('/sw.js')
      .then((registration) => {
        console.log('ZenSudoku ServiceWorker registered: ', registration.scope);
      })
      .catch((err) => {
        console.log('ZenSudoku ServiceWorker registration failed: ', err);
      });
  });
}

createRoot(document.getElementById('root')!).render(<App />);
