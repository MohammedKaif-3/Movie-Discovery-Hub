import express from 'express';
import { clearWishlist, getWishlist, toggleWishlist } from '../controllers/wishlistController.js';

const router = express.Router();

router.post('/toggle', toggleWishlist);
router.get('/:userId', getWishlist);
router.delete('/:userId', clearWishlist);

export default router;
