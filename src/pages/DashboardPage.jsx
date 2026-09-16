import { NavLink } from "react-router-dom"
import AddEventForm from "../components/AddEventForm"
import Sidebar from "../components/Sidebar"
import InfoCard from "../components/InfoCard"
import { useEffect, useState } from "react"
import authService from "../services/index.services"

function DashboardPage() {
  const [ evensCount, setEventsCount ] = useState()
  const [ upcomingEvents, setUpcomingEvents ] = useState(null)

  const fetchEventsCount = async () => {
    try{
      const response = await authService.get("/events/count")
      setEventsCount(response.data)
    } catch(error) {
      console.log(error)
    }
  } 

  const fetchUpcomingEvents = async () => {
    try{
      const response = await authService.get("/events/upcoming-events")
      setUpcomingEvents(response.data)
    } catch(error) {
      console.log(error)
    }
  }


  useEffect(() => {
    fetchEventsCount()
    fetchUpcomingEvents()
  }, [])

  return (
    <div className="page-container">
      <section className="dashboard-header">
        <div>
          <div className="page-header-caption">
            <hr className="primary"/>
            <p> Welcome Manal </p>
            <hr className="primary"/>
          </div>
          <div className="dashboard-header-hero">
              <h1> admin </h1>
              <p> Dashboard </p>
              <hr className="secondary"/>
          </div>
          <p className="caption"> A clear view of your club. </p>
        </div>
          <div className="buttons">
            <NavLink className="btn-secondary" to="/events/create"> Create a Side Quest </NavLink>
            <NavLink className="btn-secondary" to="/events/create"> Create an event </NavLink>
          </div>  
      </section>
        <section className="dashboard-container">
          <div className="infocards-container">
            <InfoCard title={evensCount} caption="total events" info="since June 2026"/>
            <InfoCard title="10" caption="total side quests" info="since June 2026" variant={true} />
            <InfoCard title="80" caption="people attended" info="for all events" variant={true} />
            <InfoCard title="200" caption="total revenue" info="in euros" variant={true} />
          </div>
          <div className="events-container">
            <div className="events-container-info">
              <div className="events-container-header"> 
                <p> Active Side Quests </p>
                <NavLink to='/events'> See all Side Quests</NavLink>
              </div>
            </div>
             <div className="events-container-info">
              <div className="events-container-header"> 
                <p> Upcoming events </p>
                <NavLink to='/events'> See all events</NavLink>
              </div>
              {upcomingEvents?.map((event, index) => {
                return <div  className="events-container-items" key={index}>
                  <div className="events-container-item">
                    <h1> 15 </h1>
                    <p className="item-text"> September </p>
                  </div>
                  <div className="events-container-item">
                  <p className="item-text"> {event.title} </p>
                  <p className="caption"> {event.format}</p>
                  </div>
                  <p className="item-text"> {event.status} </p>
                </div>
              })}
            </div>
          </div>
        </section>
    </div>
  )
}

export default DashboardPage
