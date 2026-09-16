import { Route, Routes } from 'react-router-dom'
import './App.css'
import Navbar from './components/Navbar'
import HomePage from './pages/HomePage'
import SignUpPage from './pages/SignUpPage'
import LoginPage from './pages/LoginPage'
import DashboardPage from './pages/DashboardPage'
import AccountPage from './pages/AccountPage'
import PrivateWrapper from './components/PrivateWrapper'
import EventDetailsPage from './pages/EventDetailsPage'

function App() {

  return (
    <div className='app'>
      <Navbar/>
      <Routes>
        <Route path='/' element={<HomePage/>}/>
        <Route path='/signup' element={<SignUpPage/>} />
        <Route path='/login' element={<LoginPage/>} />
        <Route path='/dashboard' element={<PrivateWrapper><DashboardPage/></PrivateWrapper>} />
        <Route path='/account' element={<PrivateWrapper><AccountPage/></PrivateWrapper>} />
        <Route path='/events/:eventId' element={<EventDetailsPage/>} />
      </Routes>
    </div>
  )
}

export default App
