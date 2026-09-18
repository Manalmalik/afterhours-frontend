import { useEffect, useState } from 'react'
import authService from '../services/index.services'

function AccountPage() {
  const [user, setUser] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [errorMessage, setErrorMessage] = useState("")

  useEffect(() => {
    const loadProfile = async () => {
      try {
        const response = await authService.get("/auth/profile")
        setUser(response.data)
      } catch (error) {
        setErrorMessage(
          error.response?.data?.errorMessage || "Unable to load your account. Please try again."
        )
      } finally {
        setIsLoading(false)
      }
    }

    loadProfile()
  }, [])

  if (isLoading) return <p className="account-page-message">Account is loading</p>

  if (errorMessage) return <p className="error-message account-page-message">{errorMessage}</p>

  return (
    <div className="account-page">
      <header className="account-page-header">
        <div className="page-header-caption">
          <hr className="primary" />
          <p>Your profile</p>
          <hr className="primary" />
        </div>
        <h1>My account</h1>
        <p className="caption">Your place in the AfterHours club.</p>
      </header>

      <main className="account-page-content">
        <section className="account-profile-card">
          <div className="account-profile-avatar">
            {user.username?.charAt(0).toUpperCase()}
          </div>
          <div className="account-profile-info">
            <p className="subtitle">Member details</p>
            <h2>{user.username}</h2>
            <p>{user.email}</p>
            <span className="badge">{user.role}</span>
          </div>
        </section>

        <section className="account-summary">
          <div>
            <p className="account-summary-label">Side quests</p>
            <h2>{user.Quests?.length || 0}</h2>
            <p>saved quests</p>
          </div>
          <div>
            <p className="account-summary-label">Member since</p>
            <h2>{new Date(user.createdAt).toLocaleDateString("en-GB", { month: "short", year: "numeric" })}</h2>
            <p>AfterHours member</p>
          </div>
        </section>

        <section className="account-quests-section">
          <div className="account-section-header">
            <div>
              <p className="subtitle">Your collection</p>
              <h2>Saved side quests</h2>
            </div>
          </div>
          {user.Quests?.length ? (
            <div className="account-quests-list">
              {user.Quests.map((quest, index) => (
                <div className="account-quest-item" key={`${quest}-${index}`}>
                  <span>{String(index + 1).padStart(2, "0")}</span>
                  <p>{quest}</p>
                </div>
              ))}
            </div>
          ) : (
            <p className="account-empty-state">You have not saved any side quests yet.</p>
          )}
        </section>
      </main>
    </div>
  )
}

export default AccountPage
