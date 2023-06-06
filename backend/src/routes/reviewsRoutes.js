const express = require('express');
const router = express.Router();
const ReviewsController = require('../controllers/reviewsController');

router.post('/', ReviewsController.createReview);
router.get('/:id', ReviewsController.getReviewById);
router.put('/:id', ReviewsController.updateReviewById);
router.delete('/:id', ReviewsController.deleteReviewById);

// Route for getting reviews based on rating
router.get('/reviews', ReviewsController.getReviewsByRating);

module.exports = router;
