import React, { useState } from 'react'
import { EVENT_FORMATS, EVENT_STATUSES } from '../constants/eventOptions'
import authService from '../services/index.services'
import { useNavigate } from 'react-router-dom'

function AddEventForm() {
    const navigate = useNavigate()
    const [ event, setEvent ] = useState({
        title: "",
        description: "",
        date: "",
        time:"",
        location: "",
        format: "",
        imageUrl: "",
        ticketUrl: "",
        status: ""
    })

    const handleInputChange = (e) => {
        const { name, value } = e.target
        setEvent((prevEvent) => ({
            ...prevEvent, 
            [name]: value
        }))
    }

    const getEventDate = () => {
        const dateTime = new Date(`${event.date}T${event.time}`)
        return dateTime.toISOString()
    }

    const handleFormSubmit = async (e) => {
        e.preventDefault()
        const response = await authService.post("/events", {
            title: event.title,
            description: event.description,
            format: event.format,
            location: event.location,
            date: getEventDate(),
            imageUrl: event.imageUrl,
            ticketUrl: event.ticketUrl,
            status: event.status,
        })
        console.log(response)
        navigate(`/events/${response.data.eventId}`)
    }

  return (
    <div className='form-container' onSubmit={handleFormSubmit}>
      <form>
        <div>
            <label htmlFor='title'> Event Title * </label>
            <input id='title' name='title' value={event.title} maxLength={100} required onChange={handleInputChange}/>
        </div>
        <div>
            <label htmlFor='description'> Description </label>
          <textarea id='description' name='description' value={event.description} onChange={handleInputChange}/>
        </div>
        <div>
          <label htmlFor='date'> Date * </label>
          <input id='date' type='date' name='date' value={event.date} required onChange={handleInputChange}/>
        </div>
        <div>
          <label htmlFor='time'> Time * </label>
          <input id='time' type='time' name='time' value={event.time} required onChange={handleInputChange}/>
        </div>
        <div>
          <label htmlFor='location'> Location * </label>
          <input id='location' name='location' value={event.location} required onChange={handleInputChange}/>
        </div>
        <div>
          <label htmlFor='format'> Format * </label>
          <select id='format' name='format' value={event.format} required onChange={handleInputChange}>
            {EVENT_FORMATS.map((format, index) => {
                return <option key={index} value={format.value}> {format.label} </option>
            })}
          </select>
        </div>
        <div>
          <label htmlFor='imageUrl'> Image URL </label>
          <input id='imageUrl' type='url' name='imageUrl' value={event.imageUrl} onChange={handleInputChange}/>
        </div>
        <div>
          <label htmlFor='ticketUrl'> Ticket URL </label>
          <input id='ticketUrl' type='url' name='ticketUrl' value={event.ticketUrl} onChange={handleInputChange}/>
        </div>
        <div>
          <label htmlFor='status'> Status </label>
          <select id='status' name='status' value={event.status} onChange={handleInputChange}>
            {EVENT_STATUSES.map((status, index) => {
                return <option key={index} value={status.value}> {status.label} </option>
            })}
          </select>
        </div>
        <button className='btn-secondary' type='submit'>Create Event</button>
      </form>
    </div>
  )
}

export default AddEventForm
