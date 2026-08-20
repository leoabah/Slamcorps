//import ProductDetail from "@/components/ProductDetail";
import ProductsCard from "@/components/ProductsCard";
import { useState , useEffect, useContext} from "react";
import Carrusel from "@/components/Carrusel";
import productsApi from "../api/productsApi";
import { SearchContext } from "../context/SearchContext";
import "@/styles/product-card.scss"
import "@/styles/home.scss"
import "@/styles/Carrusel.scss"
import { toast } from "react-hot-toast"
import banner1 from "@/assets/Banner1.png"
import banner2 from "@/assets/Banner2.png"
import banner3 from "@/assets/Banner3.png"


export default function Home() {
   
     const images =[banner1,banner2,banner3];
     const {search} = useContext(SearchContext);
     const [products,setProducts]=useState([]);
     const filteredProducts = products.filter(product =>
      product.title
      .toLowerCase()
      .includes(search.toLowerCase())
     );
     
    useEffect(() => {

   const getProducts = async() => {

      try {

         const response =
         await productsApi.get("/");

         response.data.forEach(product => {
            console.log(product)
         });

         setProducts(response.data);

      } catch(error){

         console.log(error);
      }
   };

   getProducts();

}, []);
     
   
     const deleteProduct = async(id) =>{

      try{
         await productsApi.delete(
            `/${id}`
         );
         setProducts(
            products.filter(
               product => product.id !== id
            )
         );

         toast.success(
            "Producto eliminado"
         )
      }catch(error){
         console.log(error);

         toast.error(
            "error al eliminar"
         );
      }
     };

    return(
       <div>
         <header 
           className="home-page">
            <Carrusel 
            images={images} 
            />
         </header>
         <main 
           className="home"
           >
          <h1 
          className="home-title"
          >
            Bienvenido en la Libreria Cosmica
            </h1>
          <p><em>En nuestra libreria cosmica, te invitamos a explorar un universo de conocimiento y aventura a través de nuestras colecciones de libros, cómics y manga. Sumérgete en historias fascinantes, descubre nuevos mundos y amplía tus horizontes literarios con nosotros. ¡Tu próxima gran lectura te espera en la Libreria Cosmica!</em></p>
          <br />
          
          <div className = "products-grid">
            {
            filteredProducts.map(product => (
                  < ProductsCard
                     key={product._id}
                     product={product}
                     deleteProduct={deleteProduct}
                     />
            ) )
            }            
          </div>
       </main>
      </div>
    );
}