import { AuthContext } from "@/context/AuthContext";
import { Link, useNavigate } from "react-router-dom";
import { useContext } from "react";
//import { toast } from "react-hot-toast";
//import { CartContext } from "@/context/CartContext";
//import { FaMinus, FaPlus } from "react-icons/fa";

export default function ProductsCard({
  product,
  deleteProduct,
}) {
  const navigate = useNavigate();
  // const {
  //   cart,
  //   increaseQuantity,
  //   decreaseQuantity,
  // } = useContext(CartContext);

  // const cartItem = cart.find(
  //   item => item._id === product._id
  // );
  const { user } = useContext(AuthContext);
  const isAdmin = user?.role === "admin";

  const imageUrl = Array.isArray(product.image)
    ? product.image[0]
    : product.image;

  const apiUrl = import.meta.env.VITE_API_URL || "https://slamcorps.onrender.com";
  const finalImage = imageUrl
    ? imageUrl.startsWith("/uploads/")
      ? `${apiUrl}${imageUrl}`
      : `${import.meta.env.BASE_URL}${imageUrl.replace(/^\//, "")}`
    : `${import.meta.env.BASE_URL}placeholder.jpg`;

  return (

    <div className="product-card">

      <div className="product-image">

        <img
          src={finalImage}
          alt={product.title}
        />

      </div>

      <div className="product-content">

        <h3>{product.title}</h3>

        <p className="price">
          ${product.price.toLocaleString()} ARS
        </p>

        {

        //  !cartItem ? (

            <button
              className="btn-card"
              onClick={() => {

               navigate(`/products/${product._id}`);
              }}
            >
              Comprar
            </button>

          //) 
          //: (

          //   <div className="quantity-controls">

          //     <button
          //       className="btn-count"
          //       onClick={() =>
          //         decreaseQuantity(product._id)
          //       }
          //     >
          //       <FaMinus />
          //     </button>

          //     <span>
          //       {cartItem.quantity}
          //     </span>

          //     <button
          //       className="btn-count"
          //       onClick={() =>
          //         increaseQuantity(product._id)
          //       }
          //     >
          //       <FaPlus />
          //     </button>

          //   </div>

          // )

        }

        <Link
          to={`/products/${product._id}`}
          className="cart-detail"
        >
          Ver producto
        </Link>

        {

          isAdmin && (

            <>

              <button
                className="btn-delete"
                onClick={() =>
                  deleteProduct(product._id)
                }
              >
                Eliminar
              </button>

              <Link
                to={`/edit/${product._id}`}
                className="btn-edit"
              >
                Editar
              </Link>

            </>

          )

        }

      </div>

    </div>

  );

}