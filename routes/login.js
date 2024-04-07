const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt'); // Import bcrypt for password hashing
const pool = require('../services/pdb'); // Assuming you have a PostgreSQL pool set up
//const saltRounds = 10; // Number of salt rounds for bcrypt hashing


// Route for rendering the login form
router.get('/', (req, res) => {
    res.render('login'); // Assuming you have a view named login.ejs
});

// Route for handling login form submission
router.post('/', async (req, res) => {
    const { username, password } = req.body;

    try {
        // Query the database to find the user with the provided username
        const queryResult = await pool.query('SELECT * FROM users WHERE username = $1', [username]);

        // If no user found, render login page with error message
        if (queryResult.rows.length === 0) {
            return res.render('login', { error: 'Invalid username or password' });
        }

        // Compare the provided password with the hashed password retrieved from the database
        const hashedPassword = queryResult.rows[0].password;
        const passwordMatch = await bcrypt.compare(password, hashedPassword);

        // If passwords match, authentication successful, redirect to dashboard
        if (passwordMatch) {
            req.session.user = queryResult.rows[0].id; // Store user ID in session
            return res.redirect('/search'); // Redirect to dashboard or any other authenticated page
        } else {
            // If passwords don't match, render login page with error message
            return res.render('login', { error: 'Invalid username or password' });
        }
    } catch (error) {
        console.error('Error during login:', error);
        return res.status(500).send('Internal Server Error');
    }
});

module.exports = router;
