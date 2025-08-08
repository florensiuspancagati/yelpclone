const mongoose = require('mongoose'); // to work with mongodb

module.exports = (redirectUrl = '/') => {
    return async (req, res, next) => {
        const paramId = ['id', 'place_id', 'review_id'].find(param => req.params[param]);
        
        if(!paramId) {
            return next();
        }

        const id = req.params[paramId];
        if(!mongoose.Types.ObjectId.isValid(id)) {
            req.flash('error_msg', 'Invalid id! / Data tidak ditemukan!');
            return res.redirect(redirectUrl);
        }
        next();
    }
}