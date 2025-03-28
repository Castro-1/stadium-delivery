import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App'
import { CartProvider } from './context/CartContext'
import { Toaster } from 'react-hot-toast'
import './index.css'
createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <CartProvider>
        <App />
        <Toaster position="top-center" />
      </CartProvider>
    </BrowserRouter>
  </StrictMode>,
)
