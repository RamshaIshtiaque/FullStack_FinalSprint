const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');
const postgresClient = require('../services/pdb.js');
const { client: mongoClient, connectToMongoDB } = require('../services/mdb.js');

router.use(bodyParser.urlencoded({ extended: true }));

// Route for rendering the search form
router.get('/', (req, res) => {
    res.render('searchForm'); // Assuming you have a view named searchForm.ejs
});

// Route for handling form submission
router.post('/results', async (req, res) => {
    const searchQuery = req.body.searchTerm;
    const selectedDatabase = req.body.database; // Assuming you have a select input with name "database"
    console.log(searchQuery);
    console.log(selectedDatabase);

    // Results array to store results from both databases
    let results = [];

    try {
        // Query PostgreSQL database if selected or if "Both" is selected
        if (selectedDatabase === 'postgres' || selectedDatabase === 'both') {
            const postgresQuery = 'SELECT * FROM medical_procedures WHERE procedure_code LIKE $1 OR procedure_description LIKE $1 OR beneficiary_id LIKE $1'; // Add more columns as needed
            try {
                const postgresResult = await postgresClient.query(postgresQuery, ['%' + searchQuery + '%']);
                console.log('PostgreSQL Results:', postgresResult.rows);
                results = results.concat(postgresResult.rows);
            } catch (error) {
                console.error('PostgreSQL Error:', error);
            }
        }

        // Query MongoDB if selected or if "Both" is selected
if (selectedDatabase === 'mongo' || selectedDatabase === 'both') {
    await connectToMongoDB();
    
    const mongoResult = await mongoClient.db('medicine').collection('medical_procedures')
        .find({
            $or: [
                { procedure_code: { $regex: searchQuery, $options: 'i' } }, // Case-insensitive search
                { procedure_description: { $regex: searchQuery, $options: 'i' } },
                { beneficiary_id: { $regex: searchQuery, $options: 'i' } }
            ]
        })
        .toArray();

    console.log('MongoDB Results:', mongoResult);
    results = results.concat(mongoResult);
}



        // Render search results page with the obtained results
        res.render('searchResults', { results });
    } catch (error) {
        console.error('Error:', error);
        // Handle error
        res.status(500).send('Internal Server Error');
    }
});

module.exports = router;
