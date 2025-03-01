import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { ThemeProvider } from "@/components/theme-provider"
import { FileSystemProvider } from './context/FileSystemContext.jsx'
import { AuthProvider } from './context/AuthContext'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ThemeProvider>
      <AuthProvider>
        <FileSystemProvider>
          <App />
        </FileSystemProvider>
      </AuthProvider>
    </ThemeProvider>
  </StrictMode>,
)
