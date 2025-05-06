import { Outlet, Navigate, useNavigate } from "react-router-dom"
import { useUserAuthContext } from "./UserAuthContext"
import ClipLoader from 'react-spinners/Cliploader'

export const PrivateRoute = () =>{
    const {user, setUser, loading, setLoading} = useUserAuthContext()
    const navigate = useNavigate()



    if (loading) return (
        <div className='background' style={{ display: "flex", justifyContent: "center"}}>
            <ClipLoader color="#c0c0c0" size={100} />
        </div>
    )
    return user ? <Outlet /> : <Navigate to="/login" replace/>

}