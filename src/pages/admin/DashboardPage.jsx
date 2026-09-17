import { NavLink } from "react-router-dom"
import InfoCard from "../../components/InfoCard"
import { useEffect, useState } from "react"
import authService from "../../services/index.services"
import ListCard from "../../components/ListCard"

function DashboardPage() {
  const [ evensCount, setEventsCount ] = useState()

  const fetchEventsCount = async () => {
    try{
      const response = await authService.get("/events/count")
      setEventsCount(response.data)
    } catch(error) {
      console.log(error)
    }
  } 



  useEffect(() => {
    fetchEventsCount()
  }, [])

  return (
    <div className="page-container">
      <section className="dashboard-header">
        <div className="dashboard-header-container">
          <div className="page-header-caption">
            <hr className="primary"/>
            <p> Welcome, Manal </p>
            <hr className="primary"/>
          </div>
          <div className="dashboard-header-hero">
              <h1> admin dashboard</h1>
              <hr className="secondary"/>
          </div>
          <p className="caption"> A clear view of your club. </p>
        </div>
          <div className="buttons">
            <NavLink className="btn-secondary" to="/events/create"> Create a Side Quest </NavLink>
            <NavLink className="btn-secondary" to="/events/create"> Create an event </NavLink>
          </div>  
      </section>
          <div className="header-caption">
            <span className="first-child">
             <i className="fa-solid fa-circle"></i>
              <p> Club season: </p>
              <p className="caption-bold"> Autumn / Winter 2026 </p>
            </span>
            <span className="first-child">
              <p> Active City: </p>
              <p className="caption-bold">  Berlin</p>
            </span>
          </div>
        <section className="dashboard-container">
          <div className="infocards-container">
            <InfoCard title={evensCount} caption="total events" info="across all seasons" variant={true}/>
            <InfoCard title="10" caption="upcoming events" info="scheduled for next 30 days" variant={true} />
            <InfoCard title="80" caption="live side quests" info="active self paced quests" variant={true} />
            <InfoCard title="10" caption="open event tasks" info="tasks needing completion" variant={true} />
          </div>
          <div className="dashboard-bottom-section">
            <div className="events-container-info">
              <div className="events-container-header"> 
                <p> Active Side Quests </p>
                <NavLink to='/events'> See all Side Quests</NavLink>
              </div>
            </div>
            <ListCard variant="events"/>

          </div>
        </section>
    </div>
  )
}

export default DashboardPage
