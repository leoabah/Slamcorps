
import {  FaGlobeAmericas, FaAward, FaRocket, FaMapMarkerAlt } from 'react-icons/fa';
import '@/styles/_aboutUs.scss';

const Nosotros = () => {
  return (
    <div className="slam-nosotros-container">
      
      {/* Page Header Banner */}
      <div className="nosotros-hero">
        <h1 id='AbusH'>Sobre Nosotros</h1>
        <p>Conoce la historia, el esfuerzo y la visión detrás de SLAM Corps.</p>
      </div>

      <div className="nosotros-content-wrapper">
        
        {/* Section 1: Digital Model Statement */}
        <section className="nosotros-card digital-statement">
          <div className="badge-digital">100% Digital</div>
          <h2>Nuestra Esencia y Modalidad</h2>
          <p>
            En <strong>SLAM Corps</strong> nos dedicamos a ofrecer productos excepcionales respaldados por una logística de primer nivel. Es importante destacar que <span className="highlight-text">no poseemos local o dirección física de atención al público</span>; operamos de manera íntegramente digital para optimizar procesos y llevar nuestros productos de forma directa y segura a cada rincón del país.
          </p>
        </section>

        {/* Section 2: History (5 Years + Word of Mouth + Digital Evolution) */}
        <section className="nosotros-card history-section">
          <div className="section-tag">Nuestra Historia</div>
          <h3>De una idea entre amigos a la plataforma actual</h3>
          
          <div className="history-grid">
            <div className="history-step">
              <div className="step-icon"><FaRocket /></div>
              <h4>Hace 5 Años</h4>
              <p>Iniciamos este camino como una idea entre amigos, creciendo paso a paso gracias a la recomendación de boca en boca.</p>
            </div>

            <div className="history-step">
              <div className="step-icon"><FaMapMarkerAlt /></div>
              <h4>Sin Local Físico</h4>
              <p>Construimos la confianza de nuestros clientes sin necesidad de un punto presencial, priorizando cercanía virtual y envíos seguros.</p>
            </div>

            <div className="history-step">
              <div className="step-icon"><FaGlobeAmericas /></div>
              <h4>Sitio Web Propio</h4>
              <p>Hoy consolidamos este crecimiento con nuestro propio sitio web, optimizando la experiencia digital para todos ustedes.</p>
            </div>
          </div>
        </section>

        {/* Section 3: Founders (Serge Minkoe & Lionel Abah) */}
        <section className="founders-section">
          <div className="section-tag">Liderazgo</div>
          <h3>Fundadores y Trayectoria</h3>
          <p className="founders-subtitle">Más de 10 años radicado en Argentina, con profundas raíces camerunesas y nacionalidad argentina adoptada.</p>

          <div className="founders-grid">
            
            {/* Founder 1 */}
            <div className="founder-card">
              <div className="founder-badge">Fundador</div>
              <div className="founder-header">
                <div className="founder-avatar">SM</div>
                <div>
                  <h4>Serge Minkoe</h4>
                  <span className="founder-role"><FaAward /> Ex-futbolista & Argentino Nacionalizado</span>
                </div>
              </div>
              <p>
                Oriundo de Camerún. Tras una destacada trayectoria en las canchas de fútbol profesional, lleva más de 10 años radicado en Argentina. Su disciplina, espíritu de equipo y perseverancia sentaron las bases fundacionales de SLAM Corps.
              </p>
            </div>

            {/* Founder 2 */}
            <div className="founder-card">
              <div className="founder-badge">Cofundador</div>
              <div className="founder-header">
                <div className="founder-avatar">LA</div>
                <div>
                  <h4>Lionel Abah</h4>
                  <span className="founder-role"><FaAward /> Ex-futbolista & Argentino Nacionalizado</span>
                </div>
              </div>
              <p>
                Socio y pilar fundamental del proyecto. Al igual que Serge, su pasado como ex-futbolista le inculcó el valor de la resiliencia y el compromiso absoluto con la excelencia en cada entrega que realizamos.
              </p>
            </div>

          </div>
        </section>

      </div>
    </div>
  );
};

export default Nosotros;