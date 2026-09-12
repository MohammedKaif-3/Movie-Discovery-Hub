import { fetchTmdbGenres, fetchTmdbMovies, movieCache } from '../services/tmdbClient.js';

export const getTrendingMovies = async (req, res, next) => {
    const genreId = Number.parseInt(req.query.genreId, 10);
    const hasGenreFilter = Number.isFinite(genreId) && genreId > 0;

    try {
        const payload = await fetchTmdbMovies({
            endpoint: hasGenreFilter ? '/discover/movie' : '/trending/movie/week',
            namespace: hasGenreFilter ? 'trending-by-genre' : 'trending',
            page: req.query.page,
            extraParams: hasGenreFilter
                ? {
                    with_genres: String(genreId),
                    sort_by: 'popularity.desc',
                    include_adult: false,
                    include_video: false,
                }
                : {},
            requiredGenreId: hasGenreFilter ? genreId : null,
        });

        res.status(200).json({ success: true, ...payload });
    } catch (error) {
        next(error);
    }
};

export const discoverMovies = async (req, res, next) => {
    const genreId = Number.parseInt(req.query.genreId, 10);
    const extraParams = {};

    if (Number.isFinite(genreId) && genreId > 0) {
        extraParams.with_genres = genreId;
    }

    try {
        const payload = await fetchTmdbMovies({
            endpoint: '/discover/movie',
            namespace: 'discover',
            page: req.query.page,
            extraParams: Object.keys(extraParams).length
                ? {
                    ...extraParams,
                    sort_by: 'popularity.desc',
                    include_adult: false,
                    include_video: false,
                }
                : extraParams,
            requiredGenreId: Number.isFinite(genreId) && genreId > 0 ? genreId : null,
        });

        res.status(200).json({ success: true, ...payload });
    } catch (error) {
        next(error);
    }
};

export const searchMovies = async (req, res, next) => {
    const query = String(req.query.query || '').trim();
    if (!query) {
        return res.status(400).json({
            success: false,
            message: 'A non-empty search query is required.',
        });
    }

    try {
        const payload = await fetchTmdbMovies({
            endpoint: '/search/movie',
            namespace: 'search',
            query,
            page: req.query.page,
        });

        res.status(200).json({ success: true, ...payload });
    } catch (error) {
        next(error);
    }
};

export const getMovieGenres = async (req, res, next) => {
    try {
        const payload = await fetchTmdbGenres();
        res.status(200).json({ success: true, ...payload });
    } catch (error) {
        next(error);
    }
};

export const getMovieCacheStats = (req, res) => {
    res.status(200).json({
        success: true,
        data: movieCache.getStats(),
    });
};
