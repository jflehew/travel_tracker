import { createContext, useState, useContext, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { authenticateUser } from "../services/userService";

const USERAUTHCONTEXT = createContext([])
export const useUserAuthContext = () => useContext(USERAUTHCONTEXT)

export const UserAuthContext = ( { children } ) => {
    const [user, setUser] = useState(null)
    const [loading, setLoading] = useState(true)
    const location = useLocation()

    useEffect(() =>{
        const checkSession = async () => {
            const delay = ms => new Promise(res => setTimeout(res, ms))
            await delay(300)
            try{
                const result = await authenticateUser()
                await delay(300)
                setUser(result)
            } catch {
                setUser(null)
                await delay(300)
            } finally {
                setLoading(false)
            }
        }
        checkSession()
    },[location.pathname])

    return(
        <USERAUTHCONTEXT.Provider value={{ user, setUser, loading, setLoading }}>
            {children}
        </USERAUTHCONTEXT.Provider>
    )
}