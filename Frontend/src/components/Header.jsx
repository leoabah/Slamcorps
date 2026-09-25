 import{ useState } from 'react'
import { Link } from 'react-router-dom'
import { FaShoppingCart, FaUser , FaBars, FaTimes} from 'react-icons/fa'
import { useContext } from "react"
import { CartContext } from  "@/context/cartContext.js"
import logoHeader from "@/assets/slam_logo.png"
import MiniCart from '@/components/MiniCart.jsx'
import { AuthContext } from '../context/AuthContext'
import SearchHome from "./SearchHome"
import { SearchContext } from '../context/SearchContext'


export default function Header() {

  const searchContext = useContext(SearchContext) ?? {};
  const { search = "", setSearch = () => {} } = searchContext;

  const cartContext = useContext(CartContext) ?? {};
  const { totalItems = 0 , clearCart } = cartContext;

  const [menuOpen, setMenuOpen]= useState(false);
  
  const [openCart , setOpenCart]= useState(false);
  
  const { user, logout } = useContext(AuthContext); 

  const firstName = user?.name?.split(" ")[0];

  const handleLogout = ()=> {
    if (clearCart){
      clearCart();
    }
    logout()
      setMenuOpen(false);
      setOpenCart(false);
  };

  return (
    <header className='header'>
        <nav className='nav-bar'>
            <div className='logo'>
                <img className='logo-img' src={ logoHeader } alt="logo del comercio"/>
                <h3 className='logo-title' >SLAM Corps</h3>
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
                 {user?.role === "admin" && (
                    <Link to="/alta" className='link-nav'>Alta de productos</Link>
                  )
                }
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

