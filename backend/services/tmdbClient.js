import axios from 'axios';
import NodeCache from 'node-cache';

const CACHE_TTL_SECONDS = 300;
const TMDB_TIMEOUT_MS = 5000;
const TMDB_IMAGE_BASE_URL = 'https://image.tmdb.org/t/p/w500';

export const movieCache = new NodeCache({
    stdTTL: CACHE_TTL_SECONDS,
    checkperiod: 60,
    useClones: false,
});

const normalizeBaseUrl = () => {
    const configuredUrl = (process.env.TMDB_BASE_URL || 'https://api.themoviedb.org/3').trim();
    return configuredUrl.replace(/\/+$/, '');
};

const createAuthConfig = () => {
    const readAccessToken = (process.env.TMDB_API_READ_ACCESS_TOKEN || '').trim();
    const apiKey = (process.env.TMDB_API_KEY || '').trim();

    if (readAccessToken) {
        return {
            headers: {
                accept: 'application/json',
                Authorization: `Bearer ${readAccessToken}`,
            },
            params: {},
        };
    }

    if (!apiKey) {
        throw new Error('TMDB_API_KEY or TMDB_API_READ_ACCESS_TOKEN is required.');
    }

    return {
        headers: { accept: 'application/json' },
        params: { api_key: apiKey },
    };
};

const tmdb = axios.create({
    baseURL: normalizeBaseUrl(),
    timeout: TMDB_TIMEOUT_MS,
});

export const sanitizeMovie = (movie = {}) => ({
    id: Number(movie.id),
    title: movie.title || movie.name || 'Untitled',
    releaseDate: movie.release_date || movie.first_air_date || 'N/A',
    rating: typeof movie.vote_average === 'number' ? Number(movie.vote_average.toFixed(1)) : 0,
    posterPath: movie.poster_path ? `${TMDB_IMAGE_BASE_URL}${movie.poster_path}` : null,
    overview: movie.overview || 'No description available.',
    genreIds: Array.isArray(movie.genre_ids) ? movie.genre_ids.map(Number).filter(Number.isFinite) : [],
});

const normalizePage = (page) => {
    const requestedPage = Number.parseInt(page, 10);
    if (Number.isNaN(requestedPage) || requestedPage < 1) return 1;
    return Math.min(requestedPage, 500);
};

const buildCacheKey = (namespace, values) => {
    const serialized = Object.entries(values)
        .map(([key, value]) => `${key}:${String(value).trim().toLowerCase()}`)
        .join('|');
    return `${namespace}|${serialized}`;
};

export const fetchTmdbMovies = async ({
    endpoint,
    namespace,
    query = '',
    page = 1,
    extraParams = {},
    requiredGenreId = null,
}) => {
    const safePage = normalizePage(page);
    const cleanQuery = query.trim();
    const cacheKey = buildCacheKey(namespace, { query: cleanQuery, page: safePage, ...extraParams });
    const cachedPayload = movieCache.get(cacheKey);

    if (cachedPayload) {
        return { ...cachedPayload, source: 'cache' };
    }

    const authConfig = createAuthConfig();
    const params = {
        ...authConfig.params,
        language: 'en-US',
        page: safePage,
        ...extraParams,
    };

    if (cleanQuery) {
        params.query = cleanQuery;
        params.include_adult = false;
    }

    try {
        const response = await tmdb.get(endpoint, {
            headers: authConfig.headers,
            params,
        });

        const results = Array.isArray(response.data?.results) ? response.data.results : [];
        const sanitizedMovies = results
            .map(sanitizeMovie)
            .filter((movie) => Number.isFinite(movie.id))
            .filter((movie) => !requiredGenreId || movie.genreIds.includes(Number(requiredGenreId)));

        const payload = {
            data: sanitizedMovies,
            page: response.data?.page || safePage,
            totalPages: Math.min(response.data?.total_pages || safePage, 500),
            totalResults: response.data?.total_results || results.length,
        };

        movieCache.set(cacheKey, payload);
        return { ...payload, source: 'network' };
    } catch (error) {
        const isTimeout = error.code === 'ECONNABORTED';
        const status = error.response?.status;
        const remoteMessage = error.response?.data?.status_message;

        const outboundError = new Error(
            isTimeout
                ? 'TMDB did not respond within the 5 second gateway timeout.'
                : remoteMessage || 'TMDB request failed before a clean movie payload was available.'
        );
        outboundError.statusCode = status === 429 ? 503 : 502;
        outboundError.details = {
            status,
            timeout: isTimeout,
            code: error.code,
            host: error.request?.host || error.config?.baseURL,
        };
        throw outboundError;
    }
};

export const fetchTmdbGenres = async () => {
    const cacheKey = 'genres|movie';
    const cachedGenres = movieCache.get(cacheKey);

    if (cachedGenres) {
        return { data: cachedGenres, source: 'cache' };
    }

    const authConfig = createAuthConfig();

    try {
        const response = await tmdb.get('/genre/movie/list', {
            headers: authConfig.headers,
            params: {
                ...authConfig.params,
                language: 'en-US',
            },
        });

        const genres = Array.isArray(response.data?.genres)
            ? response.data.genres
                .map((genre) => ({ id: Number(genre.id), name: genre.name || 'Unknown' }))
                .filter((genre) => Number.isFinite(genre.id))
            : [];

        movieCache.set(cacheKey, genres);
        return { data: genres, source: 'network' };
    } catch (error) {
        const outboundError = new Error(error.response?.data?.status_message || 'TMDB genres could not be loaded.');
        outboundError.statusCode = error.response?.status === 429 ? 503 : 502;
        outboundError.details = {
            status: error.response?.status,
            timeout: error.code === 'ECONNABORTED',
            code: error.code,
            host: error.request?.host || error.config?.baseURL,
        };
        throw outboundError;
    }
};
