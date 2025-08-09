import { useEffect, useState } from "react";

export default function useCartHook() {
    const [cart, setCart] = useState([]); 

    useEffect(() => {
        // Initial load
        setCart(JSON.parse(localStorage?.getItem("COATECH_CART_ITEMS")) || []);

        function handleStorageChange() {
            setCart(JSON.parse(localStorage?.getItem("COATECH_CART_ITEMS")) || []);
        }

        // Listen for storage changes
        window.addEventListener("storage", handleStorageChange);
        
        // Check for changes every 300ms
        const intervalId = setInterval(() => {
            const currentCart = JSON.parse(localStorage?.getItem("COATECH_CART_ITEMS")) || [];
            if(JSON.stringify(currentCart) !== JSON.stringify(cart)) {
                setCart(currentCart);
            }
        }, 1000);

        return () => {
            clearInterval(intervalId);
            window.removeEventListener("storage", handleStorageChange);
        }
    }, []); // Added cart as dependency to properly track changes
     
    return {setCart, cart};
}