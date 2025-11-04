import { useAuth0 } from '@auth0/auth0-react'
import { useEffect, useState } from 'react'
import './App.css'

function App() {
  const { loginWithRedirect, logout, user, isAuthenticated, isLoading } = useAuth0()
  const [cypressUser, setCypressUser] = useState(null)

  // Check for Cypress test mode
  useEffect(() => {
    if (window.Cypress && !isAuthenticated) {
      const auth0Data = localStorage.getItem('auth0Cypress')
      if (auth0Data) {
        try {
          const parsedAuth = JSON.parse(auth0Data)
          setCypressUser(parsedAuth.body.decodedToken.user)
          console.log('Cypress test mode: Using programmatic login')
        } catch (error) {
          console.error('Failed to parse Cypress auth data', error)
        }
      }
    }
  }, [isAuthenticated])

  // If in Cypress mode with cached user, override authentication state
  const actualUser = cypressUser || user
  const actuallyAuthenticated = cypressUser ? true : isAuthenticated

  if (isLoading) {
    return (
      <div className="container">
        <div className="loading">Loading...</div>
      </div>
    )
  }

  return (
    <div className="container">
      <h1>Auth0 React App</h1>

      {!actuallyAuthenticated ? (
        <div className="auth-section">
          <p>Welcome! Please log in to continue.</p>
          <button onClick={() => loginWithRedirect()} className="btn-primary">
            Log In
          </button>
          <button id="get-started" className="btn-secondary">
            Get Started
          </button>
        </div>
      ) : (
        <div className="auth-section">
          <div className="profile-card">
            {actualUser?.picture && <img src={actualUser.picture} alt={actualUser?.name} className="profile-picture" />}
            <h2>Welcome, {actualUser?.name}!</h2>
            <div className="user-info">
              <p><strong>Email:</strong> {actualUser?.email}</p>
              <p><strong>Email Verified:</strong> {actualUser?.email_verified ? 'Yes' : 'No'}</p>
              <p><strong>User ID:</strong> {actualUser?.sub}</p>
            </div>
          </div>
          <button
            onClick={() => logout({ logoutParams: { returnTo: window.location.origin } })}
            className="btn-danger"
          >
            Log Out
          </button>
        </div>
      )}
    </div>
  )
}

export default App
