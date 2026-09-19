import { useEffect, useState, useContext } from "react";
import { AuthContext } from "./AuthContext.jsx";
import { CartContext } from "./cartContext.js";

export { CartContext };

export const CartProvider = ({children}) => {
    const auth = useContext(AuthContext);
    const user = auth?.user ?? null;

    const cartStorageKey = user ? `cart_${user._id || user.email}` : "cart_guest";

    const getCartItemKey = (item) => `${item._id}-${item.size || "default"}`;

    const [cart, setCart] = useState(() => {
        const savedCart = localStorage.getItem(cartStorageKey);
        return savedCart ? JSON.parse(savedCart) : [];
    });

    useEffect(() => {
        localStorage.setItem(cartStorageKey, JSON.stringify(cart));
    }, [cart, cartStorageKey]);

    const addToCart = (product, qty = 1) => {
        const itemKey = `${product._id}-${product.size || "default"}`;
        const exists = cart.find(item => getCartItemKey(item) === itemKey);

        if (exists) {
            const updateCart = cart.map(item => getCartItemKey(item) === itemKey
                ? {
                    ...item,
                    quantity: item.quantity + qty
                }
                : item
            );
            setCart(updateCart);
        } else {
            setCart([
                ...cart,
                {
                    ...product,
                    quantity: qty
                }
            ]);
        }
    };

    const increaseQuantity = (_id, size = "default") => {
        const itemKey = `${_id}-${size}`;
        const updatedCart = cart.map(item => getCartItemKey(item) === itemKey
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
        setCart(updatedCart);
    };
    
    const decreaseQuantity = (_id, size = "default") => {
        const itemKey = `${_id}-${size}`;
        const updatedCart = cart.map(item => getCartItemKey(item) === itemKey
            ? { ...item, quantity: item.quantity - 1 }
            : item
        ).filter(item => item.quantity > 0);
        setCart(updatedCart)
    }

    const removeFromCart = (_id, size = "default") => {
        const itemKey = `${_id}-${size}`;
        setCart(
            cart.filter(item => getCartItemKey(item) !== itemKey)
        );
    };

    const clearCart = ( )=> {
       setCart([]);
    localStorage.removeItem(cartStorageKey);//opcional: eliminar el carrito del localStorage al limpiar el carrito
    };

    const totalPrice = cart.reduce(
        (acc,item) => acc + item.price * item.quantity,0);

    const totalItems = cart.reduce(
        (acc, item) => acc + item.quantity,0);

    return(
        <CartContext.Provider
          value={{
            cart,
            addToCart,
            increaseQuantity,
            decreaseQuantity,
            removeFromCart,
            clearCart,
            totalPrice,
            totalItems,
        }}
        >{children}
        </CartContext.Provider>
    );
}