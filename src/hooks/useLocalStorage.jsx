import { useState } from "react";

export function useLocalStorage(key, initialValue){
    const [storedValue, setStoredValue] = useState(() => {
        try{
            const item = localStorage.getItem(key);
            return item ? JSON.parse(item) : initialValue;
        }catch(error) {
            console.error(error.message);
            return initialValue;
        }
        
    });

    const setValue = (value) => {
        try{
            const valueToStore = value instanceof Function ? value(storedValue) : value;
            setStoredValue(valueToStore)
            localStorage.setItem(key, JSON.stringify(valueToStore));
        } catch (error) {
            console.error(error.message)
        }
    }

    return [storedValue, setValue]
}