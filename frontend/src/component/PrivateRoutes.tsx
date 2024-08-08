import { Navigate, Outlet } from "react-router-dom";

export function PrivateRoutes(){
    const authtoken= localStorage.getItem("AccessToken")
    return authtoken ? <Outlet/> : <Navigate to='/login'/>
}