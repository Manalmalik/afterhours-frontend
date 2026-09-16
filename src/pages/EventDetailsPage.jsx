import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import authService from '../services/index.services'
import AddEventForm from '../components/AddEventForm'

function EventDetailsPage() {
    const { eventId } = useParams()
    const [ eventData, setEventData ] = useState(null)

    const getEventData = async () => {
        const response = await authService.get(`/events/${eventId}`)
        setEventData(response.data)
    }
    
    // get the event by Id. 
    useEffect(() => {
        getEventData()
    }, [eventId])
    // Show event details

  return (
    <div>
      <h1> {eventData?.title} </h1>
    </div>
  )
}

export default EventDetailsPage
