const mongoose = require('mongoose'); // to interact with mongodb
const Schema = mongoose.Schema; // to create a schema
const passportLocalMongoose = require('passport-local-mongoose'); // to use passport with mongodb

const userSchema = new Schema({
    email: {
        type: String,
        required: true,
        unique: true
    }
}); // schema for a user
userSchema.plugin(passportLocalMongoose); // to use passport with mongodb
module.exports = mongoose.model('User', userSchema); // export the model