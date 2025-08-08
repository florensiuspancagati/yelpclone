const mongoose = require('mongoose'); // to interact with mongodb
const Schema = mongoose.Schema; // to create a schema

const reviewSchema = new Schema({
    rating: Number,
    body: String,
    author: {
        type: Schema.Types.ObjectId,
        ref: 'User' // reference to the user model
    }
}); // schema for a review

module.exports = mongoose.model('Review', reviewSchema); // export the model