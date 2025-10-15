import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';

const App = () => (
  <main style={{ fontFamily: 'system-ui, sans-serif', margin: '2rem auto', maxWidth: '640px' }}>
    <h1>Commensal Frontend Placeholder</h1>
    <p>
      Reemplaza el contenido de <code>frontend/main.tsx</code> con tu interfaz en React. Una vez que
      termines, ejecuta <code>npm run build:frontend</code> para volver a generar los archivos
      estáticos que el backend servirá.
    </p>
  </main>
);

const rootElement = document.getElementById('root');

if (!rootElement) {
  throw new Error('Elemento con id "root" no encontrado en el documento.');
}

createRoot(rootElement).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
