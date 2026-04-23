import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

// Apply dark mode before first render to avoid flash
if (localStorage.getItem("dark_mode") === "true") {
  document.documentElement.setAttribute("data-theme", "dark");
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
