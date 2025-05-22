import { useContext } from "react"
import { UserContext } from "../context/UserContext"
import { Navigate, Outlet } from "react-router";

const ProtectedRoute = ({requiredRole}) => {
    // const { operatorData } = useContext(UserContext);
    const caracterOperator = JSON.parse(localStorage.getItem("operatorData"))
    if(!caracterOperator){
        return <div>Carregando...</div>;
    }

    const { operator_type } = caracterOperator;

    if (requiredRole === "Admin" && operator_type !== "Admin"){
        return <Navigate to="/dashboard"/>
    }

    if (requiredRole === "Operador" && operator_type === "Admin"){
        return <Navigate to="/dashboardAdmin"/>
    }

    return <Outlet/>
}

export default ProtectedRoute;