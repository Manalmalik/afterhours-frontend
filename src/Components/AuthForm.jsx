import axios from 'axios'
import React, { useContext, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { AuthContext } from '../context/auth.context'

function AuthForm() {
    const {setIsLoggedIn, setLoggedUserId, setUserRole } = useContext(AuthContext)
    const location = useLocation()
    const navigate = useNavigate()
    const [ username, setUsername ] = useState("")
    const [ email, setEmail ] = useState("")
    const [ password, setPassword ]  = useState("")
    const [ errorMessage, setErrorMessage ] = useState("")

    const isSignUpForm = location.pathname === "/signup"

    const handleInputChange = (e) => {
        if(e.target.name === "username") {
            setUsername(e.target.value)
            return
        }

        if(e.target.name === "email") {
            setEmail(e.target.value)
            return
        }

        if(e.target.name === "password") {
            setPassword(e.target.value)
            return
        }
    }

    const handleSignUp = async() => {
        const body = {
            username,
            email,
            password,
        }

        try {

            await axios.post(`${import.meta.env.VITE_SERVER_URL}/api/auth/signup`, body)
            navigate("/login")

        }catch(error) {

            if(error.response.status === 400) {
                setErrorMessage(error.response.data.errorMessage)
            }else {
                console.log("error")
            }
        }
    }

    const handleLogin = async() => {
        const body = {
            email,
            password,
        }

        try{
            const response = await axios.post(`${import.meta.env.VITE_SERVER_URL}/api/auth/login`, body)
            localStorage.setItem("authToken", response.data.authToken )

            //update auth states
            setIsLoggedIn(true)
            setLoggedUserId(response.data.payload._id)
            setUserRole(response.data.payload.role)

            if(response.data.payload.role === "admin") {
                navigate("/dasboard")
            } else if (response.data.payload.role === "user") {
                navigate("/account")
            }else {
                navigate('/')
            }

        } catch(error) {
            if(error.response.status === 400) {
                setErrorMessage(error.response.data.errorMessage)
            }else {
                console.log("error")
            }
        }

    }

    const handleFormSubmit = (e) => {
        e.preventDefault(e)
        isSignUpForm ? handleSignUp() : handleLogin()
    }

  return (
    <div className='auth-form'>
      <form onSubmit={handleFormSubmit}>
         {isSignUpForm &&
        <div className='form-field'>
            <label> Name: </label>
            <input required type='text' name='username' placeholder='Enter your username' value={username} onChange={handleInputChange}/>
        </div> }
        <div className='form-field'>
            <label> Email: </label>
            <input required type='text' name='email' placeholder='Enter your email' value={email} onChange={handleInputChange}/> 
        </div>
        <div className='form-field'>
            <label> Password: </label>
            <input required type='text' name='password' placeholder='Enter your password' value={password} onChange={handleInputChange}/>
        </div>
        {errorMessage && <div> {errorMessage} </div>}
        {isSignUpForm ?
            <button className='btn-secondary' type='submit'> Create Account </button>
            :
             <button className='btn-secondary' type='submit'> Login </button>
        }
       
      </form>
    </div>
  )
}

export default AuthForm
