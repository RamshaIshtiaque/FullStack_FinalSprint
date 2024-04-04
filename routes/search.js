const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');
router.use(bodyParser.urlencoded({ extended: true }));

// Route for rendering the search form
router.get('/', (req, res) => {
    res.render('searchForm'); // Assuming you have a view named searchForm.ejs
});

// Route for handling form submission
router.post('/results', (req, res) => {
    const query = req.body.query;
    const database = req.body.database; // Assuming you have a select input with name "database"

    // Construct and execute query based on selected database
    if (selectedDatabase === 'postgres') {
        // Query PostgreSQL database
        const query = 'SELECT * FROM table WHERE column1 LIKE $1 OR column2 LIKE $1 OR column3 LIKE $1'; // Add more columns as needed

    // Execute the query
    postgresClient.query(query, ['%' + searchQuery + '%'], (err, result) => {
        if (err) {
            // Handle error
        } else {
            // Render search results page with PostgreSQL data
            res.render('searchResults', { results: result.rows });
        }
    });
    } else if (selectedDatabase === 'mongo') {
        // Query MongoDB
        // Example:
        // mongoCollection.find({ field: searchQuery }).toArray((err, result) => {
        //     if (err) {
        //         // Handle error
        //     } else {
        //         // Render search results page with MongoDB data
        //         res.render('searchResults', { results: result });
        //     }
        // });
    } else {
        // Invalid selection
        res.status(400).send('Invalid database selection');
    }

    // Render search results page with the obtained results
    res.render('searchResults', { results });
});

module.exports = router;