import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { AuthProvider } from './authContext.jsx'
import { Toaster } from 'sonner';
createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AuthProvider>
    <Toaster position="top-center" duration={3000} style={{borderTop:'none'}}/>
        <App style={{borderTop:'none'}}/>
      </AuthProvider>
  </StrictMode>,
)
