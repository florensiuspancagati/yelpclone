const Place = require('../models/place'); // Import the Place model
const Review = require('../models/review'); // Import the Review model

module.exports.store = async(req, res) => {
    const { place_id } = req.params; // get the place id from the params

    const review = new Review(req.body.review);
    review.author = req.user._id; // get the user id from the session
    await review.save();
    
    const place = await Place.findById(place_id);
    place.reviews.push(review);
    await place.save();

    req.flash('success_msg', 'Review added successfully!'); // to show a flash message
    res.redirect(`/places/${place_id}`);
} // add a review

module.exports.destroy = async (req, res) => {
    const { place_id, review_id } = req.params;
    await Place.findByIdAndUpdate(place_id, { $pull: { reviews: review_id } });
    await Review.findByIdAndDelete(review_id);
    req.flash('success_msg', 'Review deleted successfully!'); // to show a flash message
    res.redirect(`/places/${place_id}`);
} // delete a review