import { createContext, useState } from "react";

// Context Component => shared the context with the app
const AuthContext = createContext()

// Wrapper Component => holds the states and functions to be shared 
const AuthWrapper = ({children}) => {
    // add states and functions here
    const [ isLoggedIn, setIsLoggedIn ] = useState(false)
    const [ loggedUserId, setLoggedUserId ] = useState(null)
    const [ userRole, setUserRole ] = useState(null)

    const verifyUser = () => {

    }

    const passedContext = {
        isLoggedIn,
        setIsLoggedIn,
        loggedUserId,
        setLoggedUserId,
        userRole,
        setUserRole,
        verifyUser,
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