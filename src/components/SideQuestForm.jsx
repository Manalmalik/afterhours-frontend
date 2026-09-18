import { useEffect, useState } from "react"
import { useNavigate, useParams } from "react-router-dom"
import authService from "../services/index.services"
import ImageUpload from "./ImageUpload"

const SIDE_QUEST_STATUSES = [
  { value: "draft", label: "Draft" },
  { value: "live", label: "Live" },
  { value: "archived", label: "Archived" }
]

const EMPTY_SIDE_QUEST = {
  title: "",
  description: "",
  imageUrl: "",
  status: "draft"
}

const createEmptyTask = () => ({
  title: "",
  description: "",
  estimatedDuration: ""
})

function SideQuestForm() {
  const { sideQuestId } = useParams()
  const navigate = useNavigate()
  const [sideQuest, setSideQuest] = useState(EMPTY_SIDE_QUEST)
  const [tasks, setTasks] = useState([])
  const [taskDraft, setTaskDraft] = useState(createEmptyTask())
  const [isLoading, setIsLoading] = useState(Boolean(sideQuestId))
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [errorMessage, setErrorMessage] = useState("")
  const [taskErrorMessage, setTaskErrorMessage] = useState("")

  useEffect(() => {
    if (!sideQuestId) {
      setSideQuest(EMPTY_SIDE_QUEST)
      setIsLoading(false)
      return
    }

    const loadSideQuest = async () => {
      try {
        const [sideQuestResponse, tasksResponse] = await Promise.all([
          authService.get(`/sidequests/${sideQuestId}`),
          authService.get(`/sidequests/${sideQuestId}/tasks`)
        ])

        const loadedTasks = tasksResponse.data.map((task) => ({
          _id: task._id,
          title: task.title || "",
          description: task.description || "",
          estimatedDuration: task.estimatedDuration || ""
        }))

        setSideQuest({
          title: sideQuestResponse.data.title || "",
          description: sideQuestResponse.data.description || "",
          imageUrl: sideQuestResponse.data.imageUrl || "",
          status: sideQuestResponse.data.status || "draft"
        })
        setTasks(loadedTasks)
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

  const handleInputChange = (event) => {
    const { name, value } = event.target
    setSideQuest((previousSideQuest) => ({ ...previousSideQuest, [name]: value }))
  }

  const handleImageUpload = (imageUrl) => {
    setSideQuest((previousSideQuest) => ({ ...previousSideQuest, imageUrl }))
  }

  const handleTaskInputChange = (event) => {
    const { name, value } = event.target
    setTaskDraft((previousTask) => ({ ...previousTask, [name]: value }))
  }

  const addTask = () => {
    if (!taskDraft.title.trim()) {
      setTaskErrorMessage("A task title is required.")
      return
    }

    setTasks((previousTasks) => [
      ...previousTasks,
      {
        ...taskDraft,
        title: taskDraft.title.trim(),
        description: taskDraft.description.trim()
      }
    ])
    setTaskDraft(createEmptyTask())
    setTaskErrorMessage("")
  }

  const removeTask = (indexToRemove) => {
    setTasks((previousTasks) => previousTasks.filter((_, index) => index !== indexToRemove))
  }

  const saveTasks = async (savedSideQuestId) => {
    const existingTaskIds = tasks.filter((task) => task._id).map((task) => task._id)

    if (sideQuestId) {
      const response = await authService.get(`/sidequests/${savedSideQuestId}/tasks`)
      const removedTasks = response.data.filter((task) => !existingTaskIds.includes(task._id))

      await Promise.all(removedTasks.map((task) => authService.delete(`/tasks/${task._id}`)))
    }

    await Promise.all(tasks.map((task) => {
      const taskBody = {
        title: task.title,
        description: task.description,
        estimatedDuration: task.estimatedDuration || undefined
      }

      return task._id
        ? authService.patch(`/tasks/${task._id}`, taskBody)
        : authService.post(`/sidequests/${savedSideQuestId}/tasks`, taskBody)
    }))
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    setErrorMessage("")
    setIsSubmitting(true)

    try {
      const response = sideQuestId
        ? await authService.patch(`/sidequests/${sideQuestId}`, sideQuest)
        : await authService.post("/sidequests", sideQuest)

      const savedSideQuestId = sideQuestId || response.data._id
      await saveTasks(savedSideQuestId)
      navigate("/sidequests")
    } catch (error) {
      setErrorMessage(
        error.response?.data?.errorMessage || "Unable to save side quest. Please try again."
      )
    } finally {
      setIsSubmitting(false)
    }
  }

  if (isLoading) return <p>Form is loading</p>

  return (
    <div className="page-container">
      <div className="page-header">
        <h1 className="page-header-hero">
          {sideQuestId ? "Edit side quest" : "Create a side quest"}
        </h1>
      </div>

      <div className="form-container">
        <form onSubmit={handleSubmit}>
          <div>
            <label htmlFor="side-quest-title">Title *</label>
            <input
              id="side-quest-title"
              name="title"
              value={sideQuest.title}
              maxLength={150}
              required
              onChange={handleInputChange}
            />
          </div>

          <div>
            <label htmlFor="side-quest-description">Description *</label>
            <textarea
              id="side-quest-description"
              name="description"
              value={sideQuest.description}
              required
              onChange={handleInputChange}
            />
          </div>

          <div>
            <label htmlFor="side-quest-image">Image</label>
            <ImageUpload handleImageUpload={handleImageUpload} />
            {sideQuest.imageUrl && <img src={sideQuest.imageUrl} alt="Side quest" width="250" />}
          </div>

          <div>
            <label htmlFor="side-quest-status">Status</label>
            <select
              id="side-quest-status"
              name="status"
              value={sideQuest.status}
              onChange={handleInputChange}
            >
              {SIDE_QUEST_STATUSES.map((status) => (
                <option key={status.value} value={status.value}>{status.label}</option>
              ))}
            </select>
          </div>

          <div className="side-quest-task-fields">
            <label htmlFor="task-title">Task title</label>
            <input
              id="task-title"
              name="title"
              placeholder="Task title"
              value={taskDraft.title}
              maxLength={150}
              onChange={handleTaskInputChange}
            />
            <label htmlFor="task-description">Task description</label>
            <textarea
              id="task-description"
              name="description"
              placeholder="What should someone do?"
              value={taskDraft.description}
              onChange={handleTaskInputChange}
            />
            <div className="side-quest-task-duration-row">
              <label htmlFor="task-duration">Minutes</label>
              <input
                id="task-duration"
                type="number"
                name="estimatedDuration"
                placeholder="0"
                min="0"
                value={taskDraft.estimatedDuration}
                onChange={handleTaskInputChange}
              />
            </div>
            <button className="btn-primary side-quest-add-task-button" type="button" onClick={addTask}>
              + Add task
            </button>
            {taskErrorMessage && <p className="error-message">{taskErrorMessage}</p>}
          </div>

          <div className="side-quest-task-list">
            {tasks.length > 0 && tasks.map((task, index) => (
              <article className="side-quest-task-tile" key={task._id || `${task.title}-${index}`}>
                <div className="side-quest-task-tile-header">
                  <h3>{task.title}</h3>
                  {task.estimatedDuration && (
                    <span className="side-quest-task-duration">
                      {task.estimatedDuration} min
                    </span>
                  )}
                </div>
                {task.description && <p className="side-quest-task-tile-description">{task.description}</p>}
                <button
                  className="side-quest-task-remove"
                  type="button"
                  aria-label={`Remove ${task.title}`}
                  onClick={() => removeTask(index)}
                >
                    x
                </button>
              </article>
            ))}
          </div>

          {errorMessage && <p className="error-message">{errorMessage}</p>}
          <button className="btn-secondary" type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Saving..." : sideQuestId ? "Update side quest" : "Create side quest"}
          </button>
        </form>
      </div>
    </div>
  )
}

export default SideQuestForm