const normalizeApiBaseUrl = () => {
  const configuredUrl = import.meta.env.VITE_API_BASE_URL || import.meta.env.VITE_BACKEND_URI || 'http://localhost:5000';
  const cleanUrl = configuredUrl.trim().replace(/\/+$/, '');

  return cleanUrl.endsWith('/api') ? cleanUrl : `${cleanUrl}/api`;
};

const API_BASE_URL = normalizeApiBaseUrl();

const request = async (path, options = {}) => {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    ...options,
  });

  const payload = await response.json().catch(() => ({
    success: false,
    message: 'The API returned a non-JSON response.',
  }));

  if (!response.ok || payload.success === false) {
    throw new Error(payload.message || 'Trackzio API request failed.');
  }

  return payload;
};

export const fetchMovies = ({ genreId = '', query = '', page = 1 }) => {
  const params = new URLSearchParams({ page: String(page) });
  const cleanQuery = query.trim();

  if (cleanQuery) {
    params.set('query', cleanQuery);
    return request(`/movies/search?${params.toString()}`);
  }

  if (genreId) {
    params.set('genreId', String(genreId));
    return request(`/movies/trending?${params.toString()}`);
  }

  return request(`/movies/trending?${params.toString()}`);
};

export const fetchGenres = () => request('/movies/genres');

export const fetchWishlist = (userId) => request(`/wishlist/${encodeURIComponent(userId)}`);

export const toggleWishlist = ({ userId, movie }) => request('/wishlist/toggle', {
  method: 'POST',
  body: JSON.stringify({ userId, movie }),
});
