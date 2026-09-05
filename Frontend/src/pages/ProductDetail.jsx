
import { useParams ,useNavigate } from "react-router-dom"
import { useEffect,useState } from "react";
import { useContext } from "react";
import { CartContext } from "@/context/CartContext";
import { toast } from "react-hot-toast";
import { FaMinus, FaPlus } from "react-icons/fa";
import productsApi from "../api/productsApi";
import { getImageUrl } from "@/utils/imageUrl";



export default function ProductDetail(){
    const {id} = useParams();
    const navigate = useNavigate();
    const {
        addToCart,
    } = useContext(CartContext);

    const [product,setProduct]=useState(null);
    const [mainImage, setMainImage]= useState("")
    const [selectedSize, setSelectedSize] = useState("");
    const [quantity, setQuantity] = useState(1);
    const sizes = ["S","M","L","XL"];
    useEffect(() => {

        const getProduct = async()=> { 

        try{
            const response = await productsApi.get(`/${id}`);
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
                    src={getImageUrl(mainImage)}
                    alt={product.title}
                />
                <div className="thumbnails">
                    {images.map((img, index) => (
                        <img
                        key={index}
                       src={getImageUrl(img)}
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

                    Categoria: {product.category}

                </p>

                <p className="description">

                    {product.description}

                </p>

                <div className="size-selector">
                    <p><strong>Selecciona tu talle</strong>:</p>
                    <div className="size-buttons">
                        {sizes.map((size) => (
                            <button
                                key={size}
                                type="button"
                                className={ `btn-size ${selectedSize === size ? "active" : ''}` }
                                onClick={() => setSelectedSize(size)}
                            >
                                {size}
                            </button>
                        ))}
                    </div>
                </div>
{selectedSize && (
                    <div className="quantity-controls">
                        <button
                            type="button"
                            className="btn-count"
                            onClick={() => setQuantity((currentQuantity) =>
                                Math.max(1, currentQuantity - 1)
                            )}
                            aria-label="Disminuir cantidad"
                        >
                            <FaMinus />
                        </button>

                        <span>{quantity}</span>

                        <button
                            type="button"
                            className="btn-count"
                            onClick={() => setQuantity((currentQuantity) =>
                                currentQuantity + 1
                            )}
                            aria-label="Aumentar cantidad"
                        >
                            <FaPlus />
                        </button>
                    </div>
                )}
                <button className="btn-buy"
                onClick={() => {
                    if (!selectedSize) {
                        toast.error("Por favor selecciona un talle");
                        return;
                    }

                    addToCart({ ...product, size: selectedSize}, quantity);

                    toast.success(`Producto (${selectedSize}) agregado`);

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