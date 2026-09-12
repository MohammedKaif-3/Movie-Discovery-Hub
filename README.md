# Trackzio Movie Hub

Trackzio Movie Hub is a full-stack movie discovery application built with React, Node.js/Express, and MongoDB. The browser talks only to the Node API gateway; external TMDB data is fetched, cached, sanitized, and serialized on the server before it reaches the UI.

## Setup

1. Install backend dependencies:
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
   npm.cmd start
   ```

4. Install and run the frontend:
   ```bash
   cd ../frontend
   npm install
   npm.cmd run dev
   ```

5. Open `http://localhost:5173`.

## Approach

The backend follows an MVC-style structure with routes, controllers, models, config, and a TMDB service layer. The frontend is split by components, feature hooks, shared hooks, context, utilities, constants, and pages.

## Technical Decisions

- TMDB requests are made only from the backend.
- `node-cache` stores repeated movie/genre responses for 5 minutes.
- Axios uses a 5 second timeout to prevent slow outbound calls from tying up the API.
- Movie payloads are reduced to `id`, `title`, `releaseDate`, `rating`, `posterPath`, and `overview`.
- Wishlist records store a user id, external movie id, and nested sanitized movie snapshot.
- Compound MongoDB indexes support fast wishlist toggles.
- React Context stores route, filters, search, movie lists, selected detail state, and scroll memory.
- Wishlist data is treated as server-owned and is refreshed from MongoDB instead of trusting stale browser storage.
- `useMemo`, `useCallback`, `React.memo`, `IntersectionObserver`, lazy image decoding, and CSS containment reduce unnecessary work.

## Implemented Features

- Browse movies without searching.
- Search movies with debounced input.
- Browse by genre/category.
- Sort results by popularity, rating, or release date.
- Infinite scrolling for large result sets.
- Open movie details.
- Add/remove persistent wishlist entries.
- Reopen the application and load wishlist from MongoDB.
- Preserve navigation/search/filter/scroll context.
- Loading skeletons, empty states, and retryable error UI.
- Responsive layouts for mobile, tablet, and desktop.

## Assumptions

- Authentication is outside assignment scope, so the demo uses a stable local user id.
- Search results are not genre-filtered because TMDB search and discover are separate APIs; genre browsing applies when no search query is active.
- TMDB poster URLs use the `w500` image size for a balance of quality and bandwidth.

## Known Limitations

- The in-memory cache is process-local and resets when the backend restarts.
- A single hardcoded demo user is used instead of full user authentication.
- If local network, VPN, firewall, or TMDB availability causes `ECONNRESET`, the UI shows the backend's retryable error state.

## AI Transparency

AI assistance was used to structure the implementation, generate boilerplate, review edge cases, and improve performance. The final architecture and behavior were selected to match the assignment requirements.

## Future Improvements

- Add authentication and per-user sessions.
- Add automated API and component tests.
- Add server-side request logging with correlation ids.
- Add Redis for distributed caching.
- Add richer movie detail fields from TMDB's detail endpoint.
