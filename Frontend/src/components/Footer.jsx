//import React from 'react';
import { FaEnvelope, FaPhoneAlt, FaWhatsapp, FaClock } from 'react-icons/fa';
import "@/styles/footer.scss";

const Footer = () => {
  return (
    <footer className='footer-container'>
      <div className='footer-content'>
        <h3>SLAM - CONTÁCTANOS</h3>
        <div className='contact-info'>
          <p>
            <FaEnvelope className='icon' /> 
            <span>Email:</span> <a href="mailto:slamcoprs@gmail.com">slamcoprs@gmail.com</a>
          </p>
          <p>
            <FaPhoneAlt className='icon' /> 
            <span>Teléfono:</span> <a href="tel:1128865894">11 2886-5894</a>
          </p>
          <p>
            <a href="https://wa.me/5491128865894" target="_blank" rel="noopener noreferrer" className="whatsapp-link">
              <FaWhatsapp className='icon whatsapp' /> <span>¡Escríbenos por WhatsApp!</span>
            </a>
          </p>
          <p>
            <FaClock className='icon' /> 
            <span>Horario:</span> 9-18h
          </p>
        </div>
      </div>

      <div className='footer-bottom'>
        <p>© 2025 By <a href="" className='author-link'><em>Marchlibre</em></a></p>
      </div>
    </footer>
  );
};

export default Footer;