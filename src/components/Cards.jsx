import { useContext, useEffect, useState } from 'react'
import Card from './Card'
import { NavLink } from 'react-router-dom'
import authService from '../services/index.services'
import { EVENT_FORMATS, EVENT_STATUSES } from '../constants/eventOptions'
import { AuthContext } from '../context/auth.context'
import LoadingSpinner from './LoadingSpinner'

function Cards({variant}) {
  const [ allEvents, setAllEvents ] = useState(null)
  const [ searchTerm, setSearchTerm ] = useState("")
  const [ selectedFormat, setSelectedFormat ] = useState("")
  const [ selectedStatus, setSelectedStatus ] = useState("")
  const [ errorMessage, setErrorMessage ] = useState("")
  const { userRole } = useContext(AuthContext)

  const getAllEvents = async() => {
    try {
      const response = await authService.get("/events")
      setAllEvents(response.data)
    } catch(error) {
      setErrorMessage("Unable to load events. Please try again.")
    }
  }
  
  useEffect(() => {
    getAllEvents()
  }, [])

  const filteredEvents = allEvents?.filter((event) => {
    const normalizedSearchTerm = searchTerm.toLowerCase().trim()
    const searchableText = `${event.title || ""} ${event.description || ""} ${event.location || ""}`.toLowerCase()
    const matchesSearch = !normalizedSearchTerm || searchableText.includes(normalizedSearchTerm)
    const matchesFormat = !selectedFormat || event.format === selectedFormat
    const matchesStatus = !selectedStatus || event.status === selectedStatus

    return matchesSearch && matchesFormat && matchesStatus
  })

  return (
    <div className="events-browser">
      {variant === "list" && (
        <div className="event-filters">
          <input
            type="search"
            aria-label="Search events"
            placeholder="Search events"
            value={searchTerm}
            onChange={(event) => setSearchTerm(event.target.value)}
          />
          <select
            aria-label="Filter by format"
            value={selectedFormat}
            onChange={(event) => setSelectedFormat(event.target.value)}
          >
            <option value="">All formats</option>
            {EVENT_FORMATS.map((format) => (
              <option key={format.value} value={format.value}>{format.label}</option>
            ))}
          </select>
          {userRole === "admin" && (
            <select
              aria-label="Filter by status"
              value={selectedStatus}
              onChange={(event) => setSelectedStatus(event.target.value)}
            >
              <option value="">All statuses</option>
              {EVENT_STATUSES.map((status) => (
                <option key={status.value} value={status.value}>{status.label}</option>
              ))}
            </select>
          )}
        </div>
      )}

      {errorMessage && <p className="error-message">{errorMessage}</p>}
      {!errorMessage && allEvents === null && <LoadingSpinner label="Loading events" />}
      {variant === "list" && filteredEvents?.length === 0 && (
        <p className="event-filters-empty">No events match your filters.</p>
      )}
      <div className={variant === "list" ? 'cards-list-container' : 'cards-container' }>
      {filteredEvents?.map((event) => {
        return (<NavLink key={event._id} className="cards-container-card" to={`/events/${event._id}`}>
                    <Card title={event.title} format={event.format}/>
          </NavLink>)
      })
      }
      </div>
    </div>
  )
}

export default Cards
