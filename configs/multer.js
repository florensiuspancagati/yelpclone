const multer = require('multer');
const path = require('path');
const ExpressError = require('../utils/ExpressError');

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'public/images/'); // Set the destination folder for uploaded files
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  } // Set the filename for the uploaded file
});

const upload = multer({
    storage: storage,
    fileFilter: function (req, file, cb) {

        if(file.mimetype.startsWith('image/')) {
            cb(null, true); // Accept the file if it is an image
        } else {
            cb(new ExpressError('Only image files are allowed!'), 405); // Reject the file if it is not an image
        }
    }
});

module.exports = upload; // Export the multer instance for use in other files
