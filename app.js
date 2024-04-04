const express = require('express');
const methodOverride = require('method-override');
const app = express();

global.DEBUG = true;
app.set('view engine', 'ejs');
app.use(express.static('public'));
app.use(express.urlencoded({ extended: true, })); // This is important!
app.use(methodOverride('_method')); // So is this!

app.get('/', (req, res) => {
  res.render('index.ejs', { name: 'Peter'});
});

const searchRouter = require('./routes/search');
app.use('/search', searchRouter);



const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});