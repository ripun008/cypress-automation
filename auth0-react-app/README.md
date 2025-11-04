# Auth0 React App

A React single-page application with Auth0 authentication, built with Vite. This app is designed to work with Cypress automated tests for Auth0 authentication flows.

## Features

- **Auth0 Authentication**: Login and logout functionality using Auth0
- **User Profile Display**: Shows authenticated user information including name, email, and profile picture
- **Cypress Test Integration**: Supports programmatic authentication for automated testing
- **Modern UI**: Clean, responsive design with smooth animations
- **Fast Development**: Built with Vite for fast HMR (Hot Module Replacement)

## Tech Stack

- **React 18**: UI library
- **Vite**: Build tool and dev server
- **Auth0 React SDK** (`@auth0/auth0-react`): Authentication library
- **CSS3**: Styling with modern features

## Prerequisites

- Node.js 20 LTS or newer
- npm 10+
- Auth0 account with a configured Single Page Application

## Setup

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure Environment Variables

Create a `.env` file in this directory:

```env
VITE_AUTH0_DOMAIN=your-domain.auth0.com
VITE_AUTH0_CLIENT_ID=your-client-id
VITE_AUTH0_AUDIENCE=https://your-domain.auth0.com/api/v2/
```

**Note**: The variables must be prefixed with `VITE_` to be accessible in the React app.

### 3. Configure Auth0 Application

1. Go to [Auth0 Dashboard](https://manage.auth0.com/) → Applications
2. Select your Single Page Application
3. In **Application URIs**, configure:
   - **Allowed Callback URLs**: `http://localhost:5173`
   - **Allowed Logout URLs**: `http://localhost:5173`
   - **Allowed Web Origins**: `http://localhost:5173`
   - **Allowed Origins (CORS)**: `http://localhost:5173`
4. For Cypress testing, enable **Password** grant type:
   - Go to **Advanced Settings** → **Grant Types**
   - Check **Password**
5. Save changes

## Running the App

### Development Mode

```bash
npm run dev
```

The app will start at `http://localhost:5173`

### Build for Production

```bash
npm run build
```

### Preview Production Build

```bash
npm run preview
```

## Project Structure

```
auth0-react-app/
├── src/
│   ├── App.jsx              # Main app component with auth logic
│   ├── App.css              # App styling
│   ├── main.jsx             # Entry point with Auth0Provider
│   ├── index.css            # Global styles
│   └── auth/
│       └── auth0-provider-with-history.jsx  # Custom Auth0 provider
├── .env                     # Environment variables (not in git)
├── vite.config.js           # Vite configuration
└── package.json
```

## How Authentication Works

### Regular Login Flow

1. User clicks "Log In" button
2. Auth0Provider redirects to Auth0 login page
3. User enters credentials on Auth0
4. Auth0 redirects back to app with authentication tokens
5. App displays user profile

### Cypress Test Mode

The app detects when running in Cypress tests (`window.Cypress` exists) and:

1. Checks for `auth0Cypress` in localStorage
2. Reads pre-authenticated user data from Cypress custom command
3. Bypasses Auth0 redirect flow
4. Displays user profile directly

This allows Cypress to test the authenticated state without interactive login.

## Components

### App.jsx

Main application component that:
- Manages authentication state
- Detects Cypress test mode
- Renders login UI or user profile based on auth state

### main.jsx

App entry point that:
- Configures Auth0Provider with credentials
- Sets up authorization parameters (audience, scope)
- Wraps the app with authentication context

## Styling

The app uses modern CSS with:
- Responsive design
- Dark/light color scheme
- Smooth transitions and hover effects
- Card-based layout for user profile
- Button styles for different actions (login, logout)

## Testing with Cypress

This app is designed to work seamlessly with Cypress tests:

1. Start the app: `npm run dev`
2. Run Cypress tests from the parent directory
3. Tests will authenticate programmatically and verify UI elements

See the main [project README](../README.md) for detailed testing instructions.

## Environment Variables

| Variable | Description | Example |
|----------|-------------|---------|
| `VITE_AUTH0_DOMAIN` | Your Auth0 domain | `dev-xxx.us.auth0.com` |
| `VITE_AUTH0_CLIENT_ID` | Auth0 application client ID | `abc123...` |
| `VITE_AUTH0_AUDIENCE` | Auth0 API audience | `https://dev-xxx.us.auth0.com/api/v2/` |

## Troubleshooting

### "Invalid state" error

- Check that callback URL `http://localhost:5173` is added to Auth0 Dashboard
- Ensure the Auth0 domain and client ID are correct in `.env`

### Login button doesn't work

- Verify Auth0 credentials in `.env`
- Check browser console for errors
- Ensure Auth0 application type is "Single Page Application"

### Profile not displaying in Cypress tests

- Ensure the React app is running at `http://localhost:5173`
- Check that Cypress is setting `auth0Cypress` in localStorage
- Verify `window.Cypress` detection in App.jsx

## Resources

- [Auth0 React SDK Documentation](https://auth0.com/docs/libraries/auth0-react)
- [Auth0 React Quickstart](https://auth0.com/docs/quickstart/spa/react)
- [Vite Documentation](https://vite.dev/)
- [React Documentation](https://react.dev/)

## License

ISC
