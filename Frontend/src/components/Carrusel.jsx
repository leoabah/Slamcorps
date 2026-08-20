import React, { useState , useEffect} from "react";
import { FaArrowAltCircleLeft , FaArrowAltCircleRight } from "react-icons/fa";
import "@/styles/Carrusel.scss"
import "@/styles/product-card.scss"

const Carrusel = ({ images}) =>{
    const [currentIndex , setCurrentIndex]= useState(0);

    const nextSlide =( )=> {
        setCurrentIndex((prev) => (prev === images.length - 1) ? 0 : prev + 1);
    };
    const prevSlide = () => {
        setCurrentIndex((prev) => (prev === 0 ? images.length -1 : prev - 1));
}; 

useEffect(() => {
    const interval =  setInterval(()=>{
        nextSlide();
    }, 5000);
    return()=> clearInterval(interval);
},[currentIndex]);

return(
    <div className="carrusel-container">
        <button className="prev" onClick={prevSlide}>
            <FaArrowAltCircleLeft style={{width:40, height:40 }}/>
        </button>
        <div className="carrusel-slide" >
            {images.map((image, index) =>(
                <img 
                  key={index}
                  src={image} 
                  alt="carrusel"
                  className={index ===currentIndex ? "active" :"inactive"}
                />
            ))}
        </div>
        <button className="next" onClick={nextSlide}>
            <FaArrowAltCircleRight  style={{width:40, height:40 }} />
        </button>
    </div> 
)
}
export default Carrusel;