import { createContext, useEffect, useState } from "react";
import authService from "../services/index.services";

// Context Component => shared the context with the app
const AuthContext = createContext()

// Wrapper Component => holds the states and functions to be shared 
const AuthWrapper = ({children}) => {
    // add states and functions here
    const [ isLoggedIn, setIsLoggedIn ] = useState(false)
    const [ loggedUserId, setLoggedUserId ] = useState(null)
    const [ userRole, setUserRole ] = useState(null)
    const [ isVerifyingUser, setIsVerifyingUser ] = useState(true)

    const verifyUser = async() => {
        // send token to the BE to verify it
        const  authToken = localStorage.getItem("authToken")

        try {

            if (!authToken) {
                setIsLoggedIn(false)
                setLoggedUserId(null)
                setUserRole(null)
                setIsVerifyingUser(false)
                return
            }

            const response = await authService.get("/auth/verify")

            setIsLoggedIn(true)
            setLoggedUserId(response.data.payload._id)
            setUserRole(response.data.payload.role)
            setIsVerifyingUser(false)
        } catch(error) {
            setIsLoggedIn(false)
            setLoggedUserId(null)
            setUserRole(null)
            setIsVerifyingUser(false)
        } 
    }

    useEffect(() => {
        verifyUser()
    }, [])

    const passedContext = {
        isLoggedIn,
        setIsLoggedIn,
        loggedUserId,
        setLoggedUserId,
        userRole,
        setUserRole,
        verifyUser,
    }

    if(isVerifyingUser) {
        return <h3> Verifying user credetials. </h3>
    }

    return (
        <AuthContext.Provider value={passedContext}>
            {children}
        </AuthContext.Provider>
    )
}

export {
    AuthContext,
    AuthWrapper
}