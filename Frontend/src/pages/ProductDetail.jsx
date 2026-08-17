
import { useParams ,useNavigate } from "react-router-dom"
import { useEffect,useState } from "react";
import { useContext } from "react";
import { CartContext } from "@/context/CartContext";
import { toast } from "react-hot-toast";
import productsApi from "../api/productsApi";



export default function ProductDetail(){
    const {id} = useParams();
    const navigate = useNavigate();
    const {addToCart} = useContext(CartContext);

    const [product,setProduct]=useState(null);
    const [mainImage, setMainImage]= useState("")

    useEffect(() => {

        const getProduct = async()=> { 

        try{
            const response = 

               await productsApi.get(

                `/${id}`

               );
               console.log(response.data);
               setProduct(response.data);
               
               setMainImage(response.data.image[0]);

        } catch(error) {
            console.log(error);
        }
    };
    
    getProduct();
},[id]);

if (!product){
    return<h2>Cargando Producto...</h2>
}

const images = Array.isArray(product.image)
  ? product.image
  : [product.image];


    return(
        <div className="product-detail">

            <div className="detail-gallery">

                <img
                className="main-image"
                    src={
                           import.meta.env.BASE_URL +
                            mainImage.replace("/", "")
                        }
                    alt={product.title}
                />
                <div className="thumbnails">
                    {images.map((img, index) => (
                        <img
                        key={index}
                       src={
                            import.meta.env.BASE_URL +
                             img.replace("/", "")
                            }
                            alt = "thumbnails"
                            onClick= {() =>
                                setMainImage(img)
                            }

                        />
        
                    ))}

                </div>

            </div>

            <div className="detail-info">

                <h1>{product.title}</h1>

                <h2>{product.price} ars</h2>

                <p className="category">

                    Categoria:{product.category}

                </p>

                <p className="description">

                    {product.description}

                </p>

                

                <button className="btn-buy"
                onClick={() => {

                addToCart(product);

                toast.success("Producto agregado");

              }}
                >
                    Comprar ahora
                </button>
                <button className="btn-back"
                  onClick={() => navigate(-1)}
               >
                Volver
                </button>
            </div>

            

        </div>
    );
}