# Trackzio Movie Hub

Live application: https://frontend-eta-silk-qjl241511n.vercel.app/

Trackzio Movie Hub is a full-stack movie discovery application built with React, Node.js/Express, and MongoDB. The frontend never calls TMDB directly. All external movie data flows through the Node API gateway, where it is cached, sanitized, transformed, and serialized before reaching the browser.

## Setup Instructions

### Prerequisites

- Node.js 18 or newer
- npm
- MongoDB Atlas or a local MongoDB connection string
- TMDB API key

### Backend

1. Install dependencies:

   ```bash
   cd backend
   npm install
   ```

2. Create `backend/.env`:

   ```env
   PORT=5000
   MONGO_URI=your_mongodb_connection_string
   TMDB_API_KEY=your_tmdb_v3_api_key
   TMDB_BASE_URL=https://api.themoviedb.org/3
   CORS_ORIGIN=http://localhost:5173
   ```

3. Start the backend:

   ```bash
   npm start
   ```

4. Health check:

   ```text
   http://localhost:5000/api/health
   ```

### Frontend

1. Install dependencies:

   ```bash
   cd frontend
   npm install
   ```

2. Create `frontend/.env`:

   ```env
   VITE_BACKEND_URI=http://localhost:5000
   ```

3. Start the frontend:

   ```bash
   npm run dev
   ```

4. Open:

   ```text
   http://localhost:5173
   ```

## Approach Taken

The application is split into a scalable full-stack structure. The backend follows an MVC-style organization with routes, controllers, models, database config, and an external TMDB service layer. The frontend is component-based and organized around layout components, movie components, feedback components, feature hooks, shared hooks, context, utilities, constants, and pages.

The backend acts as an API gateway between the React client and TMDB. This keeps API keys out of the browser, protects the external API from repeated client requests, and allows the server to normalize inconsistent third-party responses into a stable internal movie model.

The frontend uses React Context to preserve application state such as active route, search query, filters, selected movie, wishlist data, and scroll positions. Search input is debounced, movie lists are rendered incrementally with Intersection Observer, and repeated rendering work is reduced with `useMemo`, `useCallback`, and `React.memo`.

## Important Technical Decisions

- TMDB is accessed only from the backend, never directly from the browser.
- Axios outbound TMDB calls use a 5 second timeout to avoid hanging server requests.
- `node-cache` provides a 5 minute in-memory cache for trending, genre, and search responses.
- External movie payloads are transformed into a smaller internal model: `id`, `title`, `releaseDate`, `rating`, `posterPath`, `overview`, and genre metadata where available.
- Missing movie fields are handled with safe fallbacks such as `Untitled`, `Unknown release`, or `null`.
- Wishlist persistence uses MongoDB through Mongoose.
- Wishlist records store a user id, external movie id, and a nested sanitized movie snapshot.
- Compound indexes support fast wishlist lookup and toggle operations.
- The frontend API client targets only the backend `/api` routes.
- Infinite scrolling uses the browser's Intersection Observer API instead of scroll event polling.
- Search uses a custom `useDebounce` hook with a 300ms delay.
- UI states are explicit: loading skeletons, empty states, network error blocks, retry controls, and populated movie grids.
- Images use lazy loading and async decoding for better browser performance.
- Movie cards use CSS containment and `content-visibility` to reduce DOM rendering cost on long lists.
- Wishlist state is refreshed from MongoDB instead of trusting stale local browser storage.

## Implemented Features

- Movie discovery feed.
- TMDB search through the backend API gateway.
- Genre/category browsing.
- Sorting by popularity, rating, and release date.
- Infinite scrolling with duplicate movie protection.
- Movie detail modal.
- Add/remove wishlist toggle.
- Persistent wishlist backed by MongoDB.
- Wishlist-only tab that shows saved movies only.
- Debounced search input.
- Loading skeleton shimmer UI.
- Empty search and empty wishlist states.
- Retryable network error UI.
- Light/dark theme toggle.
- Responsive layout for mobile, tablet, and desktop.
- Deployed frontend connected to deployed backend.

## Assumptions Made

- Full authentication is outside the assignment scope, so the app uses a stable demo user id for wishlist persistence.
- TMDB is the selected third-party movie provider.
- Search and genre discovery are treated as separate flows because TMDB search and discover endpoints behave differently.
- Poster images use TMDB's configured image paths at a practical size for quality and bandwidth.
- The in-memory cache is acceptable for a single deployed Node process.

## Known Limitations

- The cache is process-local and resets when the backend restarts.
- The demo user id means all users share the same wishlist unless authentication is added.
- Render free-tier cold starts can make the first backend request slower.
- TMDB availability, VPN issues, or network restrictions can still produce retryable upstream errors.
- There are no automated unit/integration tests yet.
- In-memory caching is not shared across multiple backend instances.

## AI Tools Used

AI assistance was used during development to:

- Plan the frontend/backend architecture, tools: Gemini, Codex for system designing.
- Reorganize React components, hooks, services, and utilities.
- Implement Express routes, controllers, caching, and service-layer patterns.
- Review performance issues such as duplicate cards, unnecessary preflights, scroll behavior, and render churn.
- Improve UI structure, responsive behavior, theme styling, and interaction details.
- Draft and refine this README.

All final implementation decisions were aligned with the assignment requirements and manually verified through local checks.

## What I Would Improve With Additional Time

- Add real authentication and per-user wishlist ownership.
- Add automated backend API tests and frontend component tests.
- Add request logging with correlation ids for easier production debugging.
- Replace process-local cache with Redis for distributed deployments.
- Add movie detail enrichment from TMDB's detail endpoint.
- Add optimistic wishlist updates with rollback on failure.
- Add accessibility testing with keyboard and screen-reader checks.
