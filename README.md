# Nexify

Nexify is a full-stack professional networking application. It lets people create a profile, publish image posts, interact through likes and comments, discover other users, build connections, and receive notifications. The web client is a React single-page application backed by an Express, MongoDB, Socket.IO, Cloudinary, and Brevo API.

## Highlights

- Cookie-based signup, login, logout, email-verification OTP, and password-reset OTP flows.
- Profiles with a headline, location, skills, education, experience, profile photo, and cover photo.
- Public post feed with up to four images per post.
- Likes and comments with live feed updates over Socket.IO.
- User search and connection suggestions.
- Connection requests with accept, reject, remove, and live status updates.
- In-app notifications for likes, comments, and connection activity.
- Responsive React UI with Tailwind CSS, React Router, React Toastify, and a theme context.

## Tech stack

| Area | Technologies |
| --- | --- |
| Frontend | React 19, Vite, React Router, Axios, Tailwind CSS, Socket.IO Client |
| Backend | Node.js, Express 5, Mongoose, JSON Web Tokens, Socket.IO |
| Database | MongoDB |
| Media | Cloudinary |
| Email | Brevo transactional email API |
| Authentication | JWT stored in HTTP-only cookies; passwords hashed with bcryptjs |

## Repository layout

```text
.
├── frontend/                  # Vite + React web application
│   ├── src/components/         # Navigation, profiles, post, and layout UI
│   ├── src/context/            # Auth, current-user, and theme state
│   └── src/pages/              # Home, login, signup, networks, profile, notifications
└── backend/                   # Express API and Socket.IO server
    └── src/
        ├── config/             # Environment, database, Cloudinary, mail, JWT configuration
        ├── controllers/        # Request handlers
        ├── middlewares/        # JWT protection and Multer upload handling
        ├── models/             # User, Post, Connection, and Notification schemas
        └── routes/             # API endpoints
```

## Prerequisites

- Node.js 20 or newer (recommended)
- npm
- A MongoDB deployment or local MongoDB instance
- A Cloudinary account for profile, cover, and post-image uploads
- A Brevo account/API key for welcome and OTP emails

## Run locally

Install and configure the backend first:

```bash
cd backend
npm install
```

Create `backend/.env` using the following template. Do not commit this file or real credentials.

```dotenv
PORT=5000
NODE_ENV=development
DB_URL=mongodb://127.0.0.1:27017/nexify
SECRET_KEY=replace-with-a-long-random-secret

CLOUD_NAME=your-cloudinary-cloud-name
CLOUD_API_KEY=your-cloudinary-api-key
CLOUD_API_SECRET=your-cloudinary-api-secret

BREVO_API_KEY=your-brevo-api-key

# Present in the environment configuration; currently not used by the Brevo sender.
SMTP_USER=
SMTP_PASS=
SENDER_MAIL=
```

Start the API server:

```bash
cd backend
npm run dev
```

In a second terminal, install and start the frontend:

```bash
cd frontend
npm install
npm run dev
```

Vite prints the local URL, normally `http://localhost:5173`.

### Important local-development configuration

The current client and server use deployed URLs directly in source code:

- `frontend/src/context/AuthContext.jsx` defines the API base URL.
- `frontend/src/components/HeroComponents/PostCard.jsx` and `frontend/src/components/ConnectionButton.jsx` define the Socket.IO server URL.
- `backend/src/app.js` defines the allowed frontend CORS origin.

Before developing locally, change these values to your local addresses (for example `http://localhost:5000` for the API and `http://localhost:5173` for the frontend), or refactor them to environment variables. The API must allow the exact client origin and credentials. Cookies configured with `SameSite=None` are only accepted by browsers over HTTPS, so a local HTTP setup may also require adjusting cookie options for development.

## Available scripts

| Directory | Command | Purpose |
| --- | --- | --- |
| `backend` | `npm run dev` | Start the API with Nodemon. |
| `backend` | `npm start` | Start the API with Node.js. |
| `frontend` | `npm run dev` | Start the Vite development server. |
| `frontend` | `npm run build` | Produce a production frontend build. |
| `frontend` | `npm run preview` | Preview the built frontend. |
| `frontend` | `npm run lint` | Run ESLint across the frontend. |

## API reference

All routes below are prefixed with `/api`. Protected routes require the `token` HTTP-only cookie returned by signup or login. Requests from the frontend should use credentials (Axios uses `withCredentials: true` in this project).

### Authentication — `/auth`

