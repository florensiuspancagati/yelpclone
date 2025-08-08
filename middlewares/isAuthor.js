const Place = require('../models/place');
const Review = require('../models/review'); // to import the review model

module.exports.isAuthorPlace = async (req, res, next) => {
    const {id} = req.params;
    let place = await Place.findById(id);

    if(!place.author.equals(req.user._id)) {
        req.flash('error_msg', 'Not authorized to do that!'); // to show a flash message
        return res.redirect('/places');
    }; // to check if the user is the author of the place

    next(); // to go to the next middleware
}

module.exports.isAuthorReview = async (req, res, next) => {
    const { place_id, review_id } = req.params;
    let review = await Review.findById(review_id);

    if(!review.author.equals(req.user._id)) {
        req.flash('error_msg', 'Not authorized to do that!'); // to show a flash message
        return res.redirect(`/places/${place_id}`);
    }; // to check if the user is the author of the place

    next(); // to go to the next middleware
}