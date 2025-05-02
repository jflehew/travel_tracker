import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { BrowserRouter } from 'react-router-dom'
import { UserAuthContext } from './context/UserAuthContext.jsx'

createRoot(document.getElementById('root')).render(
  <BrowserRouter>
    <UserAuthContext>
      <StrictMode>
        <App />
      </StrictMode>
    </UserAuthContext>
  </BrowserRouter>
)
