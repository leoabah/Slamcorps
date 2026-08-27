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
import banner3 from "@/assets/Banner3.jpg"
import banner4 from "@/assets/Banner4.jpg"


export default function Home() {
   
     const images =[banner1,banner2,banner3,banner4];
     const {search} = useContext(SearchContext);
     const [products,setProducts]=useState([]);
     const filteredProducts = products.filter(product =>
      product.title
      .toLowerCase()
      .includes(search.toLowerCase())
     );
     
    useEffect(() => {

   const getProducts = async() => {
      console.log("URL usada:", import.meta.env.VITE_API_URL);

      try {

         const response =
         await productsApi.get("/api/products");

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

         const token = localStorage.getItem("token");

         await productsApi.delete(
            `/${id}`,{
               headers: {
                  "Authorization": `Bearer ${token}`
               }
            }
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
         <p>
            <em>Bienvenido a Slam Corps

           Diseñamos ropa urbana pensando en tu comodidad diaria. 
           Explora prendas esenciales de estilo moderno, 
           alta calidad y precios al alcance de todos.
           </em>
         </p>
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