import React, { useEffect, useState } from 'react'
import { NavLink } from 'react-router-dom'
import authService from '../services/index.services'

function ListCard({variant}) {
  const [ upcomingEvents, setUpcomingEvents ] = useState(null)


      const fetchUpcomingEvents = async () => {
        try{
          const response = await authService.get("/events/upcoming-events")
          setUpcomingEvents(response.data)
        } catch(error) {
          console.log(error)
        }
      }

        useEffect(() => {
          fetchUpcomingEvents()
        }, [])
      
        console.log(variant)

  return (
  <div className="list-card-container">
      <div className="list-container-info">
      <div className="list-container-header"> 
        <p> Upcoming events </p>
        <NavLink to='/events'> See all events</NavLink>
      </div>
      <hr className='default'/>
      <div className='list-card-list'>
        {variant === "events" && upcomingEvents?.map((event, index) => {
          return <div  className="list-container-items" key={index}>
            <div className="list-container-date-item">
              <h1> 15 </h1>
              <p className="item-text"> sep </p>
            </div>
            <div className="list-container-item">
              <span className='badge'> {event.status} </span>
              <p className="item-text"> {event.title} </p>
              <p className="caption"> {event.format}</p>
            </div>
            <NavLink to={`/events/${event._id}`}> Manage Event </NavLink>
          </div>
        })}
      </div>
    </div>
  </div>

  )
}

export default ListCard
