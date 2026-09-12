import mongoose from 'mongoose';

const MovieSnapshotSchema = new mongoose.Schema({
    id: { type: Number, required: true },
    title: { type: String, required: true, trim: true },
    releaseDate: { type: String, default: 'N/A' },
    rating: { type: Number, default: 0, min: 0 },
    posterPath: { type: String, default: null },
    overview: { type: String, default: '' },
}, { _id: false });

const WishlistSchema = new mongoose.Schema({
    userId: { type: String, required: true, trim: true, index: true },
    movieId: { type: Number, required: true },
    movie: { type: MovieSnapshotSchema, required: true },
}, { timestamps: true });

// Toggle lookups hit one compact compound index and the unique constraint prevents
// duplicate saves during fast double-clicks or retried client requests.
WishlistSchema.index({ userId: 1, movieId: 1 }, { unique: true });
WishlistSchema.index({ userId: 1, createdAt: -1 });

export default mongoose.model('Wishlist', WishlistSchema);
