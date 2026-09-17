import React, { useContext, useEffect, useState } from 'react'
import { NavLink, useNavigate, useParams } from 'react-router-dom'
import authService from '../services/index.services'
import { AuthContext } from '../context/auth.context'

function EventDetailsPage() {
    const { eventId } = useParams()
    const navigate = useNavigate()
    const [ eventData, setEventData ] = useState(null)
    const { userRole } =  useContext(AuthContext) 
    const [ eventTasks, setEventTasks ] = useState([])
    const [ taskUpdateError, setTaskUpdateError ] = useState("")

    const getEventData = async () => {
        const response = await authService.get(`/events/${eventId}`)
        setEventData(response.data)
    }

    const getTasksData = async() => {
      const resposne = await authService.get(`/events/${eventId}/tasks`)
      setEventTasks(resposne.data)
    }

    const handleDeleteEvent = async() => {
      try{
        const response = await authService.delete(`/events/${eventId}`)
        navigate("/events")
      } catch(error) {
        console.log(error)
      }
    }

    const handleTaskToggle = async (task) => {
      const previousStatus = task.status
      const nextStatus = previousStatus === "completed" ? "not started" : "completed"

      setTaskUpdateError("")
      setEventTasks((previousTasks) =>
        previousTasks.map((currentTask) =>
          currentTask._id === task._id
            ? { ...currentTask, status: nextStatus }
            : currentTask
        )
      )

      try {
        await authService.patch(`/tasks/${task._id}`, {
          status: nextStatus
        })
      } catch(error) {
        console.error("Could not update task", error)
        setTaskUpdateError("Could not update the task. Please try again.")
        setEventTasks((previousTasks) =>
          previousTasks.map((currentTask) =>
            currentTask._id === task._id
              ? { ...currentTask, status: previousStatus }
              : currentTask
          )
        )
      }
    }
    
    // get the event by Id. 
    useEffect(() => {
        getEventData()
        getTasksData()
    }, [eventId])
    // Show event details

    const getDate = () => {
      if (!eventData?.date) return ""

      return new Date(eventData.date).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric"
      })
    }

      const getTime = () => {
      if (!eventData?.date) return ""

      return new Date(eventData.date).toLocaleTimeString("en-GB", {
        timeZone: "Europe/Berlin",
        hour:"2-digit",
        minute:"2-digit",
        hour12: false
      })
    }

  return (
    <div>
      <div className='page-container'>
      <div className='list-page-header'>
      <div className="page-header-caption">
        <hr className="primary"/>
        <p> The Experience </p>
        <hr className="primary"/>
      </div>
        <h1 > {eventData?.title} </h1>
        <p className='caption'> Come for the plan. Stay for whatever happens next. </p>
      </div>
    </div>
     { userRole === "admin" && 
      <div className='event-details-header'>
        <div className='badge'>
          <i className="fa-regular fa-calendar"></i>
          <p > Status: {eventData?.status}</p>
        </div>
        <div className='buttons'>
          <NavLink className='btn-secondary' to={`/events/edit/${eventId}`}> Add a Task </NavLink>
          <NavLink className='btn-primary' to={`/events/edit/${eventId}`}> Edit Event </NavLink>
          <button className='btn-primary' onClick={handleDeleteEvent}> Delete Event </button>
        </div>
      </div>
      }

      <div className='event-details-content'>
        <div className='event-content-header'>
          {eventData?.imageUrl && 
          <div className='event-details-image'>
            <img src={eventData.imageUrl} />
          </div> }
            <div className='event-content-desc'>
              <p className='subtitle'> {eventData?.format}</p>
              <div className='event-desc'>
                <h2> Description: </h2>
                <p> {eventData?.description} </p>
                <NavLink className="btn-secondary" to={`${eventData?.ticketUrl}`}> Get Ticket </NavLink>
              </div>
              <hr className='default'/>
              <div className='event-detail-group'>
                <div className='event-group-item'>
                  <p className='event-item-title'> Date & Time </p>
                  <h3> {getDate()} </h3>
                  <p className='event-item-caption'> {getTime()} CET </p>
                </div>
                <div className='event-group-item'>
                  <p className='event-item-title'> Location</p>
                  <h3> {eventData?.location} </h3>
                  <p className='event-item-caption'> Berlin </p>
                </div>
                <div className='event-group-item'>
                  <p className='event-item-title'> Capacity</p>
                  <h3> 12 - 15 Guests </h3>
                  <p className='event-item-caption'> Limited Capacity </p>
                </div>
              </div>
            </div>
        </div>
          {/* ADMIN PANEL */}
          {userRole === "admin" && 
            <section className='event-tasks-section'>
              <hr className='default'/>
              <div className='event-tasks-header'>
                <div  className='tasks-header-left' >
                  <p> Tasks Pending </p>
                  <h2> Event Admin Tasks </h2>
                  <p> progress </p>
                </div>
                <div  className='tasks-header-right' >
                  <NavLink className='btn-primary' to={`/tasks/${eventData?._id}`}>  Create a Task </NavLink>
                </div>
              </div>
              {taskUpdateError && <p className='error-message'>{taskUpdateError}</p>}
              <div className='event-tasks-list'>
                {eventTasks.map((task) => {
                  return <div className='event-task-item' key={task._id}>
                    <input type='checkbox' id={`task-${task._id}`} checked={task.status === "completed"} onChange={() => handleTaskToggle(task)}/>
                    <div className='event-task-content'>
                      <label htmlFor={`task-${task._id}`}>{task.title}</label>
                      <p>{task.description}</p>
                    </div>
                    <span className='event-task-status'>{task.status}</span>
                  </div>
                })}
                </div>
            </section>
          }
      </div>

    </div>
  )
}

export default EventDetailsPage
