import React from 'react';
import Lc_caja from  "@/assets/Lc_caja.png";
import Lc_estante from "@/assets/Lc_estante.png";
import Lc_shopping from "@/assets/Lc_shopping.png";
import Lc_team from "@/assets/Lc_team.png";
import Lc_space from "@/assets/Lc_space.png"
import "@/styles/_aboutUs.scss";

const AboutUs = () => {

  

  return (
  <section 
  className='about-page'
  >
      <div className='about-hero'>
        <h1>Sobre Nosotros</h1>
        <p>
          Bienvenido en Libreria Cosmica , un espacio creado para 
          los amantes de la lectura. Nuestra misión es ofrecer una amplia selección de mangas, comics y novelas, junto con un ambiente acogedor para que puedas disfrutar de tu pasión por la lectura. En Libreria Cosmica, creemos que cada libro es una puerta a nuevos mundos y aventuras, y estamos aquí para ayudarte a descubrirlos.
        </p>
      </div> 
      <div className='about-content'>
        <h2>Nuestra Historia</h2>
        <p>
          Fundada en 2020, Libreria Cosmica nació de la pasión por la lectura y el deseo de crear un espacio donde los amantes de los libros pudieran reunirse. Desde nuestros inicios, hemos trabajado arduamente para ofrecer una selección diversa de títulos y crear un ambiente acogedor para nuestros clientes.
        </p>

      <h2>Que ofrecemos</h2>
      <ul>
        <li>Mangas de las series mas populares.</li>
        <li>Comics de editoriales reconocidas.</li>
        <li>Novelas y  literatura fantástica.</li>
        <li>Compras simples y seguras</li>
      </ul>

      </div> 
    <div
    className='gallery-section'
    >
      <h2>
        Nuestro Local 
      </h2>

      <p>
        Te invitamos a visitar nuestra espacio , donde encontraras
        mangas ,comics ,novelas y un ambiente pensado para vos.
      </p>
      <br />
      <div className='gallery'>

      <img src={Lc_shopping} alt="vista de frente del local" />

      <img src={Lc_team} alt="nuestro equipo " />

      <img src={Lc_space} alt="espacio de lectura" />

      <img src={Lc_estante} alt="encuentra  en nuestra pacillos tu  gusto" />

      <img src={Lc_caja} alt="abonar tu compras" />
      </div>
    </div>
  </section>
  )
}

export default AboutUs