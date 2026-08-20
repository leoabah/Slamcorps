//import "@voaii/proxima-nova"
import "@fontsource/montserrat"
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App.jsx'
import "./styles/main.scss"
import { CartProvider } from './context/CartContext.jsx'
import { Toaster } from "react-hot-toast"
import { AuthProvider } from "./context/AuthContext.jsx"
import { SearchProvider } from "./context/SearchContext.jsx"


createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter 
      basename= {
        import.meta.env.BASE_URL
        }>
    <SearchProvider>

     <CartProvider>
      <AuthProvider>
       < App />
      </AuthProvider>
       <Toaster
         position="top-right"
         toastOptions={{
           duration: 2500,
          }} 
          />
      </CartProvider>
    </SearchProvider>
    </BrowserRouter>
  </StrictMode>,
)
