import { NavLink } from "react-router-dom"

const Navbar = () => {
  return (
    <div className="navbar-container">
      <img src="src/assets/images/logo.png"/>
      <div className="navbar-links">
        <NavLink to="/"> Events </NavLink>
        <NavLink to="/"> Side Quest </NavLink>
        <NavLink to="/"> About </NavLink>
        <NavLink to="/"> Idea </NavLink>
      </div>
      <div className="navbar-buttons">
        <button className="btn-primary"> Sign In </button>
        <button className="btn-primary"> Admin </button>
      </div>
    </div>
  )
}

export default Navbar
