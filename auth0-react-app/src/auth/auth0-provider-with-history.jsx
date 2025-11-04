import { Auth0Provider } from '@auth0/auth0-react'
import { useEffect, useState } from 'react'

export const Auth0ProviderWithHistory = ({ children, ...props }) => {
  const [auth0FromCache, setAuth0FromCache] = useState(null)

  useEffect(() => {
    // Check if running in Cypress and if auth0Cypress exists in localStorage
    if (window.Cypress) {
      const auth0Cypress = localStorage.getItem('auth0Cypress')
      if (auth0Cypress) {
        try {
          const parsedAuth = JSON.parse(auth0Cypress)
          setAuth0FromCache(parsedAuth)
          console.log('Cypress: Auth0 data loaded from localStorage')
        } catch (error) {
          console.error('Failed to parse auth0Cypress from localStorage', error)
        }
      }
    }
  }, [])

  // If we're in Cypress mode and have cached auth, provide a mock auth context
  if (window.Cypress && auth0FromCache) {
    const { user, decodedToken } = auth0FromCache.body.decodedToken || {}

    // Create a mock Auth0 context for Cypress
    const mockAuth0 = {
      isAuthenticated: true,
      isLoading: false,
      user: user,
      loginWithRedirect: () => Promise.resolve(),
      logout: () => {
        localStorage.removeItem('auth0Cypress')
        window.location.reload()
      },
      getAccessTokenSilently: () => Promise.resolve(auth0FromCache.body.access_token),
      getIdTokenClaims: () => Promise.resolve(decodedToken?.claims),
    }

    // Use a simple context provider for Cypress tests
    return (
      <Auth0Provider {...props}>
        {/* Inject mock authentication state */}
        <CypressAuthInjector mockAuth={mockAuth0}>
          {children}
        </CypressAuthInjector>
      </Auth0Provider>
    )
  }

  // Normal Auth0Provider for regular usage
  return <Auth0Provider {...props}>{children}</Auth0Provider>
}

// Helper component to inject Cypress auth state
const CypressAuthInjector = ({ mockAuth, children }) => {
  // This is a simplified version - in reality, you'd use React Context
  // For now, we'll rely on Auth0's built-in session management
  return <>{children}</>
}
