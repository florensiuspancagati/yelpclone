const Place = require('../models/place'); // Import the Place model
const fs = require('fs'); // Import the file system module
const { geometry } = require('../utils/geoapifyMaps'); // Import the geoapify module
const ExpressError = require('../utils/ExpressError'); // Import the error handler

module.exports.index = async(req, res) => {
    const places = await Place.find();
    res.render('places/index', { places });
} // to show all places

module.exports.store = async(req, res) => {
    const images = req.files.map(file => ({
        url: file.path,
        filename: file.filename
    })); // to get the images from the request

    const geoData = await geometry(req.body.place.location); // to get the location from the request
    console.log(geoData); // to check the location data
    const place = new Place(req.body.place);
    place.author = req.user._id; // to get the user id from the request
    place.images = images; // to get the images from the request
    place.geometry = geoData; // to get the location from the request

    await place.save();
    
    req.flash('success_msg', 'Place added successfully!'); // to show a flash message
    res.redirect('/places');
} // to create a new place

module.exports.show = async(req, res) => {
    const place = await Place.findById(req.params.id)
        .populate({
            path: 'reviews',
            populate: {
                path: 'author',
            }
        })
        .populate('author');
    res.render('places/show', { place });
} // to show a place

module.exports.edit = async(req, res) => {
    const place = await Place.findById(req.params.id);
    req.flash('success_msg', 'Place updated successfully!'); // to show a flash message
    res.render('places/edit', { place });
} // to edit a place

module.exports.update = async(req, res) => {
    const place = await Place.findByIdAndUpdate(req.params.id, {...req.body.place});
    
    if(req.files && req.files.length > 0) {
        place.images.forEach(image => {
            fs.unlink(image.url, err => new ExpressError(err)); // to delete the old images from the server
        })
        
        const images = req.files.map(file => ({
            url: file.path,
            filename: file.filename
        })); // to get the images from the request
        place.images = images;
        await place.save();
    }
    
    req.flash('success_msg', 'Place updated successfully!'); // to show a flash message
    res.redirect(`/places/${place._id}`);
} // to update a place

module.exports.destroy = async(req, res) => {
    const { id } = req.params;
    const place = await Place.findById(id);

    if(place.images.length > 0) {
        place.images.forEach(image => {
            fs.unlink(image.url, err => new ExpressError(err)); // to delete the old images from the server
        })
    }

    await place.deleteOne();

    req.flash('success_msg', 'Place delete successfully!'); // to show a flash message
    res.redirect('/places');
} // to delete a place

module.exports.destroyImage = async(req, res) => {
    try {
        const { id } = req.params;
        const { images } = req.body;

        if(!images || images.length === 0) {
            req.flash('error_msg', 'No images to delete!'); // to show a flash message
            return res.redirect(`/places/${id}/edit`);
        }

        images.forEach(image => {
            fs.unlinkSync(image); // to delete the old images from the server
        })

        await Place.findByIdAndUpdate(
            id,
            { $pull: { images: { url: { $in: images } } } } // to remove the images from the database
        );

        req.flash('success_msg', 'images deleted successfully!'); // to show a flash message
        return res.redirect(`/places/${id}/edit`); // to redirect to the edit page

    } catch (error) {
        req.flash('error_msg', 'Failed to delete images!'); // to show a flash message
        return res.redirect(`/places/${id}/edit`); // to redirect to the edit page
    }
} // to delete a place image