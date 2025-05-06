import { createContext, useEffect, useState } from "react";
import localStorageService from "../utils/localStorageService"

export const UserContext = createContext();

export const UserProvider = ({children}) => {
    const [operatorData, setOperatorData] = useState(() => localStorageService.get("operatorData"));

    useEffect(() => {
        localStorageService.set("operatorData", operatorData);
    }, [operatorData])

    return (
        <UserContext.Provider value={{operatorData, setOperatorData}}>
            {children}
        </UserContext.Provider>
    )
}