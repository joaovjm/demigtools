import { createContext, useEffect, useState } from "react";
import localStorageService from "../utils/localStorageService";

export const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [operatorData, setOperatorData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const savedOperator = localStorageService.get("operatorData");
    if (savedOperator) {
      setOperatorData(savedOperator);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    if (operatorData) {
      localStorageService.set("operatorData", operatorData);
    } else {
      localStorageService.remove("operatorData");
    }
  }, [operatorData]);

  const login = (operator) => {
    setOperatorData(operator);
    localStorageService.set("operatorData", operator);
  };

  const logout = () => {
    setOperatorData(null);
    localStorageService.remove("operatorData");
  };

  return (
    <UserContext.Provider value={{ operatorData, setOperatorData, login, logout, loading }}>
      {!loading && children}
    </UserContext.Provider>
  );
};
