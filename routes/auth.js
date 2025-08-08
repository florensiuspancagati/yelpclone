const express = require('express');
const router = express.Router();
const AuthController = require('../controllers/auth');
const User = require('../models/user');
const wrapAsync = require('../utils/wrapAsync');
const passport = require('passport');

router.route('/register')
    .get(AuthController.registerForm) // render register form
    .post(wrapAsync(AuthController.register));
// login
router.route('/login')
    .get(AuthController.loginForm) // render login form
    .post(passport.authenticate('local', {
        failureRedirect: '/login',
        failureFlash: {
            type: 'error_msg',
            msg: 'Invalid username or password'
        }
    }), AuthController.login);
// logout
router.post('/logout', AuthController.logout);

module.exports = router;