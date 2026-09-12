import Wishlist from '../models/wishlist.js';
import { sanitizeMovie } from '../services/tmdbClient.js';

const normalizeUserId = (userId) => String(userId || '').trim();

const normalizeIncomingMovie = (body) => {
    const movie = body.movie && typeof body.movie === 'object' ? body.movie : body;
    const sanitizedMovie = sanitizeMovie({
        id: movie.id || body.movieId,
        title: movie.title,
        release_date: movie.releaseDate,
        vote_average: movie.rating,
        poster_path: movie.posterPath?.startsWith('http') ? null : movie.posterPath,
        overview: movie.overview,
    });

    if (movie.posterPath?.startsWith('http')) {
        sanitizedMovie.posterPath = movie.posterPath;
    }

    return sanitizedMovie;
};

export const toggleWishlist = async (req, res, next) => {
    const userId = normalizeUserId(req.body.userId);
    const movie = normalizeIncomingMovie(req.body);

    try {
        if (!userId || !Number.isFinite(movie.id)) {
            return res.status(400).json({
                success: false,
                message: 'userId and a valid movie id are required.',
            });
        }

        const existingRecord = await Wishlist.findOne({ userId, movieId: movie.id }).lean();

        if (existingRecord) {
            await Wishlist.deleteOne({ _id: existingRecord._id });
            return res.status(200).json({
                success: true,
                action: 'removed',
                movieId: movie.id,
                data: null,
            });
        }

        const savedRecord = await Wishlist.create({
            userId,
            movieId: movie.id,
            movie,
        });

        res.status(201).json({
            success: true,
            action: 'added',
            movieId: movie.id,
            data: savedRecord,
        });
    } catch (error) {
        if (error.code === 11000) {
            return res.status(409).json({
                success: false,
                message: 'This movie is already in the wishlist.',
            });
        }
        next(error);
    }
};

export const getWishlist = async (req, res, next) => {
    const userId = normalizeUserId(req.params.userId);

    try {
        if (!userId) {
            return res.status(400).json({
                success: false,
                message: 'A valid userId is required.',
            });
        }

        const list = await Wishlist.find({ userId })
            .sort({ createdAt: -1 })
            .lean();

        res.status(200).json({
            success: true,
            data: list,
        });
    } catch (error) {
        next(error);
    }
};

export const clearWishlist = async (req, res, next) => {
    const userId = normalizeUserId(req.params.userId);

    try {
        if (!userId) {
            return res.status(400).json({
                success: false,
                message: 'A valid userId is required.',
            });
        }

        const result = await Wishlist.deleteMany({ userId });
        res.status(200).json({
            success: true,
            deletedCount: result.deletedCount,
        });
    } catch (error) {
        next(error);
    }
};
