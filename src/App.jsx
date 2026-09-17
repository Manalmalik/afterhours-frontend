import { Route, Routes } from 'react-router-dom'
import './App.css'
import Navbar from 'src/components/Navbar.jsx'
import HomePage from './pages/HomePage'
import SignUpPage from './pages/SignUpPage'
import LoginPage from './pages/LoginPage'
import DashboardPage from './pages/DashboardPage'
import AccountPage from './pages/AccountPage'
import PrivateWrapper from 'src/components/PrivateWrapper.jsx'
import EventDetailsPage from './pages/EventDetailsPage'
import CreateEventPage from './pages/CreateEventPage'
import EditEventPage from './pages/EditEventPage'
import EventsListPage from './pages/EventsListPage'

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
        <Route path='/events' element={<EventsListPage/>} />
        <Route path='/events/:eventId' element={<EventDetailsPage/>} />
        <Route path='/events/create' element={<CreateEventPage/>} />
        <Route path='/events/edit/:eventId' element={<EditEventPage/>} />
      </Routes>
    </div>
  )
}

export default App
