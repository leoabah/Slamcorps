import { Link } from "react-router-dom";
import { useContext } from "react";
import { toast } from "react-hot-toast";
import { CartContext } from "@/context/CartContext";
import { FaMinus, FaPlus } from "react-icons/fa";

export default function ProductsCard({
  product,
  deleteProduct,
}) {

  const {
    cart,
    addToCart,
    increaseQuantity,
    decreaseQuantity,
  } = useContext(CartContext);

  const cartItem = cart.find(
    item => item._id === product._id
  );

  const isAdmin = false;

  const imageUrl = Array.isArray(product.image)
    ? product.image[0]
    : product.image;

  const finalImage = imageUrl
    ? import.meta.env.BASE_URL + imageUrl.replace("/", "")
    : import.meta.env.BASE_URL + "placeholder.jpg";

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

          !cartItem ? (

            <button
              className="btn-card"
              onClick={() => {

                addToCart(product);

                toast.success("Producto agregado");

              }}
            >
              Comprar
            </button>

          ) : (

            <div className="quantity-controls">

              <button
                className="btn-count"
                onClick={() =>
                  decreaseQuantity(product._id)
                }
              >
                <FaMinus />
              </button>

              <span>
                {cartItem.quantity}
              </span>

              <button
                className="btn-count"
                onClick={() =>
                  increaseQuantity(product._id)
                }
              >
                <FaPlus />
              </button>

            </div>

          )

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