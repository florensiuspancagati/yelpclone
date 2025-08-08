const express = require('express'); // to create an express router
const wrapAsync = require('../utils/wrapAsync'); // to handle async functions
const PlaceController = require('../controllers/places'); // to handle the places controller
const isValidObjectId = require('../middlewares/isValidObjectId'); // to validate the object id
const isAuth = require('../middlewares/isAuth'); // to check if the user is authenticated
const { isAuthorPlace } = require('../middlewares/isAuthor'); // to check if the user is the author of the place
const { validatePlace } = require('../middlewares/validator');
const upload = require('../configs/multer');

const router = express.Router();
 
router.route('/')
    .get(wrapAsync(PlaceController.index)) // places page
    //.post(isAuth, validatePlace, wrapAsync(PlaceController.store)); // create a new place
    .post(isAuth, upload.array('image', 5), validatePlace, wrapAsync(PlaceController.store)); // create a new place

router.get('/create', isAuth, (req, res) => {
    res.render('places/create');
}); // create place page

router.route('/:id')
    .get(isValidObjectId('/places'), wrapAsync(PlaceController.show)) // show a place
    .put(isAuth, isAuthorPlace, isValidObjectId('/places'), upload.array('image', 5), validatePlace, wrapAsync(PlaceController.update)) // update a place
    .delete(isAuth, isAuthorPlace, isValidObjectId('/places'), wrapAsync(PlaceController.destroy)); // delete a place

router.get('/:id/edit', isAuth, isAuthorPlace, isValidObjectId('/places'), wrapAsync(PlaceController.edit)); // edit a place
router.delete('/:id/images', isAuth, isAuthorPlace, isValidObjectId('/places'), wrapAsync(PlaceController.destroyImage)); // delete a place image

module.exports = router; // to export the router