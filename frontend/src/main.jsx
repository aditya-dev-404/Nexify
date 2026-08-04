import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { BrowserRouter } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext.jsx'
import { UserProvider } from './context/UserContext.jsx'
import { ThemeProvider } from './context/ThemeContext.jsx'

createRoot(document.getElementById('root')).render(
  <BrowserRouter>

    <AuthProvider>
  <ThemeProvider>
      <UserProvider>
        <App />
      </UserProvider>
  </ThemeProvider>
    </AuthProvider>
  </BrowserRouter>
)
