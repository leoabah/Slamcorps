import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { FaSearch, FaShoppingCart, FaUser , FaBars, FaTimes} from 'react-icons/fa'
import { useContext } from "react"
import { CartContext } from  "@/context/CartContext"
import logoHeader from "@/assets/logo.png"
import MiniCart from '@/components/MiniCart.jsx'
import { AuthContext } from '../context/AuthContext'
import SearchHome from "./SearchHome"
import { SearchContext } from '../context/SearchContext'


export default function Header() {

  const {search,setSearch}=useContext(SearchContext);


  const  { totalItems } = useContext(CartContext);

  const [menuOpen, setMenuOpen]= 
  useState(false);
  
  const [openCart , setOpenCart]= useState(false);
  
  const { user, logout } = useContext(AuthContext); 

  const firstName = user?.name?.split(" ")[0];

  const handleLogout = ()=> {
    logout()
      setMenuOpen(false);
  };

  return (
    <header className='header'>
        <nav className='nav-bar'>
            <div className='logo'>
                <img className='logo-img' src={logoHeader} alt="logo del comercio"/>
                <h3 className='logo-title' >Libreria<br/>Cosmica</h3>
            </div>
            <button
             className='menu-btn'
             onClick={()=>
              setMenuOpen(!menuOpen)
             }
            >
              {menuOpen
                ?<FaTimes />
                :<FaBars />
              }
            </button>
            <br/>
            <div className={
              menuOpen
              ?'div-links active'
              :'div-links'}
              >
                 <Link to="/" className='link-nav' >Home</Link>
                 <Link to="/alta" className='link-nav' >Alta</Link>
                 <Link to="/contact" className='link-nav' >Contacto</Link>
                 <Link to="/about" className='link-nav' >Nosotros</Link>
            
            <div className='search'>

              <SearchHome
                search={search}
                setSearch={setSearch}
              />

              {/* <button className='searchBtn'>
                <FaSearch/>
                </button> */}
            </div>
          </div>

            <div className='cartWrapper'>
              <button 
              className='cart-link'
              style={{"background":"transparent"}}
              onClick={() =>
                setOpenCart(!openCart)
              }
              > 

              <FaShoppingCart 
              style={{
                width:30,
                height:30 
              }}
              />

              {totalItems > 0 &&(
                <span className="cart-badge">
                {totalItems}
                </span>
              )}
              
              </button>
              {
                openCart && (

              <MiniCart
                setOpenCart={setOpenCart}
              />
                )
              }
            </div>

              {
              user ? (
                <div className='auth-links'>
                  <Link 
                    to="/perfil" 
                    className='perfil-btn' 
                   style={{display: 'flex',
                          alignItems: 'center', 
                          gap: '8px',
                          width:'6rem'
                        }}
                    
                    >

                    <FaUser size={24} />

                    {firstName}

                  </Link>

                  <button 
                     onClick={handleLogout} 
                     className='registrarse-btn'
                     style={{background:"crimson"}}
                  >
                    Cerrar
                  </button>

                </div>

              ) : (

                <div className='auth-links'>

                  <Link 
                    to="/login" 
                    className='iniciar-btn'
                  >
                      Iniciar
                  </Link>

                  <Link 
                     to="/register" 
                     className='registrarse-btn'
                  >
                    Registrarse

                  </Link>

                </div>
              )}
        </nav>
    </header>
  )
}

