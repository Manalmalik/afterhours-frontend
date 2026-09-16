import React, { useEffect, useState } from 'react'
import Card from './Card'
import axios, { all } from 'axios'
import { NavLink } from 'react-router-dom'

function Cards() {
  const [ allEvents, setAllEvents ] = useState(null)

  const getAllEvents = async() => {
    try {
      const response = await axios(`${import.meta.env.VITE_SERVER_URL}/api/events`)
      setAllEvents(response.data)
    } catch(error) {
      console.log(erro)
    }
  }

  useEffect(() => {
    getAllEvents()
  }, [])

  return (
    <div className='cards-container'>
      {allEvents?.map((event) => {
        return (<NavLink className="cards-container-card" to={`/events/${event._id}`}>
                    <Card key={event._id} title={event.title} format={event.format}/>
          </NavLink>)
      })
      }
    </div>
  )
}

export default Cards
