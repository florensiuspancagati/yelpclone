// all required modules
const ejsMate = require('ejs-mate'); // to use ejs-mate engine
const express = require('express'); // to create an express app
const methodOverride = require('method-override'); // to use put and delete methods
const mongoose = require('mongoose'); // add this line
const ErrorHandler = require('./utils/ExpressError'); // add this line
const path = require('path'); // to work with file and directory paths
const app = express(); // create an express app
const passport = require('passport'); // to use passport
const LocalStrategy = require('passport-local'); // to use local strategy
const User = require('./models/user'); // to use user model
const session = require('express-session'); // to use sessions
const flash = require('connect-flash'); // to use flash messages


const { writeHeapSnapshot } = require('v8'); // to use writeHeapSnapshot

// connect to mongodb 'DATABASE'
mongoose.connect('mongodb://127.0.0.1/bestpoint')
    .then((result) => {
        console.log('connected to mongodb');
    }).catch((err) => {
        console.log(err);
    }); 

// set the view engine
app.engine('ejs', ejsMate);
app.set('view engine', 'ejs');

// set the views directory
app.set('views', path.join(__dirname, 'views'));

// middleware
app.use(express.urlencoded({ extended: true })); // to parse the form data
app.use(methodOverride('_method')); // to use put and delete methods
app.use(express.static(path.join(__dirname, 'public'))); // to serve static files
// JWT CONFIG
app.use(session({
    secret: 'this-is-a-secret-key',
    resave: false,
    saveUninitialized: false,
    cookie: {
        httpOnly: true,
        expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
        maxAge: 1000 * 60 * 60 * 24 * 7
    }
})); // to use sessions
app.use(flash()); // to use flash messages
app.use(passport.initialize()); // to use passport
app.use(passport.session()); // to use passport
passport.use(new LocalStrategy(User.authenticate())); // to use local strategy
passport.serializeUser(User.serializeUser()); // to use passport
passport.deserializeUser(User.deserializeUser()); // to use passport
app.use((req, res, next) => {
    res.locals.currentUser = req.user;
    res.locals.success_msg = req.flash('success_msg');
    res.locals.error_msg = req.flash('error_msg');
    next();
}); // to use flash messages




// routes
app.get('/', (req, res) => {
    res.render('home');
}); // home page

app.use('/', require('./routes/auth')); // to use auth routes
app.use('/places', require('./routes/places')); // to use places routes
app.use('/places/:place_id/reviews', require('./routes/reviews')); // to use reviews routes

// middleware 
// error handling
// middleware: to handle errors
app.all('*', (req, res, next) => {
    next(new ErrorHandler('Page not found', 404));
}); // page not found

app.use((err, req, res, next) => {
    const { statusCode = 500 } = err;
    if (!err.message) err.message = 'Something went wrong'
    res.status(statusCode).render('error', { err });
}); // error page

// listen for requests 'SERVER'
app.listen(3000, () => {
    console.log(`server is running on http://127.0.0.1:3000`);
}); // server running on port 3000