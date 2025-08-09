import { createContext, useEffect } from "react";

export const CartContext = createContext();

export default function CartContextProvider({children}) {
    const [cartItems , setCartItems] = useState([]);
     
    useEffect(() => {
        setCartItems(JSON.parse(localStorage?.getItem("COATECH_CART_ITEMS")));

        function handleStorageChange() {
            setCartItems(JSON.parse(localStorage?.getItem("COATECH_CART_ITEMS")));
        }

        document.addEventListener("storage" , handleStorageChange)
        const intervalOut = setTimeout(() => {
            const currentCart = JSON.parse(localStorage?.getItem("COATECH_CART_ITEMS"));
            if(JSON.stringify(currentCart) !== JSON.stringify(cartItems)) {
                setCartItems(currentCart);
            }
        } ,1000);

        return() => {
            clearInterval(intervalOut);
            document.removeEventListener("storage", handleStorageChange);
        }
    } , [])
     
    
}