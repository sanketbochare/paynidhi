// frontend/src/main.jsx or index.jsx
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { Toaster } from "react-hot-toast";
import './index.css';
import App from './App.jsx';
import { AuthProvider } from './context/AuthContext.jsx';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <App />
        <Toaster
        position="top-right"
        toastOptions={{
          className: "text-sm font-medium",
          style: {
            borderRadius: "0.75rem",
            padding: "10px 12px",
          },
        }}
      />
      </AuthProvider>
    </BrowserRouter>
  </StrictMode>
);
