import { useUserAuthContext } from "../context/UserAuthContext";
import { useNavigate, Link } from "react-router-dom";

export const Header = () => {
    const {user, setUser} = useUserAuthContext()
    const navigate = useNavigate()
    const isLoginPage = location.pathname === '/login'
    const isRegisterPage = location.pathname === '/register'

    return (
        <div className="header">
            <div className="w-full">
                <h1 className="m-6">Welcome to Travel Tracker</h1>
            </div>
        </div>
    )
}