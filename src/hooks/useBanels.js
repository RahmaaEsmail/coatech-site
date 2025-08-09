import { useEffect, useState } from "react";

export default function useBanelsHook() {
    const [banels, setBanels] = useState([]); 

    useEffect(() => {
        setBanels(JSON.parse(localStorage?.getItem("SELECTED_BANNELS")) || []);

        function handleStorageChange() {
            setBanels(JSON.parse(localStorage?.getItem("SELECTED_BANNELS")) || []);
        }

        window.addEventListener("storage", handleStorageChange);
        
        const intervalId = setInterval(() => {
            const currentCart = JSON.parse(localStorage?.getItem("SELECTED_BANNELS")) || [];
            if(JSON.stringify(currentCart) !== JSON.stringify(banels)) {
                setBanels(currentCart);
            }
        }, 1000);

        return () => {
            clearInterval(intervalId);
            window.removeEventListener("storage", handleStorageChange);
        }
    }, []); // Added cart as dependency to properly track changes
     
    return {setBanels, banels};
}