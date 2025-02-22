import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { ThemeProvider } from "@/components/theme-provider"
import { FileSystemProvider } from './context/FileSystemContext.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ThemeProvider>
      <FileSystemProvider>
        <App />
      </FileSystemProvider>
    </ThemeProvider>
  </StrictMode>,
)
