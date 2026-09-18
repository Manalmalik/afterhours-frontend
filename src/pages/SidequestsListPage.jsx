import { useEffect, useState } from 'react'
import { NavLink } from 'react-router-dom'
import authService from '../services/index.services'

function SidequestsListPage() {
  const [sideQuests, setSideQuests] = useState([])
  const [errorMessage, setErrorMessage] = useState("")

  useEffect(() => {
    const loadSideQuests = async () => {
      try {
        const response = await authService.get("/sidequests")
        setSideQuests(response.data)
      } catch (error) {
        setErrorMessage("Unable to load side quests. Please try again.")
      }
    }

    loadSideQuests()
  }, [])

  return (
    <div className="page-container">
      <div className="list-page-header">
        <div className="page-header-caption">
          <hr className="primary" />
          <p>The Playground</p>
          <hr className="primary" />
        </div>
        <h1>Side Quests</h1>
        <p className="caption">Small adventures, whenever you need one.</p>
      </div>
      {errorMessage && <p className="error-message">{errorMessage}</p>}

      <section className="cards-list-container">
        {sideQuests.map((sideQuest) => (
          <NavLink className="card-container" key={sideQuest._id} to={`/sidequests/${sideQuest._id}`}>
            {sideQuest.imageUrl && <img src={sideQuest.imageUrl} alt="" width="100" />}
            <div>
              <h3>{sideQuest.title}</h3>
              <p>{sideQuest.description}</p>
            </div>
          </NavLink>
        ))}
      </section>
    </div>
  )
}

export default SidequestsListPage
