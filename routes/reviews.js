const express = require('express'); // to create an express router
const wrapAsync = require('../utils/wrapAsync'); // add this line
const ReviewController = require('../controllers/reviews'); // add this line
const { isAuthorReview } = require('../middlewares/isAuthor'); // to check if the user is the author of the review
const isValidObjectId = require('../middlewares/isValidObjectId'); // to validate the object id
const isAuth = require('../middlewares/isAuth'); // to check if the user is authenticated
const { validateReview } = require('../middlewares/validator'); // to validate the review data

const router = express.Router({ mergeParams: true });


// reviews
router.post('/', isAuth, validateReview, isValidObjectId('/places'), wrapAsync(ReviewController.store)); // add a review
router.delete('/:review_id', isAuth, isAuthorReview, isValidObjectId('/places'), wrapAsync(ReviewController.destroy)); // delete a review

module.exports = router; // to export the router