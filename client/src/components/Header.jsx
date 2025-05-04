import { useUserAuthContext } from "../context/UserAuthContext";
import { useNavigate, Link } from "react-router-dom";
import { logoutUser } from "../services/userService";

export const Header = () => {
    const {user, setUser} = useUserAuthContext()
    const navigate = useNavigate()
    const isLoginPage = location.pathname === '/login'
    const isRegisterPage = location.pathname === '/register'

    const handelLogout = async e => {
        e.preventDefault()
        try {
            await logoutUser()
            setUser(null)
            navigate('/login')
        } catch (err) {
            console.error("Logout failed:", err)
        }
    }

    return (
        <div className="header">
            <div className="w-full">
                {user
                ? <h1>Welcome {user.firstName} {user.lastName}</h1>
                : <h1>Welcome to Travel Tracker</h1>
                }
            </div>
            <div className="nav-div">
                {!user &&
                    <div>
                        {!isLoginPage && <Link to={'/login'} className="nav-link" >Login</Link>}
                        {!isRegisterPage && <Link to={'/register'} className="nav-link" >Register</Link>}
                    </div>
                }
                {user && <a className="nav-link" href="" onClick={handelLogout}>Logout</a>}
            </div>
        </div>
    )
}