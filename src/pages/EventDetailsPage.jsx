import React, { useContext, useEffect, useState } from 'react'
import { NavLink, useNavigate, useParams } from 'react-router-dom'
import authService from '../services/index.services'
import { AuthContext } from '../context/auth.context'

function EventDetailsPage() {
    const { eventId } = useParams()
    const navigate = useNavigate()
    const [ eventData, setEventData ] = useState(null)
    const { userRole } =  useContext(AuthContext) 

    const getEventData = async () => {
        const response = await authService.get(`/events/${eventId}`)
        setEventData(response.data)
    }

    const handleDeleteEvent = async() => {
      try{
        const response = await authService.delete(`/events/${eventId}`)
        navigate("/events")
      } catch(error) {
        console.log(error)
      }
    }
    
    // get the event by Id. 
    useEffect(() => {
        getEventData()
    }, [eventId])
    // Show event details

  return (
    <div>
      <h1> {eventData?.title} </h1>
     { userRole === "admin" && <div className='buttons'>
        <NavLink className='btn-primary' to={`/events/edit/${eventId}`}> Edit Event </NavLink>
        <button className='btn-primary' onClick={handleDeleteEvent}> Delete Event </button>
      </div>
      }
    </div>
  )
}

export default EventDetailsPage
