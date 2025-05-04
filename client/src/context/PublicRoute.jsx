import { Navigate, Outlet } from "react-router-dom";
import { useUserAuthContext } from "./UserAuthContext";
import ClipLoader from 'react-spinners/Cliploader'

export const PublicRoute = () => {
    const {user, loading} = useUserAuthContext()

    if (loading) {
        return (
            <div className="background" style={{ display: "flex", justifyContent: "center"}}>
                <ClipLoader color="#4a90e2" size={50} />
            </div>
        )
    }

    return user ? <Navigate to="/dashboard" replace /> : <Outlet/>
}