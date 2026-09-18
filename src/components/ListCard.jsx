import React, { useEffect, useState } from 'react'
import { NavLink } from 'react-router-dom'
import authService from '../services/index.services'

function ListCard({variant}) {
  const [ upcomingEvents, setUpcomingEvents ] = useState(null)
  const [ sideQuests, setSideQuests ] = useState(null)



      const fetchUpcomingEvents = async () => {
        try{
          const response = await authService.get("/events/upcoming-events")
          setUpcomingEvents(response.data)
        } catch(error) {
          console.log(error)
        }
      }

      const fetchSideQuests = async () => {
        try{
          const response = await authService.get("/sidequests")
          setSideQuests(response.data)
        } catch(error) {
          console.log(error)
        }
      }

        useEffect(() => {
          fetchUpcomingEvents()
          if(variant === "sidequests"){
            fetchSideQuests()
          } 
        }, [])
      
        console.log(variant)

  return (
  <div className="list-card-container">
      <div className="list-container-info">
      <div className="list-container-header"> 
        {variant === "events" && 
        <>
          <p> Upcoming events </p>
          <NavLink to='/events'> See all events</NavLink>
        </>
        } 
        {variant === "sidequests" && 
        <>
          <p> Upcoming sid quests </p>
          <NavLink to='/events'> See all side quests</NavLink>
        </>
        } 
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
         {variant === "sidequests" && sideQuests?.map((sideQuest, index) => {
          return <div  className="list-container-items" key={index}>
            <div className="list-container-date-item">
              <h1> 15 </h1>
              <p className="item-text"> sep </p>
            </div>
            <div className="list-container-item">
              <span className='badge'> {sideQuest.status} </span>
              <p className="item-text"> {sideQuest.title} </p>
              <p className="caption"> {sideQuest.format}</p>
            </div>
            <NavLink to={`/sidequests/${sideQuest._id}`}> Manage Side Quest </NavLink>
          </div>
        })}
      </div>
    </div>
  </div>

  )
}

export default ListCard
