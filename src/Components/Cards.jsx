import React, { useEffect, useState } from 'react'
import Card from './Card'
import axios, { all } from 'axios'
import { NavLink } from 'react-router-dom'

function Cards({variant}) {
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
    <div className={variant === "list" ? 'cards-list-container' : 'cards-container' }>
      {allEvents?.map((event) => {
        return (<NavLink key={event._id} className="cards-container-card" to={`/events/${event._id}`}>
                    <Card title={event.title} format={event.format}/>
          </NavLink>)
      })
      }
    </div>
  )
}

export default Cards
