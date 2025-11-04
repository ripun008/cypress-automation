# Cypress Automation with Auth0

This project demonstrates automated testing of Auth0 authentication using Cypress with a React single-page application.

## Project Structure

```
cypress-automation/
├── auth0-react-app/          # React app with Auth0 integration
├── cypress/
│   ├── e2e/
│   │   └── loginTest.cy.ts   # Auth0 authentication tests
│   └── support/
│       └── commands.js        # Custom Cypress commands (loginByAuth0Api)
├── cypress.config.js          # Cypress configuration
└── .env                       # Environment variables (Auth0 credentials)
```

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

Create a `.env` file in the root directory:

```env
AUTH0_USERNAME=your-auth0-username@example.com
AUTH0_PASSWORD=your-password
REACT_APP_AUTH0_DOMAIN=your-domain.auth0.com
REACT_APP_AUTH0_AUDIENCE=https://your-domain.auth0.com/api/v2/
REACT_APP_AUTH0_SCOPE=openid profile email
REACT_APP_AUTH0_CLIENTID=your-client-id
AUTH0_CLIENT_SECRET=your-client-secret
```

### 3. Configure Auth0 Dashboard

1. Go to your Auth0 Dashboard → Applications
2. Select your Single Page Application
3. Add these URLs in Application URIs:
   - **Allowed Callback URLs**: `http://localhost:5173`
   - **Allowed Logout URLs**: `http://localhost:5173`
   - **Allowed Web Origins**: `http://localhost:5173`
   - **Allowed Origins (CORS)**: `http://localhost:5173`
4. Enable **Password** grant type in Advanced Settings → Grant Types
5. Save changes

### 4. Start the React App

```bash
cd auth0-react-app
npm install
npm run dev
```

The app will be available at `http://localhost:5173`

## Running Cypress Tests

### Open Cypress Test Runner (Interactive Mode)

```bash
npx cypress open
```

### Run All Tests (Headless Mode)

```bash
npx cypress run
```

### Run Specific Test

```bash
npx cypress run --spec cypress/e2e/loginTest.cy.ts
```

### Run with Specific Browser

```bash
npx cypress run --browser chrome
npx cypress run --browser firefox
npx cypress run --browser edge
```

### Run Tests in Headed Mode

```bash
npx cypress run --headed
```

## Custom Cypress Commands

### `cy.loginByAuth0Api(username, password)`

Programmatically authenticates with Auth0 using the OAuth2 Password grant flow.

**Usage:**

```javascript
cy.loginByAuth0Api(
  Cypress.env('auth0_username'),
  Cypress.env('auth0_password')
)
```

**What it does:**
1. Makes a POST request to Auth0's `/oauth/token` endpoint
2. Receives `access_token` and `id_token`
3. Decodes the JWT token to extract user information
4. Stores authentication data in `localStorage` under the `auth0Cypress` key
5. Visits the application with authenticated state

## Test Scenarios

The test suite includes the following scenarios:

1. **Display user profile after programmatic login** - Verifies user information is displayed
2. **Show Get Started button when not authenticated** - Verifies login UI elements
3. **Display user information correctly** - Checks user ID, email verification status
4. **Verify authentication state with tokens** - Validates tokens in localStorage

## How It Works

### Programmatic Login Flow

1. Cypress test calls `cy.loginByAuth0Api()` with credentials
2. Custom command authenticates with Auth0 OAuth2 API
3. Auth0 returns access and ID tokens
4. Tokens are decoded and stored in `localStorage` as `auth0Cypress`
5. React app visits `http://localhost:5173` with tokens set
6. React app detects `window.Cypress` and reads `auth0Cypress` from localStorage
7. App renders authenticated UI with user profile

### React App Integration

The React app is designed to work with Cypress tests by:
- Checking for `window.Cypress` to detect test mode
- Reading `auth0Cypress` from localStorage
- Bypassing Auth0 redirect flow during tests
- Displaying user profile based on cached credentials

## Troubleshooting

### Tests fail with "Expected to find content: 'Welcome,'"

- Ensure the React app is running at `http://localhost:5173`
- Check that Auth0 credentials in `.env` are correct
- Verify Auth0 Dashboard settings (callback URLs, grant types)

### "Invalid grant" error

- Verify the Password grant type is enabled in Auth0 Dashboard
- Check that username and password are correct
- Ensure the Auth0 application type is Single Page Application

### CORS errors

- Add `http://localhost:5173` to Allowed Origins in Auth0 Dashboard
- Restart the React app after configuration changes

## Resources

- [Cypress Auth0 Documentation](https://docs.cypress.io/app/guides/authentication-testing/auth0-authentication)
- [Auth0 React Quickstart](https://auth0.com/docs/quickstart/spa/react)
- [Cypress Documentation](https://docs.cypress.io/)

## License

ISC