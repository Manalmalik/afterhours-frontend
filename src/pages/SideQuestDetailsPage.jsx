import { useContext, useEffect, useState } from 'react'
import { NavLink, useNavigate, useParams } from 'react-router-dom'
import authService from '../services/index.services'
import { AuthContext } from '../context/auth.context'
import LoadingSpinner from '../components/LoadingSpinner'

function SideQuestDetailsPage() {
  const { sideQuestId } = useParams()
  const { userRole } = useContext(AuthContext)
  const [sideQuest, setSideQuest] = useState(null)
  const [tasks, setTasks] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [errorMessage, setErrorMessage] = useState("")
  const [taskUpdateError, setTaskUpdateError] = useState("")
  const navigate = useNavigate()
  const { isLoggedIn } = useContext(AuthContext)

  useEffect(() => {
    const loadSideQuest = async () => {
      try {
        const [sideQuestResponse, tasksResponse] = await Promise.all([
          authService.get(`/sidequests/${sideQuestId}`),
          authService.get(`/sidequests/${sideQuestId}/tasks`)
        ])

        setSideQuest(sideQuestResponse.data)
        setTasks(tasksResponse.data)
      } catch (error) {
        setErrorMessage(
          error.response?.data?.errorMessage || "Unable to load this side quest. Please try again."
        )
      } finally {
        setIsLoading(false)
      }
    }

    loadSideQuest()
  }, [sideQuestId])

  const handleTaskToggle = async (task) => {
    const previousStatus = task.status || "not started"
    const nextStatus = previousStatus === "completed" ? "not started" : "completed"

    setTaskUpdateError("")
    setTasks((previousTasks) => previousTasks.map((currentTask) => (
      currentTask._id === task._id
        ? { ...currentTask, status: nextStatus }
        : currentTask
    )))

    try {
      await authService.patch(`/tasks/${task._id}`, { status: nextStatus })
    } catch (error) {
      setTaskUpdateError("Could not update the task. Please try again.")
      setTasks((previousTasks) => previousTasks.map((currentTask) => (
        currentTask._id === task._id
          ? { ...currentTask, status: previousStatus }
          : currentTask
      )))
    }
  }

  const getProgressPercentage = () => {
    if (!tasks.length) return 0

    const completedTasks = tasks.filter((task) => task.status === "completed").length
    return Math.round((completedTasks / tasks.length) * 100)
  }

  const getProgress = () => {
    const completedTasks = tasks.filter((task) => task.status === "completed").length
    return `${completedTasks} of ${tasks.length} tasks completed`
  }

  const handleDeleteClick = async() => {
      try{
        const response = await authService.delete(`/sidequests/${sideQuestId}`)
        navigate("/sidequests")
      } catch(error) {
        console.log(error)
      }
    }

  if (isLoading) return <LoadingSpinner label="Loading side quest" />

  if (errorMessage) {
    return <p className="error-message side-quest-details-message">{errorMessage}</p>
  }

  return (
    <div className="side-quest-details-page">
      <header className="side-quest-details-hero">
        <div className="page-header-caption">
          <hr className="primary" />
          <p>Side quest</p>
          <hr className="primary" />
        </div>
        <h1>{sideQuest.title}</h1>
        <p className="caption">A small adventure, made one step at a time.</p>
      </header>

      <div className="side-quest-details-actions">
        <span className="badge">{sideQuest.status}</span>
        {userRole === "admin" && (
            <div className='buttons'>
            <NavLink className="btn-primary" to={`/sidequests/edit/${sideQuestId}`}>
                Edit side quest
            </NavLink>
            <button className="btn-primary" onClick={handleDeleteClick}>
                delete side quest
            </button>
          </div>
        )}
      </div>

      <main className="side-quest-details-content">
        <section className="side-quest-details-overview">
          {sideQuest.imageUrl && (
            <div className="side-quest-details-image">
              <img src={sideQuest.imageUrl} alt={sideQuest.title} />
            </div>
          )}
          <div className="side-quest-details-description">
            <p className="subtitle">The challenge</p>
            <h2>About this side quest</h2>
            <p>{sideQuest.description}</p>
          </div>
        </section>

        <section className="side-quest-details-tasks">
          <div className="side-quest-details-tasks-header">
            <div>
              <p className="subtitle">Your progress</p>
              <h2>Complete the stops</h2>
              <p>{getProgress()}</p>
            </div>
            <div className="side-quest-details-progress">
              <div className="task-progress-track">
                <div className="task-progress-bar" style={{ width: `${getProgressPercentage()}%` }} />
              </div>
              <span>{getProgressPercentage()}%</span>
            </div>
          </div>

          {taskUpdateError && <p className="error-message">{taskUpdateError}</p>}
         
          <div className="event-tasks-list">
            {tasks.length === 0 && <p className="side-quest-details-empty">No tasks have been added yet.</p>}
            {tasks.map((task) => (
              <div className="event-task-item" key={task._id}>
                <input
                  type="checkbox"
                  id={`side-quest-task-${task._id}`}
                  checked={task.status === "completed"}
                  disabled={userRole !== "admin"}
                  onChange={() => handleTaskToggle(task)}
                />
                <div className="event-task-content">
                  <label htmlFor={`side-quest-task-${task._id}`}>{task.title}</label>
                  <p>{task.description}</p>
                </div>
                {task.estimatedDuration && (
                  <span className="event-task-status">{task.estimatedDuration} min</span>
                )}
              </div>
            ))}
          </div>
        </section>
      </main>
    </div>
  )
}

export default SideQuestDetailsPage