| Method | Endpoint | Description |
| --- | --- | --- |
| `POST` | `/signup` | Create an account and set the auth cookie. Body: `firstName`, `lastName`, `userName`, `email`, `password`. |
| `POST` | `/login` | Log in and set the auth cookie. Body: `email`, `password`. |
| `GET` | `/logout` | Clear the auth cookie. |
| `POST` | `/sendverificationotp` | Email a verification OTP. Body: `email`. |
| `POST` | `/verifyotp` | Verify the email OTP. Body: `email`, `otp`. |
| `POST` | `/sendpassresetotp` | Email a password-reset OTP. Body: `email`. |
| `POST` | `/verifyresetpassotp` | Reset a password. Body: `email`, `otp`, `newPassword`. |

### Users — `/user`

| Method | Endpoint | Description |
| --- | --- | --- |
| `GET` | `/` | Get the signed-in user. |
| `PUT` | `/updateUserProfile` | Update profile data and optionally upload `profileImage` and `coverImage`. Form fields for `skills`, `education`, and `exprience` are JSON strings. |
| `GET` | `/getuserdetails/:userName` | Get a user profile by username. |
| `GET` | `/search?query=<text>` | Search names, usernames, headlines, and skills. |
| `GET` | `/suggestedusers` | List users not already connected to the signed-in user. |

### Posts — `/user/post`

| Method | Endpoint | Description |
| --- | --- | --- |
| `POST` | `/create` | Create a post. Submit multipart data with `description` and up to four `postImage` files. |
| `GET` | `/getPosts` | Get all posts, newest first. |
| `GET` | `/like/:id` | Toggle the signed-in user's like for a post. |
| `POST` | `/comment/:id` | Add a comment. Body: `content`. |

### Connections — `/user/connection`

| Method | Endpoint | Description |
| --- | --- | --- |
| `POST` | `/send/:id` | Send a connection request to a user ID. |
| `PUT` | `/accept/:id` | Accept a request by connection ID. |
| `PUT` | `/reject/:id` | Reject a request by connection ID. |
| `GET` | `/getStatus/:id` | Get the relationship state for a user ID. |
| `DELETE` | `/remove/:id` | Remove an accepted connection by other user ID. |
| `GET` | `/getRequests` | List pending connection requests. |
| `GET` | `/getConnections` | Get the signed-in user's connections. |

### Notifications — `/notification`

| Method | Endpoint | Description |
| --- | --- | --- |
| `GET` | `/get` | List the signed-in user's notifications. |
| `DELETE` | `/deleteOne/:id` | Delete one notification. |
| `DELETE` | `/delete` | Delete all notifications. |

The server also exposes `GET /` and `GET /ch` as lightweight health checks.

## Real-time events

The server uses Socket.IO for immediate UI updates:

| Event | Direction | Payload / purpose |
| --- | --- | --- |
| `register` | client → server | Join the room for a user ID: `user:<id>`. |
| `likeUpdated` | server → clients | Broadcast after a like changes: `{ postId, likes }`. |
| `commentAdded` | server → clients | Broadcast after a comment is added: `{ postId, comm }`. |
| `statusUpdate` | server → user room | Connection status change: `{ updatedUserId, newStatus }`. |

## Deployment notes

- Deploy the frontend as a static Vite site, running `npm run build` in `frontend`; the output directory is `frontend/dist`.
- Deploy the backend as a Node.js service with `npm start` and all environment variables configured.
- Set the backend's CORS `frontendOrigin` to the deployed frontend URL and ensure Socket.IO uses the same origin.
- For cross-site cookies, use HTTPS, `credentials: true`, `SameSite=None`, and secure cookies in production.
- Configure your hosting provider to forward SPA routes to `index.html`. This repository includes `frontend/public/_redirects` for Netlify-style deployments.

## Data model overview

- **User:** account credentials plus profile details, media metadata, and connection IDs.
- **Post:** author, text description, Cloudinary image metadata, likes, and comments.
- **Connection:** sender, receiver (stored as `reciever` in the schema), and a `pending`, `accepted`, or `rejected` status.
- **Notification:** recipient, type (`like`, `comment`, or `connection`), related user, and optional related post.

## Security considerations

- Keep `.env` credentials private and rotate any key that has been exposed.
- Use a strong, unique `SECRET_KEY` in every environment.
- The application stores authentication tokens in HTTP-only cookies, which prevents JavaScript from reading them. CORS and cookie settings still need to be restricted to trusted origins in production.
- API endpoints use the existing JWT middleware for protected data; do not remove it when extending the API.

## License

No license has been specified for this repository. Add a `LICENSE` file before distributing or open-sourcing the project.
