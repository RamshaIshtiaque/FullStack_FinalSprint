const express = require('express');
const methodOverride = require('method-override');
const app = express();
const session = require('express-session');

global.DEBUG = true;
app.set('view engine', 'ejs');
app.use(express.static('public'));
app.use(express.urlencoded({ extended: true, })); // This is important!
app.use(methodOverride('_method')); // So is this!

app.use(session({
  secret: 'ramsha123', // Use a strong secret key for session encryption
  resave: false,
  saveUninitialized: false
}));

app.get('/', (req, res) => {
  res.render('index.ejs');
});

// Middleware to check if user is authenticated
const isAuthenticated = (req, res, next) => {
  if (req.session.user) {
      next(); // User is authenticated, proceed to the next middleware or route handler
  } else {
      res.redirect('/login'); // Redirect to login page if user is not authenticated
  }
};

const searchRouter = require('./routes/search');
app.use('/search', isAuthenticated, searchRouter);

const loginRouter = require('./routes/login');
app.use('/login' , loginRouter);

const signupRouter = require('./routes/signup');
app.use('/signup' , signupRouter);



const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});