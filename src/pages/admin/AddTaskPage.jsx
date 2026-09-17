import { useState } from "react"
import { useNavigate, useParams } from "react-router-dom"
import authService from "../../services/index.services"

const TASK_STATUSES = [
  "not started",
  "started",
  "in progress",
  "completed"
]

function AddTaskPage() {
  const { eventId } = useParams()
  const navigate = useNavigate()
  const [task, setTask] = useState({
    title: "",
    description: "",
    status: "not started"
  })
  const [errorMessage, setErrorMessage] = useState("")

  const handleInputChange = (event) => {
    const { name, value } = event.target

    setTask((previousTask) => ({
      ...previousTask,
      [name]: value
    }))
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    setErrorMessage("")

    try {
      await authService.post(`/events/${eventId}/tasks`, task)
      navigate(`/events/${eventId}`)
    } catch (error) {
      setErrorMessage(
        error.response?.data?.errorMessage || "Unable to create task. Please try again."
      )
    }
  }

  return (
    <div className="page-container">
      <div className="page-header">
        <div className="page-header-caption">
          <hr className="primary" />
          <p>Event administration</p>
          <hr className="primary" />
        </div>
        <h1 className="page-header-hero">Create a task</h1>
      </div>

      <div className="form-container">
        <form onSubmit={handleSubmit}>
          <div>
            <label htmlFor="task-title">Task title *</label>
            <input
              id="task-title"
              name="title"
              value={task.title}
              maxLength={150}
              required
              onChange={handleInputChange}
            />
          </div>

          <div>
            <label htmlFor="task-description">Description</label>
            <textarea
              id="task-description"
              name="description"
              value={task.description}
              onChange={handleInputChange}
            />
          </div>

          <div>
            <label htmlFor="task-status">Status</label>
            <select
              id="task-status"
              name="status"
              value={task.status}
              onChange={handleInputChange}
            >
              {TASK_STATUSES.map((status) => (
                <option key={status} value={status}>
                  {status}
                </option>
              ))}
            </select>
          </div>

          {errorMessage && <p className="error-message">{errorMessage}</p>}

          <button className="btn-secondary" type="submit">
            Create Task
          </button>
        </form>
      </div>
    </div>
  )
}

export default AddTaskPage
