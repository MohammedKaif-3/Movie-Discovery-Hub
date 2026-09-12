import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import connectDB from './config/db.js';
import movieRoutes from './routes/movieRoutes.js';
import wishlistRoutes from './routes/wishlistRoutes.js';

dotenv.config();

const app = express();
const corsOrigins = (process.env.CORS_ORIGIN || '*')
    .split(',')
    .map((origin) => origin.trim().replace(/\/+$/, ''))
    .filter(Boolean);

app.disable('x-powered-by');
app.use(cors({
    origin: (origin, callback) => {
        // Server-to-server, health checks, and local tools often omit Origin.
        if (!origin || corsOrigins.includes('*')) return callback(null, true);

        const normalizedOrigin = origin.replace(/\/+$/, '');
        if (corsOrigins.includes(normalizedOrigin)) return callback(null, true);

        return callback(new Error('CORS origin is not allowed by Trackzio Movie Hub API.'));
    },
}));
app.use(express.json({ limit: '200kb' }));

app.get('/api/health', (req, res) => {
    res.status(200).json({
        success: true,
        service: 'Trackzio Movie Hub API',
        uptime: process.uptime(),
    });
});

// The browser only talks to these gateway routes. TMDB payloads are sanitized,
// serialized, and cached before crossing back into client code.
app.use('/api/movies', movieRoutes);
app.use('/api/wishlist', wishlistRoutes);

app.use((req, res) => {
    res.status(404).json({
        success: false,
        message: 'Route not found.',
    });
});

app.use((err, req, res, next) => {
    const statusCode = err.statusCode || err.status || 500;
    console.error('Gateway fault:', {
        method: req.method,
        path: req.originalUrl,
        message: err.message,
        details: err.details,
    });

    res.status(statusCode).json({
        success: false,
        message: err.message || 'Unexpected gateway failure.',
        retryable: statusCode >= 500,
    });
});

const PORT = process.env.PORT || 5000;
await connectDB();

app.listen(PORT, () => console.log(`Trackzio Movie Hub API listening on port ${PORT}`));
