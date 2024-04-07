const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt'); // For password hashing
const postgresClient = require('../services/pdb.js');

// GET route to render the signup page
router.get('/', (req, res) => {
    res.render('signup'); // Assuming you have a view named signup.ejs
});

// POST route to handle signup form submission
router.post('/', async (req, res) => {
    const { username, password } = req.body;

    try {
        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Insert the user into the database
        const query = 'INSERT INTO users (username, password) VALUES ($1, $2)';
        await postgresClient.query(query, [username, hashedPassword]);

        // Redirect to login page after successful signup
        res.redirect('/login');
    } catch (error) {
        console.error('Signup error:', error);
        res.status(500).send('Internal server error');
    }
});

module.exports = router;
