import { useContext } from "react"
import { NavLink, useNavigate } from "react-router-dom"
import { AuthContext } from "../context/auth.context"

const Navbar = () => {
  const { setIsLoggedIn, setLoggedUserId, setUserRole, isLoggedIn, userRole } = useContext(AuthContext)
  const navigate = useNavigate()

  const handleSignUpClick = () => {
    navigate("/signup")
  }

  const handleLogInClick = () => {
    navigate("/login")
  }

  const handleLogOutClick = () => {
    // remove token from local storage
    localStorage.removeItem("authToken")

    // revert the context states
    setIsLoggedIn(false)
    setLoggedUserId(null)
    setUserRole(null)
    
    // navigate the user to a public page
    navigate("/login")
  }

  const getNavLink = () => {
    if(userRole === "admin") {
      return "/dashboard"
    } else {
      return "/account"
    }
  }

  return (
    <div className="navbar-container">
        <NavLink to="/"> 
          <img className="logo" src="src/assets/images/logo.png"/>
        </NavLink>
      <div className="navbar-links">
        <NavLink to="/"> Events </NavLink>
        <NavLink to="/"> Side Quest </NavLink>
        <NavLink to="/"> About </NavLink>
        <NavLink to="/"> Idea </NavLink>
      </div>
      <div className="navbar-buttons">
        {!isLoggedIn ? 
          <>
            <button className="btn-primary" onClick={handleLogInClick}> Log In </button>
            <button className="btn-primary" onClick={handleSignUpClick}> Sign Up </button> 
          </>
         :
          <>
          <NavLink className="user-icon" to={getNavLink()}>
           <i className="fa-solid fa-circle-user"></i>
          </NavLink>
          <button className="btn-primary" onClick={handleLogOutClick}> Log out </button>
          </>
        }
      </div>
    </div>
  )
}

export default Navbar
