'use strict';

const express = require('express');
const exphbs = require('express-handlebars');
const bodyParser = require('body-parser');
const methodOverride = require('method-override');
const PORT = process.env.PORT || 8080;
const gallery = require('./routes/gallery');
const listing = require('./routes/listing');

const app = express();

app.engine('.hbs', exphbs({ extname: '.hbs', defaultLayout: 'main.hbs' }));
app.set('view engine', '.hbs');

app.use(bodyParser.urlencoded());
app.use(methodOverride('_method'));
app.use(express.static('public'));
app.use('/', listing);
app.use('/gallery', gallery);

app.listen(PORT, () => {
  console.log(`Server is up and running on PORT: ${PORT}`);
});
